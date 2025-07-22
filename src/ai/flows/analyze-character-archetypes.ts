'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCharacterArchetypesInputSchema = z.object({
  storyText: z.string().describe('The story text to be analyzed.'),
});
export type AnalyzeCharacterArchetypesInput = z.infer<typeof AnalyzeCharacterArchetypesInputSchema>;

const CharacterArchetypeSchema = z.object({
  characterName: z.string().describe('The name of the character.'),
  archetype: z.string().describe('The archetype of the character (e.g., Hero, Mentor, Trickster).'),
  justification: z.string().describe('The justification for assigning this archetype.'),
});

const AnalyzeCharacterArchetypesOutputSchema = z.object({
  characterArchetypes: z.array(CharacterArchetypeSchema).describe('The list of character archetypes.'),
});
export type AnalyzeCharacterArchetypesOutput = z.infer<typeof AnalyzeCharacterArchetypesOutputSchema>;

const analyzeCharacterArchetypesPrompt = ai.definePrompt({
  name: 'analyzeCharacterArchetypesPrompt',
  input: { schema: AnalyzeCharacterArchetypesInputSchema },
  output: { schema: AnalyzeCharacterArchetypesOutputSchema },
  prompt: (input) => `You are an expert in literary analysis. Your task is to identify the character archetypes in the following story text. For each character, identify their archetype (e.g., Hero, Mentor, Trickster) and provide a brief justification for your choice.

**Story Text:**
${input.storyText}

**Character Archetypes:**`
});

export async function analyzeCharacterArchetypes(input: AnalyzeCharacterArchetypesInput): Promise<AnalyzeCharacterArchetypesOutput> {
  return analyzeCharacterArchetypesFlow(input);
}

const analyzeCharacterArchetypesFlow = ai.defineFlow(
  {
    name: 'analyzeCharacterArchetypesFlow',
    inputSchema: AnalyzeCharacterArchetypesInputSchema,
    outputSchema: AnalyzeCharacterArchetypesOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeCharacterArchetypesPrompt(input);
    if (!output) {
      throw new Error('Failed to analyze character archetypes.');
    }
    return output;
  }
);
