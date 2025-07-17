
'use server';

/**
 * @fileOverview An AI agent that rewrites a story to reflect a specific narrator bias.
 * 
 * - applyNarratorBias - A function that handles rewriting the story with a biased narrator.
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
   return applyNarratorBiasFlow(input);
}

const applyNarratorBiasFlow = ai.defineFlow(
    {
        name: 'applyNarratorBiasFlow',
        inputSchema: ApplyNarratorBiasInputSchema,
        outputSchema: ApplyNarratorBiasOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'unreliableNarratorPrompt',
            input: {schema: ApplyNarratorBiasInputSchema},
            output: {schema: ApplyNarratorBiasOutputSchema},
            prompt: `You are a master storyteller and editor. Your task is to rewrite the provided story text by imbuing the narrator's voice with a specific bias.

**CRITICAL INSTRUCTIONS:**
1.  **Do NOT change the characters' dialogue.** The dialogue lines must remain exactly as they are in the original text, including the character name prefixes (e.g., "Alice:").
2.  **Only modify the narrator's text.** Subtly alter the descriptions, word choices, and sentence structures of the narrator's parts to reflect the specified bias.
3.  The bias should be woven into the narrative subtly. Show, don't tell the bias. For example, if the bias is "Jealous of Main Character," describe the character's successes with a hint of sarcasm or downplay their achievements.
4.  Preserve the original plot points. The sequence of events should remain the same.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: The hero, John, stood tall, his armor gleaming in the sun.
  John: I am here to save you!
  Narrator: He bravely fought the monster.
  \`\`\`
- **Input Bias:** "Jealous of Main Character"
- **Your Perfect Output Text:**
  \`\`\`
  Narrator: John, if you could call him a 'hero', posed dramatically, making sure the sun glinted off his polished armor.
  John: I am here to save you!
  Narrator: He flailed wildly at the creature, getting in a lucky shot or two.
  \`\`\`

**Specified Bias to Apply:**
{{bias}}

**Original Story Text:**
\`\`\`
{{storyText}}
\`\`\`

Now, return the rewritten story as a single JSON object with the key 'biasedStoryText'. The entire story, including the unchanged dialogue, should be in this single string.
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
