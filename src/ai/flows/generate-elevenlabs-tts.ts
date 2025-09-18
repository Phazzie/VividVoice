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
    if (!elevenlabsClient) {
        throw new Error('ElevenLabs API key not configured. Please set ELEVENLABS_API_KEY environment variable.');
    }

    try {
        const audioStream = await elevenlabsClient.textToSpeech.convert(
            input.voiceId,
            {
                text: input.text,
            }
        );

        // Convert stream to buffer and then to data URI
        const chunks: Buffer[] = [];
        const reader = audioStream.getReader();
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(Buffer.from(value));
            }
        } finally {
            reader.releaseLock();
        }
        const audioBuffer = Buffer.concat(chunks);
        const audioDataUri = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;

        return { audioDataUri };
    } catch (error) {
        console.error('ElevenLabs TTS generation failed:', error);
        throw new Error('Failed to generate TTS audio');
    }
}

const generateElevenLabsTTSFlow = ai.defineFlow(
  {
    name: 'generateElevenLabsTTSFlow',
    inputSchema: GenerateElevenLabsTTSInputSchema,
    outputSchema: GenerateElevenLabsTTSOutputSchema,
  },
  async (input) => {
    const { text, voiceId } = input;

    // TODO: Fix ElevenLabs API usage after merge
    throw new Error('ElevenLabs TTS generation temporarily disabled during merge resolution. API usage needs to be updated.');
    
    /* 
    if (!elevenlabsClient) {
      throw new Error('ElevenLabs API key not found in environment variables.');
    }

    const audio = await elevenlabsClient.generate({
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
    */
  }
);
