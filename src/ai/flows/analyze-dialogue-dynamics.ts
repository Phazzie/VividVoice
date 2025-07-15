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
      prompt: `You are an expert script analyst and editor. Analyze the provided story text to understand the power dynamics and pacing of the dialogue.

Exclude the 'Narrator' from all character-specific metrics. Focus only on the dialogue between characters.

1.  **Power Balance Analysis**: For each character, calculate the following metrics:
    *   'dialogueTurns': The total number of times the character speaks.
    *   'wordCount': The total number of words spoken by the character.
    *   'questionsAsked': The number of sentences that are questions.
    *   'assertionsMade': The number of sentences that are declarative statements.

2.  **Pacing Analysis**:
    *   Calculate the 'overallWordsPerTurn' for the entire dialogue.
    *   For each character, calculate their average 'wordsPerTurn'.

3.  **Summary**: Provide a brief, insightful 'summary' of the dialogue dynamics. Who appears to be driving the conversation? Is the power balance even? Is the pacing fast or slow?

Return a single JSON object structured according to the DialogueDynamics schema.

Story Text:
{{{storyText}}}
`,
    });
    
    const {output} = await prompt(input);
    return output!;
  }
);
