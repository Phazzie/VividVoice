'use server';

/**
 * @fileOverview An AI agent that scans a story for sound effect cues.
 *
 * - generateSoundDesign - A function that handles the sound design analysis.
 * - GenerateSoundDesignInput - The input type for the function.
 * - GenerateSoundDesignOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SoundEffectSchema } from '@/ai/schemas';

const GenerateSoundDesignInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze for sound cues.'),
});
export type GenerateSoundDesignInput = z.infer<typeof GenerateSoundDesignInputSchema>;

const GenerateSoundDesignOutputSchema = z.object({
    soundEffects: z.array(SoundEffectSchema),
});
export type GenerateSoundDesignOutput = z.infer<typeof GenerateSoundDesignOutputSchema>;


export async function generateSoundDesign(input: GenerateSoundDesignInput): Promise<GenerateSoundDesignOutput> {
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
            input: {schema: GenerateSoundDesignInputSchema},
            output: {schema: GenerateSoundDesignOutputSchema},
            prompt: `You are a foley artist and sound designer for an audiobook. Your task is to read the provided story text and identify explicit or strongly implied sound effects within the NARRATOR'S text only. Do not add sounds for character dialogue.

For each sound effect you identify, provide:
1.  The 'segmentIndex': The zero-based index of the dialogue or narrative segment where the sound occurs. You must first mentally break the story into an array of chronological segments (e.g., "Narrator:", "Character:", "Narrator:").
2.  The 'description' of the sound event from the text (e.g., "a door creaked open," "the wind howled," "a glass shattered").
3.  A short, simple 'soundQuery' (1-3 words) that could be used to search a sound effects library (e.g., "door creak," "strong wind," "glass breaking").

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: The old house groaned under the strain of the storm. A shutter banged loose somewhere upstairs.
  Alice: Did you hear that?
  Narrator: Suddenly, the grandfather clock in the hall chimed once, a deep, resonant bell.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "soundEffects": [
      {
        "segmentIndex": 0,
        "description": "The old house groaned",
        "soundQuery": "house groaning"
      },
      {
        "segmentIndex": 0,
        "description": "A shutter banged loose",
        "soundQuery": "shutter banging"
      },
      {
        "segmentIndex": 2,
        "description": "the grandfather clock in the hall chimed once",
        "soundQuery": "clock chime"
      }
    ]
  }
  \`\`\`

Return your findings as a JSON object with a 'soundEffects' array. If no sound effects are found, return an empty array.

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
