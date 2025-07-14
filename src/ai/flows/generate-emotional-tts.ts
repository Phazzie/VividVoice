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

const GenerateEmotionalTTSInputSchema = z.object({
  storyText: z
    .string()
    .describe('The story text to be converted to speech, with character names preceding their dialogue.'),
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
    const {storyText} = input;

    // Regular expression to match speaker and dialogue
    const speakerRegex = /^\s*([\w\s]+):\s*(.+)$/gm;
    let match;
    const speakerVoiceConfigs: any[] = [];
    let prompt = '';
    let speakerCounter = 1;
    const speakerMap: {[key: string]: string} = {};

    while ((match = speakerRegex.exec(storyText)) !== null) {
      const speaker = match[1].trim();
      const dialogue = match[2].trim();

      // Assign a unique speaker ID if not already assigned
      if (!speakerMap[speaker]) {
        speakerMap[speaker] = `Speaker${speakerCounter++}`;
        // You can customize voice configurations here based on speaker names
        speakerVoiceConfigs.push({
          speaker: speakerMap[speaker],
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: speakerCounter % 2 === 0 ? 'Algenib' : 'Achernar'},
          },
        });
      }

      prompt += `${speakerMap[speaker]}: ${dialogue}\n`;
    }

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
