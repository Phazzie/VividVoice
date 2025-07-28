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
      prompt: `You are a world-renowned casting director, known for your impeccable taste and ability to find the perfect voice for any character. Your task is to cast the voices for the characters in a story.

        **Consider the following:**

        *   **Character Archetype:** Is the character a hero, a villain, a mentor, a jester, etc.?
        *   **Vocal Qualities:** What kind of voice would this character have? Is it deep, high-pitched, gravelly, smooth, etc.?
        *   **Speech Patterns:** How does the character speak? Are they fast-paced, slow and deliberate, etc.?

        **Instructions:**

        *   For each character, select a unique voice from the list of available voices that best fits their personality and role in the story.
        *   Provide a brief justification for your choice, explaining why the voice you selected is a good fit for the character.
        *   Return the list of characters with their assigned voiceId.

        **Available Voices:**
        ${availableVoices.join(', ')}

        **Characters:**
        ${JSON.stringify(characters)}

        **Segments:**
        ${JSON.stringify(segments)}
        `,
      output: {
        schema: CastingDirectorOutputSchema,
      },
    });
    return output!;
  },
);
