'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for sound design input
export const GenerateSoundDesignInputSchema = z.object({
  storyText: z.string().describe('The narrative text to analyze for sound design cues'),
});

export type GenerateSoundDesignInput = z.infer<typeof GenerateSoundDesignInputSchema>;

// Schema for individual sound effects
export const SoundEffectSchema = z.object({
  timestamp: z.string().describe('Where in the narrative this sound occurs'),
  description: z.string().describe('Description of the sound effect'),
  soundType: z.string().describe('Type of sound (ambient, foley, music cue, etc.)'),
  intensity: z.enum(['Subtle', 'Moderate', 'Prominent']).describe('How prominent the sound should be'),
});

export const GenerateSoundDesignOutputSchema = z.object({
  soundEffects: z.array(SoundEffectSchema).describe('List of sound effects for the story'),
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
    }, `You are an expert sound designer for narrative audio productions.

Analyze the following story and generate a comprehensive sound design plan. Identify key moments that would benefit from:
- Sound effects (footsteps, door creaks, weather, etc.)
- Ambient sounds (room tone, background atmosphere)
- Musical cues (emotional underscoring)

For each sound, specify:
1. Where it occurs in the narrative (timestamp/context)
2. A description of the sound
3. The type of sound (ambient, foley, music cue, etc.)
4. The intensity (Subtle, Moderate, or Prominent)

Story:
{{storyText}}

Create a sound design that enhances the narrative atmosphere and emotional impact without overwhelming the dialogue.`);

    const { output } = await prompt(input);
    return output!;
  }
);
