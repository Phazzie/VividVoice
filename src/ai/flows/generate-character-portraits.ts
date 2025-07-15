
'use server';

/**
 * @fileOverview Implements AI-driven generation of character portraits based on descriptions from a story.
 *
 * - generateCharacterPortraits - Generates portraits for a list of characters.
 * - GenerateCharacterPortraitsInput - The input type for the function.
 * - GenerateCharacterPortraitsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema } from '@/ai/schemas';

const GenerateCharacterPortraitsInputSchema = z.object({
  characters: z.array(CharacterSchema).describe('An array of characters with their names and descriptions.'),
});
export type GenerateCharacterPortraitsInput = z.infer<typeof GenerateCharacterPortraitsInputSchema>;

const CharacterPortraitSchema = z.object({
  name: z.string(),
  portraitDataUri: z.string().describe('The data URI of the generated portrait image.'),
});

const GenerateCharacterPortraitsOutputSchema = z.array(CharacterPortraitSchema);
export type GenerateCharacterPortraitsOutput = z.infer<typeof GenerateCharacterPortraitsOutputSchema>;


export async function generateCharacterPortraits(input: GenerateCharacterPortraitsInput): Promise<GenerateCharacterPortraitsOutput> {
  return generateCharacterPortraitsFlow(input);
}


const generateCharacterPortraitsFlow = ai.defineFlow(
  {
    name: 'generateCharacterPortraitsFlow',
    inputSchema: GenerateCharacterPortraitsInputSchema,
    outputSchema: GenerateCharacterPortraitsOutputSchema,
  },
  async input => {
    const portraitPromises = input.characters.map(async (character) => {
        // We skip the narrator as they don't need a portrait.
        if (character.name.toLowerCase() === 'narrator') {
            return null;
        }

        const {media} = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Generate a vibrant, artistic character portrait based on this description: "${character.description}". The style should be expressive and colorful, fitting a fantasy or sci-fi narrative. Focus on the face and shoulders.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        if (!media) {
          // In case image generation fails for one character, we can return null and handle it in the UI.
          return null;
        }
        
        return {
            name: character.name,
            portraitDataUri: media.url,
        };
    });

    const results = await Promise.all(portraitPromises);
    // Filter out any null results from skipped characters or failed generations.
    return results.filter(result => result !== null) as GenerateCharacterPortraitsOutput;
  }
);
