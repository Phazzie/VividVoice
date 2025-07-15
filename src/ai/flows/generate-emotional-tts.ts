
'use server';

/**
 * @fileOverview Implements AI-driven text-to-speech for expressive voice acting in narratives.
 *
 * - generateEmotionalTTS - A function that generates expressive speech for a given story.
 * - GenerateEmotionalTTSInput - The input type for the generateEmotionalTTS function.
 * - GenerateEmotionalTTSOutput - The return type for the generateEmotionalTTS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import { type DialogueSegment } from './parse-dialogue';

const GenerateEmotionalTTSInputSchema = z.object({
  segments: z.array(z.object({
    character: z.string(),
    dialogue: z.string(),
    emotion: z.string(),
  })).describe('An array of dialogue segments, each with a character, dialogue, and an associated emotion.'),
});
export type GenerateEmotionalTTSInput = z.infer<typeof GenerateEmotionalTTSInputSchema>;

const GenerateEmotionalTTSOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The audio data URI of the generated speech in WAV format.'),
});
export type GenerateEmotionalTTSOutput = z.infer<typeof GenerateEmotionalTTSOutputSchema>;

export async function generateEmotionalTTS(input: GenerateEmotionalTTSInput): Promise<GenerateEmotionalTTSOutput> {
  return generateEmotionalTTSFlow(input);
}

const generateEmotionalTTSFlow = ai.defineFlow(
  {
    name: 'generateEmotionalTTSFlow',
    inputSchema: GenerateEmotionalTTSInputSchema,
    outputSchema: GenerateEmotionalTTSOutputSchema,
  },
  async input => {
    const {segments} = input;
    const availableVoices = ['Algenib', 'Achernar', 'Enif', 'Hadar', 'Izar', 'Mirfak', 'Regulus', 'Deneb', 'Capella', 'Vega'];
    
    const uniqueCharacters = [...new Set(segments.map(s => s.character))];
    const speakerVoiceConfigs: any[] = [];
    const speakerMap: {[key: string]: string} = {};
    
    uniqueCharacters.forEach((characterName, index) => {
      const speakerId = `Speaker${index + 1}`;
      const voiceName = availableVoices[index % availableVoices.length];
      speakerMap[characterName] = speakerId;
      
      speakerVoiceConfigs.push({
        speaker: speakerId,
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceName },
        },
      });
    });

    // The prompt is crucial. It instructs the model on how to perform.
    // By providing the emotion in parentheses, we guide the TTS model to deliver the line with the intended feeling.
    let prompt = segments.map(segment => {
      const speakerId = speakerMap[segment.character];
      // Format: SpeakerID: (Emotion) Dialogue
      return `${speakerId}: (${segment.emotion}) ${segment.dialogue}`;
    }).join('\n');

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakerVoiceConfigs,
          },
        },
      },
      prompt: prompt,
    });

    if (!media) {
      throw new Error('No media returned from TTS generation.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {audioDataUri};
  }
);

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
