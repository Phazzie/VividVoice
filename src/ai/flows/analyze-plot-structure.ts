'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzePlotStructureInputSchema = z.object({
  storyText: z.string().describe('The story text to be analyzed.'),
});
export type AnalyzePlotStructureInput = z.infer<typeof AnalyzePlotStructureInputSchema>;

const PlotStructureSchema = z.object({
  plotStructure: z.string().describe('The plot structure of the story (e.g., Freytag\'s Pyramid, Three-Act Structure).'),
  analysis: z.string().describe('The analysis of the plot structure.'),
});

const AnalyzePlotStructureOutputSchema = z.object({
  plotStructure: PlotStructureSchema.describe('The plot structure of the story.'),
});
export type AnalyzePlotStructureOutput = z.infer<typeof AnalyzePlotStructureOutputSchema>;

const analyzePlotStructurePrompt = ai.definePrompt({
  name: 'analyzePlotStructurePrompt',
  input: { schema: AnalyzePlotStructureInputSchema },
  output: { schema: AnalyzePlotStructureOutputSchema },
  prompt: (input) => `You are an expert in literary analysis. Your task is to analyze the plot structure of the following story text. Identify the plot structure (e.g., Freytag's Pyramid, Three-Act Structure) and provide a brief analysis.

**Story Text:**
${input.storyText}

**Plot Structure Analysis:**`
});

export async function analyzePlotStructure(input: AnalyzePlotStructureInput): Promise<AnalyzePlotStructureOutput> {
  return analyzePlotStructureFlow(input);
}

const analyzePlotStructureFlow = ai.defineFlow(
  {
    name: 'analyzePlotStructureFlow',
    inputSchema: AnalyzePlotStructureInputSchema,
    outputSchema: AnalyzePlotStructureOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePlotStructurePrompt(input);
    if (!output) {
      throw new Error('Failed to analyze plot structure.');
    }
    return output;
  }
);
