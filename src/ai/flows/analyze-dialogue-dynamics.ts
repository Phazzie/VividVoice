
'use server';

/**
 * @fileOverview Implements an AI agent that analyzes dialogue for power dynamics and pacing.
 * 
 * - analyzeDialogueDynamics - A function that handles the dialogue dynamics analysis.
 * - AnalyzeDialogueDynamicsInput - The input type for the function.
 * - AnalyzeDialogueDynamicsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DialogueDynamicsSchema } from '@/ai/schemas';

const AnalyzeDialogueDynamicsInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type AnalyzeDialogueDynamicsInput = z.infer<typeof AnalyzeDialogueDynamicsInputSchema>;

export type AnalyzeDialogueDynamicsOutput = z.infer<typeof DialogueDynamicsSchema>;


export async function analyzeDialogueDynamics(input: AnalyzeDialogueDynamicsInput): Promise<AnalyzeDialogueDynamicsOutput> {
    return analyzeDialogueDynamicsFlow(input);
}

const analyzeDialogueDynamicsFlow = ai.defineFlow(
  {
    name: 'analyzeDialogueDynamicsFlow',
    inputSchema: AnalyzeDialogueDynamicsInputSchema,
    outputSchema: DialogueDynamicsSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'dialogueDynamicsPrompt',
      input: {schema: AnalyzeDialogueDynamicsInputSchema},
      output: {schema: DialogueDynamicsSchema},
      prompt: `You are an expert script analyst and editor. Your task is to perform a detailed analysis of the provided story text to understand the power dynamics and pacing of the dialogue.

**CRITICAL INSTRUCTIONS:**
- You MUST exclude the 'Narrator' from all character-specific metrics. Focus only on the dialogue between characters who are not the narrator.
- Ensure all numeric fields in the output are populated correctly. If a character has zero of something (e.g., questions asked), the value must be 0, not null.

**ANALYSIS STEPS:**
1.  **Power Balance Analysis**: For each character involved in the dialogue (excluding the Narrator), you will meticulously calculate the following metrics:
    *   'dialogueTurns': The total number of times the character has a block of dialogue.
    *   'wordCount': The total number of words spoken by the character across all their turns.
    *   'questionsAsked': The number of sentences spoken by the character that end in a question mark (?).
    *   'assertionsMade': The number of sentences that are declarative statements, not questions.

2.  **Pacing Analysis**:
    *   Calculate the 'overallWordsPerTurn' for the entire dialogue, averaging across all characters (excluding the Narrator).
    *   For each character (excluding the Narrator), calculate their average 'wordsPerTurn'.

3.  **Summary**: Based on your quantitative analysis, provide a brief, insightful 'summary' of the dialogue dynamics. Mention who appears to be driving the conversation, whether the power balance is even or skewed, and if the pacing feels fast, slow, or varied. Your summary should be grounded in the data you've calculated.

Return a single JSON object structured precisely according to the DialogueDynamics schema.

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
