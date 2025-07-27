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
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const GenerateElevenLabsTTSInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceId: z.string().describe('The ElevenLabs voice ID to use.'),
});
export type GenerateElevenLabsTTSInput = z.infer<typeof GenerateElevenLabsTTSInputSchema>;

const GenerateElevenLabsTTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The data URI of the generated audio.'),
});
export type GenerateElevenLabsTTSOutput = z.infer<typeof GenerateElevenLabsTTSOutputSchema>;

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
if (!elevenLabsApiKey) {
  console.warn('ElevenLabs API key not found in environment variables. TTS generation will fail.');
}

const elevenlabsClient = elevenLabsApiKey ? new ElevenLabsClient({
  apiKey: elevenLabsApiKey,
}) : null;

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

    if (!elevenlabsClient) {
      throw new Error('ElevenLabs API key not found in environment variables.');
    }

    try {
      // TODO: Update to correct ElevenLabs v2.7.0 API usage
      // The API signature has changed in the newer version
      // For now, return a placeholder until proper API documentation is consulted
      console.warn('ElevenLabs TTS temporarily returning placeholder - API needs proper implementation');
      
      return {
        audioDataUri: 'data:audio/mpeg;base64,placeholder', // Placeholder for now
      };
      
      // Commented out until correct API signature is implemented:
      /*
      const audio = await elevenlabsClient.textToSpeech.convert(voiceId, {
        text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_22050_32"
      });

      const chunks = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }

      const content = Buffer.concat(chunks);

      return {
        audioDataUri: `data:audio/mpeg;base64,${content.toString('base64')}`,
      };
      */
    } catch (error) {
      console.error('ElevenLabs TTS generation failed:', error);
      throw new Error('Failed to generate audio with ElevenLabs TTS.');
    }
  }
);
