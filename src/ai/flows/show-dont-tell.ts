
'use server';

/**
 * @fileOverview An AI agent that identifies "telling" sentences and suggests "showing" alternatives.
 * 
 * - getShowDontTellSuggestions - A function that handles the analysis.
 * - GetShowDontTellSuggestionsInput - The input type for the function.
 * - GetShowDontTellSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ShowDontTellSuggestionSchema } from '@/ai/schemas';

const GetShowDontTellSuggestionsInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type GetShowDontTellSuggestionsInput = z.infer<typeof GetShowDontTellSuggestionsInputSchema>;

const GetShowDontTellSuggestionsOutputSchema = z.object({
    suggestions: z.array(ShowDontTellSuggestionSchema),
});
export type GetShowDontTellSuggestionsOutput = z.infer<typeof GetShowDontTellSuggestionsOutputSchema>;


export async function getShowDontTellSuggestions(input: GetShowDontTellSuggestionsInput): Promise<GetShowDontTellSuggestionsOutput> {
    return getShowDontTellSuggestionsFlow(input);
}


const getShowDontTellSuggestionsFlow = ai.defineFlow(
    {
        name: 'getShowDontTellSuggestionsFlow',
        inputSchema: GetShowDontTellSuggestionsInputSchema,
        outputSchema: GetShowDontTellSuggestionsOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'showDontTellPrompt',
            input: {schema: GetShowDontTellSuggestionsInputSchema},
            output: {schema: GetShowDontTellSuggestionsOutputSchema},
            prompt: `You are a creative writing instructor specializing in the "Show, Don't Tell" principle. Your task is to analyze the provided story text.

First, identify any sentences that are "telling" the reader something instead of "showing" it. These are often sentences that state a character's emotion directly (e.g., "She was angry") or summarize an event without detail.

For each "telling" sentence you find, you must provide:
1.  The original 'tellingSentence'.
2.  A creative and descriptive 'showingSuggestion' that rewrites the sentence into a full paragraph, conveying the same information through actions, dialogue, internal thoughts, or sensory details.

Return your findings as a JSON object with a 'suggestions' array.

Story Text:
{{{storyText}}}
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
