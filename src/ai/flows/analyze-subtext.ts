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
- **Input Story Text:**
  \`\`\`
  Narrator: The rain hammered against the window. Inside, Mark stared at the last photograph of him and Sarah together.
  Sarah: I'm leaving, Mark. I've packed my bags.
  Mark: I see you've watered the plants.
  Sarah: Don't do this.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "analyses": [
        {
            "character": "Mark",
            "dialogue": "I see you've watered the plants.",
            "literalMeaning": "I am observing that the plants have been watered.",
            "subtext": "You are abandoning me and our shared life, yet you're still performing these small acts of domestic normalcy. Are you pretending this isn't happening? Or are you trying to show me you still care, which makes this even more painful?",
            "explanation": "Mark is avoiding the emotional bombshell of Sarah leaving by focusing on a mundane, irrelevant detail. This deflection is a classic sign of someone struggling to process a traumatic event. His comment is a desperate attempt to ignore the reality of the situation and cling to a semblance of the life that is about to disappear."
        }
    ]
  }
  \`\`\`

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
