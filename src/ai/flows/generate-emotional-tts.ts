
'use server';

/**
 * @fileOverview Implements AI-driven text-to-speech for expressive voice acting in narratives.
 * This flow is designed to generate a single audio clip for one line of dialogue.
 *
 * - generateEmotionalTTS - A function that generates expressive speech for a given story segment.
 * - GenerateEmotionalTTSInput - The input type for the generateEmotionalTTS function.
 * - GenerateEmotionalTTSOutput - The return type for the generateEmotionalTTS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateEmotionalTTSInputSchema = z.object({
  dialogue: z.string(),
  emotion: z.string(),
  voice: z.string().describe("The specific voice to use for generation, e.g., 'en-US-Standard-A'"),
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
    const {dialogue, emotion, voice} = input;
    
    // The prompt is crucial. It instructs the model on how to perform.
    // By providing the emotion in parentheses, we guide the TTS model to deliver the line with the intended feeling.
    const prompt = `(${emotion}) ${dialogue}`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
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

/**
 * Converts raw PCM audio data into a Base64-encoded WAV format string.
 * This is necessary because the TTS model returns raw audio data, and the <audio>
 * HTML element requires a proper container format like WAV.
 * @param pcmData The raw PCM audio data from the TTS model.
 * @param channels The number of audio channels (e.g., 1 for mono).
 * @param rate The sample rate of the audio (e.g., 24000 Hz).
 * @param sampleWidth The width of each audio sample in bytes (e.g., 2 for 16-bit).
 * @returns A Promise that resolves to a Base64-encoded string of the WAV file.
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
