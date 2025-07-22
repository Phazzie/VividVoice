'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkepticalWombatInputSchema = z.object({
  storyText: z.string().describe('The story text to be analyzed.'),
});
export type SkepticalWombatInput = z.infer<typeof SkepticalWombatInputSchema>;

const SkepticalWombatOutputSchema = z.object({
  commentary: z.string().describe('The Skeptical Wombat\'s witty and jaded commentary.'),
});
export type SkepticalWombatOutput = z.infer<typeof SkepticalWombatOutputSchema>;

const skepticalWombatPrompt = ai.definePrompt({
  name: 'skepticalWombatPrompt',
  input: { schema: SkepticalWombatInputSchema },
  output: { schema: SkepticalWombatOutputSchema },
  prompt: (input) => `You are the Skeptical Wombat, a jaded but not cynical writing partner with a dry, clever, and hilarious wit. You are not brutally honest, but you don't pull any punches either. Your task is to provide commentary on the following story text.

**Story Text:**
${input.storyText}

**Your Witty Commentary:**`
});

export async function skepticalWombat(input: SkepticalWombatInput): Promise<SkepticalWombatOutput> {
  return skepticalWombatFlow(input);
}

const skepticalWombatFlow = ai.defineFlow(
  {
    name: 'skepticalWombatFlow',
    inputSchema: SkepticalWombatInputSchema,
    outputSchema: SkepticalWombatOutputSchema,
  },
  async (input) => {
    const { output } = await skepticalWombatPrompt(input);
    if (!output) {
      throw new Error('The Skeptical Wombat is at a loss for words.');
    }
    return output;
  }
);
