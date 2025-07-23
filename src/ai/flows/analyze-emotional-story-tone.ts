'use server';

/**
 * @fileOverview Implements an AI agent that analyzes the emotional tone of a story.
 *
 * - analyzeEmotionalStoryTone - A function that handles the emotional tone analysis.
 * - AnalyzeEmotionalStoryToneInput - The input type for the function.
 * - AnalyzeEmotionalStoryToneOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { EmotionalToneSchema } from '@/ai/schemas';

export const AnalyzeEmotionalStoryToneInputSchema = z.object({
  storyText: z.string().describe('The story text to analyze.'),
});
export type AnalyzeEmotionalStoryToneInput = z.infer<typeof AnalyzeEmotionalStoryToneInputSchema>;

export const AnalyzeEmotionalStoryToneOutputSchema = z.object({
  tones: z.array(EmotionalToneSchema).describe('The emotional tones found in the story.'),
});
export type AnalyzeEmotionalStoryToneOutput = z.infer<typeof AnalyzeEmotionalStoryToneOutputSchema>;

const emotionalStoryTonePrompt = ai.definePrompt({
  name: 'emotionalStoryTonePrompt',
  input: { schema: AnalyzeEmotionalStoryToneInputSchema },
  output: { schema: AnalyzeEmotionalStoryToneOutputSchema },
  prompt: (input) => `You are an expert script analyst. Your task is to identify the key emotional tones in the provided story text. For each emotional tone you identify, provide the quote from the text that best exemplifies it, and a brief explanation of why it has that emotional tone.

**Story Text:**
${input.storyText}

**Emotional Tones:**`
});

export async function analyzeEmotionalStoryTone(input: AnalyzeEmotionalStoryToneInput): Promise<AnalyzeEmotionalStoryToneOutput> {
  return analyzeEmotionalStoryToneFlow(input);
}

const analyzeEmotionalStoryToneFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionalStoryToneFlow',
    inputSchema: AnalyzeEmotionalStoryToneInputSchema,
    outputSchema: AnalyzeEmotionalStoryToneOutputSchema,
  },
  async (input) => {
    const { output } = await emotionalStoryTonePrompt(input);
    if (!output) {
      throw new Error('Failed to get a valid emotional tone from the AI model.');
    }
    return output;
  }
);
