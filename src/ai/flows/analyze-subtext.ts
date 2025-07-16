
'use server';

/**
 * @fileOverview An AI agent that analyzes story dialogue to uncover subtext.
 * 
 * - analyzeSubtext - A function that handles the subtext analysis.
 * - AnalyzeSubtextInput - The input type for the function.
 * - AnalyzeSubtextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SubtextAnalysisSchema } from '@/ai/schemas';

const AnalyzeSubtextInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze for subtext.'),
});
export type AnalyzeSubtextInput = z.infer<typeof AnalyzeSubtextInputSchema>;

const AnalyzeSubtextOutputSchema = z.object({
    analyses: z.array(SubtextAnalysisSchema),
});
export type AnalyzeSubtextOutput = z.infer<typeof AnalyzeSubtextOutputSchema>;


export async function analyzeSubtext(input: AnalyzeSubtextInput): Promise<AnalyzeSubtextOutput> {
    return analyzeSubtextFlow(input);
}


const analyzeSubtextFlow = ai.defineFlow(
    {
        name: 'analyzeSubtextFlow',
        inputSchema: AnalyzeSubtextInputSchema,
        outputSchema: AnalyzeSubtextOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'subtextAnalysisPrompt',
            input: {schema: AnalyzeSubtextInputSchema},
            output: {schema: AnalyzeSubtextOutputSchema},
            prompt: `You are an expert in literary analysis and psychology, specializing in dialogue. Your task is to analyze the provided story text to identify lines of dialogue that contain significant subtext.

Subtext is the unspoken, underlying meaning or emotion that is not explicitly stated.

For each instance of subtext you find, provide:
1.  The 'character' speaking.
2.  The exact line of 'dialogue'.
3.  The 'literalMeaning' of the line (what is actually being said).
4.  The 'subtext' (what is really meant or felt).
5.  A brief 'explanation' of the contextual clues (previous events, character relationships, tone) that point to this subtext.

Return your findings as a JSON object with an 'analyses' array. If no significant subtext is found, return an empty array.

Story Text:
{{{storyText}}}
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
