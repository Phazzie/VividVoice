
'use server';

/**
 * @fileOverview An AI agent that identifies "telling" sentences and suggests "showing" alternatives,
 * now enhanced with a few-shot example for better accuracy.
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
            prompt: `You are a creative writing instructor specializing in the "Show, Don't Tell" principle. Your task is to analyze the provided story text from the narrator.

First, identify any sentences in the **narrator's text** that are "telling" the reader something instead of "showing" it. These are often sentences that state a character's emotion directly or summarize an event without providing sensory detail.

For each "telling" sentence you find, you must provide:
1.  The original 'tellingSentence'.
2.  A creative and descriptive 'showingSuggestion' that rewrites the sentence into a full paragraph. The suggestion should convey the same information through actions, dialogue, internal thoughts, or sensory details. Make it vivid and engaging.

**High-Quality Example:**
- **Input "tellingSentence":** "She was very angry."
- **Your "showingSuggestion" Output:** "Her knuckles turned white as she gripped the porcelain mug. She stared at the wall, her jaw a tight line of steel. 'Fine,' she clipped, the single word sharp enough to cut glass."

Return your findings as a JSON object with a 'suggestions' array. Focus only on the most clear-cut cases of "telling." If none are found, return an empty array.

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
