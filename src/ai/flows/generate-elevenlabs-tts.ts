'use server';

/**
 * @fileOverview Implements an AI agent that generates audio using the ElevenLabs API.
 *
 * - generateElevenLabsTTS - A function that handles the ElevenLabs TTS generation.
 * - GenerateElevenLabsTTSInput - The input type for the function.
 * - GenerateElevenLabsTTSOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { elevenlabs } from 'elevenlabs';

const GenerateElevenLabsTTSInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceId: z.string().describe('The ElevenLabs voice ID to use.'),
});
export type GenerateElevenLabsTTSInput = z.infer<typeof GenerateElevenLabsTTSInputSchema>;

const GenerateElevenLabsTTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The data URI of the generated audio.'),
});
export type GenerateElevenLabsTTSOutput = z.infer<typeof GenerateElevenLabsTTSOutputSchema>;

export async function generateElevenLabsTTS(input: GenerateElevenLabsTTSInput): Promise<GenerateElevenLabsTTSOutput> {
    return generateElevenLabsTTSFlow(input);
}

const generateElevenLabsTTSFlow = ai.defineFlow(
  {
    name: 'generateElevenLabsTTSFlow',
    inputSchema: GenerateElevenLabsTTSInputSchema,
    outputSchema: GenerateElevenLabsTTSOutputSchema,
  },
  async (input) => {
    const { text, voiceId } = input;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found in environment variables.');
    }

    const client = new elevenlabs({
        apiKey: apiKey,
    });

    const audio = await client.generate({
      voice: voiceId,
      text,
      model_id: "eleven_multilingual_v2"
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const content = Buffer.concat(chunks);

    return {
      audioDataUri: `data:audio/mpeg;base64,${content.toString('base64')}`,
    };
  }
);
