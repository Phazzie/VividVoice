'use server';

/**
 * @fileOverview Implements an AI-driven flow that scans story text for sound effect cues.
 *
 * - generateSoundDesign - Generates suggested sound effects for a story.
 * - GenerateSoundDesignInput - The input type for the function.
 * - GenerateSoundDesignOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SoundEffectSchema } from '@/ai/schemas';

const GenerateSoundDesignInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze for sound cues.'),
});
export type GenerateSoundDesignInput = z.infer<typeof GenerateSoundDesignInputSchema>;

const GenerateSoundDesignOutputSchema = z.object({
  soundEffects: z.array(SoundEffectSchema),
});
export type GenerateSoundDesignOutput = z.infer<typeof GenerateSoundDesignOutputSchema>;

export async function generateSoundDesign(
  input: GenerateSoundDesignInput
): Promise<GenerateSoundDesignOutput> {
  return generateSoundDesignFlow(input);
}

const generateSoundDesignFlow = ai.defineFlow(
  {
    name: 'generateSoundDesignFlow',
    inputSchema: GenerateSoundDesignInputSchema,
    outputSchema: GenerateSoundDesignOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'soundDesignPrompt',
      input: { schema: GenerateSoundDesignInputSchema },
      output: { schema: GenerateSoundDesignOutputSchema },
      prompt: `You are a sound designer creating an audio drama. Examine the story text and identify places where a specific sound effect would enhance the experience.\n\nFor each cue, return:\n- \\"segmentIndex\\": the zero-based index of the segment where the sound occurs.\n- \\"description\\": a short explanation of what produces the sound.\n- \\"soundQuery\\": a concise search query one could use in a sound effects library.\n\nRespond with JSON in the shape { "soundEffects": [ ... ] }. If no sound effects are found, return an empty array.\n\nStory text:\n\`\`\`\n{{{storyText}}}\n\`\`\``,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
