
'use server';

/**
 * @fileOverview An AI agent that identifies and suggests inversions for literary tropes.
 * 
 * - invertTropes - A function that handles the trope analysis.
 * - InvertTropesInput - The input type for the function.
 * - InvertTropesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { TropeSchema } from '@/ai/schemas';

const InvertTropesInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type InvertTropesInput = z.infer<typeof InvertTropesInputSchema>;

const InvertTropesOutputSchema = z.object({
    tropes: z.array(TropeSchema),
});
export type InvertTropesOutput = z.infer<typeof InvertTropesOutputSchema>;


export async function invertTropes(input: InvertTropesInput): Promise<InvertTropesOutput> {
    return invertTropesFlow(input);
}


const invertTropesFlow = ai.defineFlow(
    {
        name: 'invertTropesFlow',
        inputSchema: InvertTropesInputSchema,
        outputSchema: InvertTropesOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'tropeInverterPrompt',
            input: {schema: InvertTropesInputSchema},
            output: {schema: InvertTropesOutputSchema},
            prompt: `You are a brilliant and subversive literary critic and editor, known for your ability to deconstruct and reconstruct narratives. Your task is to analyze the provided story text for common literary tropes and offer creative ways to subvert them.

For each trope you identify, you must provide:
1.  The 'trope' name (e.g., "The Chosen One," "Damsel in Distress," "The Mentor," "Love Triangle," "Amnesiac Hero").
2.  A direct 'quote' from the text that perfectly exemplifies this trope.
3.  A creative and insightful 'inversionSuggestion' that subverts, deconstructs, or cleverly twists the trope to make the story more original and unpredictable. The suggestion should be actionable for the writer, offering a concrete alternative direction.

Return your findings as a JSON object with a 'tropes' array. If no clear tropes are found, return an empty array.

**Story Text to Analyze:**
\`\`\`
{{{storyText}}}
\`\`\`
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
