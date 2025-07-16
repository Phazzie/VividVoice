
'use server';

/**
 * @fileOverview A seam for the Unreliable Narrator feature.
 * THIS IS A PLACEHOLDER/SEAM file. The logic is not implemented yet.
 * 
 * - applyNarratorBias - A function that will rewrite the story with a biased narrator.
 * - ApplyNarratorBiasInput - The input type for the function.
 * - ApplyNarratorBiasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { NarratorBiasSchema } from '@/ai/schemas';

const ApplyNarratorBiasInputSchema = z.object({
  storyText: z.string().describe('The original, unbiased text of the story.'),
  bias: NarratorBiasSchema.describe('The specific bias to apply to the narrator.'),
});
export type ApplyNarratorBiasInput = z.infer<typeof ApplyNarratorBiasInputSchema>;

const ApplyNarratorBiasOutputSchema = z.object({
    biasedStoryText: z.string().describe('The rewritten story text with the applied narrator bias.'),
});
export type ApplyNarratorBiasOutput = z.infer<typeof ApplyNarratorBiasOutputSchema>;


export async function applyNarratorBias(input: ApplyNarratorBiasInput): Promise<ApplyNarratorBiasOutput> {
    console.log(`SEAM: Called applyNarratorBias AI flow with bias: ${input.bias}. Returning mocked data.`);
    
    // This is a seam. We return mocked data that matches the schema.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

    const biasedText = `Narrator: The old house, if you could call it that, squatted on the hill, practically sneering at the town below. A bitter wind, the kind that feels personal, clawed through the grass.
Alice: It looks a bit spooky. Are you sure about this, Bob?
Bob: (He said with a foolish grin) Don't be silly, it's just an old house. Think of the adventure! We'll be famous!
Alice: (She was always so timid.) I'd rather be safe than famous.
Narrator: Bob, in his usual reckless fashion, was already stomping on the porch steps, which groaned under his weight. Alice, predictably, hesitated, clutching that drab shawl of hers.`;

    return {
        biasedStoryText: biasedText
    };
}
