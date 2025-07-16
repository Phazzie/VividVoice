
'use server';

/**
 * @fileOverview An AI agent that scans a story for consistency issues.
 * 
 * - findInconsistencies - A function that handles the consistency analysis.
 * - FindInconsistenciesInput - The input type for the function.
 * - FindInconsistenciesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ConsistencyIssueSchema } from '@/ai/schemas';

const FindInconsistenciesInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type FindInconsistenciesInput = z.infer<typeof FindInconsistenciesInputSchema>;

const FindInconsistenciesOutputSchema = z.object({
    issues: z.array(ConsistencyIssueSchema),
});
export type FindInconsistenciesOutput = z.infer<typeof FindInconsistenciesOutputSchema>;


export async function findInconsistencies(input: FindInconsistenciesInput): Promise<FindInconsistenciesOutput> {
    return findInconsistenciesFlow(input);
}


const findInconsistenciesFlow = ai.defineFlow(
    {
        name: 'findInconsistenciesFlow',
        inputSchema: FindInconsistenciesInputSchema,
        outputSchema: FindInconsistenciesOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'consistencyGuardianPrompt',
            input: {schema: FindInconsistenciesInputSchema},
            output: {schema: FindInconsistenciesOutputSchema},
            prompt: `You are a meticulous continuity editor for a major publishing house. Your task is to read the provided story text and identify any and all continuity errors or inconsistencies.

Look for issues such as:
- Character details changing (e.g., eye color, backstory elements).
- Plot holes (e.g., a character knows something they couldn't possibly know).
- Timeline errors (e.g., events happening in an illogical order).
- Object inconsistencies (e.g., a character loses an item and then has it again later).

For each issue you find, provide:
1.  A concise description of the 'issue'.
2.  The 'quote' from the text that best illustrates the inconsistency.
3.  A brief 'explanation' of why it's a potential problem.

Return your findings as a JSON object with an 'issues' array. If no inconsistencies are found, return an empty array.

Story Text:
{{{storyText}}}
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
