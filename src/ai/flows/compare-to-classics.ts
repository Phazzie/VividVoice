'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompareToClassicsInputSchema = z.object({
  storyText: z.string().describe('The story text to be analyzed.'),
});
export type CompareToClassicsInput = z.infer<typeof CompareToClassicsInputSchema>;

const ComparisonSchema = z.object({
  classicStory: z.string().describe('The classic story being compared to.'),
  similarities: z.array(z.string()).describe('The similarities between the two stories.'),
  differences: z.array(z.string()).describe('The differences between the two stories.'),
});

const CompareToClassicsOutputSchema = z.object({
  comparisons: z.array(ComparisonSchema).describe('The list of comparisons to classic stories.'),
});
export type CompareToClassicsOutput = z.infer<typeof CompareToClassicsOutputSchema>;

const compareToClassicsPrompt = ai.definePrompt({
  name: 'compareToClassicsPrompt',
  input: { schema: CompareToClassicsInputSchema },
  output: { schema: CompareToClassicsOutputSchema },
  prompt: `You are an expert in literary analysis. Your task is to compare the following story text to classic stories. For each comparison, identify the classic story and list the similarities and differences.

**Story Text:**
{{storyText}}

**Comparisons to Classic Stories:**`
});

export async function compareToClassics(input: CompareToClassicsInput): Promise<CompareToClassicsOutput> {
  return compareToClassicsFlow(input);
}

const compareToClassicsFlow = ai.defineFlow(
  {
    name: 'compareToClassicsFlow',
    inputSchema: CompareToClassicsInputSchema,
    outputSchema: CompareToClassicsOutputSchema,
  },
  async (input) => {
    const { output } = await compareToClassicsPrompt(input);
    if (!output) {
      throw new Error('Failed to compare to classic stories.');
    }
    return output;
  }
);
