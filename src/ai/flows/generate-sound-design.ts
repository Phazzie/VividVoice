
'use server';

/**
 * @fileOverview An AI agent that scans a story for sound effect cues.
 *
 * - generateSoundDesign - A function that handles the sound design analysis.
 * - GenerateSoundDesignInput - The input type for the function.
 * - GenerateSoundDesignOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SoundEffectSchema } from '@/ai/schemas';

const GenerateSoundDesignInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze for sound cues.'),
});
export type GenerateSoundDesignInput = z.infer<typeof GenerateSoundDesignInputSchema>;

const GenerateSoundDesignOutputSchema = z.object({
    soundEffects: z.array(SoundEffectSchema),
});
export type GenerateSoundDesignOutput = z.infer<typeof GenerateSoundDesignOutputSchema>;


export async function generateSoundDesign(input: GenerateSoundDesignInput): Promise<GenerateSoundDesignOutput> {
    return generateSoundDesignFlow(input);
}


const generateSoundDesignFlow = ai.defineFlow(
    {
        name: 'generateSoundDesignFlow',
        inputSchema: GenerateSoundDesignInputSchema,
        outputSchema: GenerateSoundDesignOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'soundDesignPrompt',
            input: {schema: GenerateSoundDesignInputSchema},
            output: {schema: GenerateSoundDesignOutputSchema},
            prompt: `You are a foley artist and sound designer for an audiobook. Your task is to read the provided story text and identify explicit or strongly implied sound effects within the NARRATOR'S text only. Do not add sounds for character dialogue.

Break the story down into an array of dialogue or narrative segments first to get segment indexes.

For each sound effect you identify, provide:
1.  The 'segmentIndex': The zero-based index of the narrative segment where the sound occurs.
2.  The 'description' of the sound event from the text (e.g., "a door creaked open," "the wind howled," "a glass shattered").
3.  A short, simple 'soundQuery' (1-3 words) that could be used to search a sound effects library (e.g., "door creak," "strong wind," "glass breaking").

Return your findings as a JSON object with a 'soundEffects' array. If no sound effects are found, return an empty array.

Story Text:
{{{storyText}}}
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
