'use server';

/**
 * @fileOverview Implements an AI agent that analyzes the emotional tone of a line of dialogue.
 *
 * - analyzeEmotionalTone - A function that handles the emotional tone analysis.
 * - AnalyzeEmotionalToneInput - The input type for the function.
 * - AnalyzeEmotionalToneOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const emotionOptions = [
  "Neutral", "Happy", "Sad", "Angry", "Anxious", "Excited", "Intrigued", "Sarcastic", "Whispering", "Shouting", "Fearful", "Amused", "Serious", "Playful"
];

const AnalyzeEmotionalToneInputSchema = z.object({
  dialogue: z.string().describe('The line of dialogue to analyze.'),
  context: z.string().describe('The surrounding lines of dialogue and narration for context.'),
});
export type AnalyzeEmotionalToneInput = z.infer<typeof AnalyzeEmotionalToneInputSchema>;

const AnalyzeEmotionalToneOutputSchema = z.object({
  emotion: z.enum(emotionOptions as [string, ...string[]]).describe('The inferred emotion of the dialogue.'),
});
export type AnalyzeEmotionalToneOutput = z.infer<typeof AnalyzeEmotionalToneOutputSchema>;

const emotionalTonePrompt = ai.definePrompt({
  name: 'emotionalTonePrompt',
  input: { schema: AnalyzeEmotionalToneInputSchema },
  output: { schema: AnalyzeEmotionalToneOutputSchema },
  prompt: `You are an expert script analyst. Your task is to determine the emotional tone of a line of dialogue based on the text and the surrounding context. Consider the character's personality, the situation, and the subtext. From the following list of emotions: [${emotionOptions.join(', ')}], choose the one that best fits the line. Your response MUST be a single word from this list.

**Context:**
{{context}}

**Line to Analyze:**
"{{dialogue}}"

**Emotion:**`
});

export async function analyzeEmotionalTone(input: AnalyzeEmotionalToneInput): Promise<AnalyzeEmotionalToneOutput> {
  return analyzeEmotionalToneFlow(input);
}

const analyzeEmotionalToneFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionalToneFlow',
    inputSchema: AnalyzeEmotionalToneInputSchema,
    outputSchema: AnalyzeEmotionalToneOutputSchema,
  },
  async (input) => {
    const { output } = await emotionalTonePrompt(input);
    if (!output) {
      throw new Error('Failed to get a valid emotional tone from the AI model.');
    }
    return output;
  }
);
