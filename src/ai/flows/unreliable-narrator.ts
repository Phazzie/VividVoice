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
import { NarratorBiasSchema, NarratorBiasEnum } from '@/ai/schemas';

const ApplyNarratorBiasInputSchema = z.object({
  storyText: z.string().describe('The original, unbiased text of the story.'),
  bias: z.object({
    startBias: NarratorBiasEnum.describe("The narrator's bias at the beginning of the story."),
    endBias: NarratorBiasEnum.describe("The narrator's bias at the end of the story."),
  }).describe('The evolving bias to apply to the narrator.'),
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
            prompt: `You are a master storyteller and editor. Your task is to rewrite the provided story text by imbuing the narrator's voice with a bias that evolves over the course of the narrative.

**CRITICAL INSTRUCTIONS:**
1.  **Do NOT change the characters' dialogue.** The dialogue lines must remain exactly as they are in the original text, including the character name prefixes (e.g., "Alice:").
2.  **Only modify the narrator's text.** Subtly alter the descriptions, word choices, and sentence structures of the narrator's parts to reflect the evolving bias.
3.  The bias should transition smoothly from the 'startBias' to the 'endBias' over the course of the story. Show, don't tell the bias.
4.  Preserve the original plot points. The sequence of events should remain the same.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: The hero, John, stood tall, his armor gleaming in the sun.
  John: I am here to save you!
  Narrator: He bravely fought the monster.
  ... (many pages later) ...
  Narrator: John took the king's reward, a wide smile on his face.
  \`\`\`
- **Input Bias:**
  - **startBias:** "Admires Main Character"
  - **endBias:** "Jealous of Main Character"
- **Your Perfect Output Text:**
  \`\`\`
  Narrator: The hero, John, stood tall, his armor a beacon gleaming in the sun.
  John: I am here to save you!
  Narrator: He fought the monster with a courage that was breathtaking to behold.
  ... (many pages later) ...
  Narrator: John snatched the king's reward, a greedy, undeserving smile plastered on his face.
  \`\`\`

**Specified Bias to Apply:**
- **startBias:** {{bias.startBias}}
- **endBias:** {{bias.endBias}}

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
