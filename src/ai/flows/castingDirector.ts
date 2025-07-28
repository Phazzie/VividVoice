'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {CharacterSchema, DialogueSegmentSchema} from '@/ai/schemas';

const availableVoices = [
  'en-US-Standard-A',
  'en-US-Standard-B',
  'en-US-Standard-C',
  'en-US-Standard-D',
  'en-US-Standard-E',
  'en-US-Standard-F',
  'en-US-Standard-G',
  'en-US-Standard-H',
  'en-US-Standard-I',
  'en-US-Standard-J',
];

export const CastingDirectorInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema),
  characters: z.array(CharacterSchema),
});

export const CastingDirectorOutputSchema = z.object({
  characters: z.array(CharacterSchema),
});

export const castingDirector = ai.defineFlow(
  {
    name: 'castingDirector',
    inputSchema: CastingDirectorInputSchema,
    outputSchema: CastingDirectorOutputSchema,
  },
  async ({segments, characters}) => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview',
      prompt: `You are a casting director for a major film studio. Your task is to cast voices for the characters in a story.
        For each character, you must select a unique voice from the list of available voices.
        Consider the character's personality, dialogue, and any description provided.
        Return the list of characters with their assigned voiceId.
        Available Voices: ${availableVoices.join(', ')}
        Characters:
        ${JSON.stringify(characters)}
        Segments:
        ${JSON.stringify(segments)}
        `,
      output: {
        schema: CastingDirectorOutputSchema,
      },
    });
    return output!;
  },
);
