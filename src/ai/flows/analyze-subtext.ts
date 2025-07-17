
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

Subtext is the unspoken, underlying meaning, motive, or emotion that is not explicitly stated but is implied by the character's words and the context of the situation.

For each instance of subtext you find, provide:
1.  The 'character' speaking.
2.  The exact line of 'dialogue'.
3.  The 'literalMeaning' of the line (what is actually being said on the surface).
4.  The 'subtext' (what is really meant, felt, or intended).
5.  A brief but insightful 'explanation' of the contextual clues (previous events, character relationships, tone, what is NOT being said) that point to this subtext.

**High-Quality Example:**
- **Context:** A character, Jane, has just lost a competition she desperately wanted to win. Her friend asks if she's okay.
- **Dialogue Line:** "Jane: I'm fine."
- **Your Analysis:**
  - **character:** "Jane"
  - **dialogue:** "I'm fine."
  - **literalMeaning:** "I am okay / not hurt."
  - **subtext:** "I am deeply disappointed and hurt, but I don't want to talk about it."
  - **explanation:** "The word 'fine' is often used to deflect conversation about true feelings, especially after a significant negative event. The context of her recent loss makes it highly probable that she is masking her true emotional state."

Your analysis should be this deep and nuanced. Return your findings as a JSON object with an 'analyses' array. If no significant subtext is found, return an empty array.

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

