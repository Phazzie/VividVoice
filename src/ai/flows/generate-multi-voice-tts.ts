
'use server';

/**
 * @fileOverview Implements an advanced AI-driven text-to-speech system for generating
 * multi-cast narrative audio. This flow assigns unique voices to characters and
 * generates a single audio file with different speakers using SSML. It now also
 * returns a detailed transcript with word-level timings for accurate playback highlighting.
 *
 * - generateMultiVoiceTTS - A function that generates expressive speech and a transcript.
 * - GenerateMultiVoiceTTSInput - The input type for the function.
 * - GenerateMultiVoiceTTSOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import SsmlBuilder from 'ssml-builder';
import { DialogueSegmentSchema, CharacterSchema, TranscriptSegmentSchema } from '@/ai/schemas';

const GenerateMultiVoiceTTSInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema).describe('An array of dialogue segments for a scene.'),
  characters: z.array(CharacterSchema).describe('A list of unique character objects with voice assignments.'),
});
export type GenerateMultiVoiceTTSInput = z.infer<typeof GenerateMultiVoiceTTSInputSchema>;

const GenerateMultiVoiceTTSOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The audio data URI of the generated speech in WAV format.'),
  transcript: z.array(TranscriptSegmentSchema).describe('A detailed transcript with word-level timings.'),
});
export type GenerateMultiVoiceTTSOutput = z.infer<typeof GenerateMultiVoiceTTSOutputSchema>;

export async function generateMultiVoiceTTS(input: GenerateMultiVoiceTTSInput): Promise<GenerateMultiVoiceTTSOutput> {
  return generateMultiVoiceTTSFlow(input);
}

const generateMultiVoiceTTSFlow = ai.defineFlow(
  {
    name: 'generateMultiVoiceTTSFlow',
    inputSchema: GenerateMultiVoiceTTSInputSchema,
    outputSchema: GenerateMultiVoiceTTSOutputSchema,
  },
  async ({ segments, characters }) => {
    const characterVoiceMap = new Map<string, string>();
     characters.forEach(char => {
        if (char.voiceId) {
            characterVoiceMap.set(char.name, char.voiceId);
        }
    });
    // Ensure Narrator has a default voice if not assigned.
    if (!characterVoiceMap.has('Narrator')) {
        characterVoiceMap.set('Narrator', 'en-US-Standard-A');
    }

    let ssml = new SsmlBuilder({ root: true });
    segments.forEach((segment, index) => {
      // Add a slight pause between segments for better pacing.
      ssml.pause('150ms');

      // Use a <mark> tag to associate parts of the SSML with our original segments
      const markName = `seg_${index}`;
      ssml.mark({ name: markName });
      
      // We pass the emotion in parenthesis to the TTS model for expressive performance.
      const ssmlText = `(${segment.emotion}) ${segment.dialogue}`;
      const voice = characterVoiceMap.get(segment.character);
      
      if (voice) {
        // Use the AI-selected voice for the character
        const voiceElement = ssml.voice({name: voice});
        voiceElement.prosody({
            rate: 'medium', // We can adjust rate/pitch later if needed
            pitch: 'medium'
        }, ssmlText);
      } else {
        // Fallback for any character without a voice
         ssml.prosody({
            rate: 'medium',
            pitch: 'medium'
        }, ssmlText);
      }
    });

    const ssmlString = ssml.toString();
    
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: { 
        // Request both AUDIO and a TRANSCRIPT with timing information
        responseModalities: ['AUDIO', 'TRANSCRIPT'],
      },
      prompt: ssmlString,
    });
    
    const media = response.media;
    const ttsTranscript = (response as any).transcript;

    if (!media || !ttsTranscript) {
      throw new Error('No media or transcript returned from TTS generation.');
    }

    // Convert the raw PCM audio data to a playable WAV format
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    // Process the raw TTS transcript to align with our original segments for highlighting
    const finalTranscript = processTranscript(ttsTranscript, segments);
    
    return {audioDataUri, transcript: finalTranscript };
  }
);


/**
 * Converts raw PCM audio data into a Base64-encoded WAV format string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

/**
 * Processes the raw transcript from the TTS API to match our segment structure,
 * enabling precise playback highlighting.
 * @param rawTranscript The raw transcript from the TTS API, which includes word timings and mark timings.
 * @param segments The original dialogue segments sent to the API.
 * @returns A structured transcript aligned with the original segments.
 */
function processTranscript(rawTranscript: any[], segments: z.infer<typeof DialogueSegmentSchema>[]): z.infer<typeof TranscriptSegmentSchema>[] {
    // First, create a map of all the <mark> tags and their start times.
    const markTimings: { [key: string]: number } = {};
    rawTranscript.forEach(item => {
        if (item.markName) {
            markTimings[item.markName] = item.startTime;
        }
    });

    // Create a time range for each of our original segments using the mark timings.
    const segmentTimings = segments.map((_, index) => {
        const startTime = markTimings[`seg_${index}`] || 0;
        // The end time is the start time of the *next* segment.
        const nextStartTime = markTimings[`seg_${index + 1}`] || Infinity;
        return { index, startTime, endTime: nextStartTime };
    });

    const finalTranscript: z.infer<typeof TranscriptSegmentSchema>[] = [];
    segmentTimings.forEach(({ index, startTime, endTime }) => {
        // Filter the raw transcript to get only the words that fall within this segment's time range.
        const wordsForSegment = rawTranscript.filter(item => 
            item.word && item.startTime >= startTime && item.startTime < endTime
        );

        // The true end time of the segment is the end time of its last word.
        const segmentEndTime = wordsForSegment.length > 0 ? wordsForSegment[wordsForSegment.length - 1].endTime : startTime;
        
        finalTranscript.push({
            segmentIndex: index,
            words: wordsForSegment.map(w => ({
                word: w.word,
                startTime: w.startTime,
                endTime: w.endTime,
            })),
            startTime: startTime,
            endTime: segmentEndTime,
        });
    });

    return finalTranscript;
}
