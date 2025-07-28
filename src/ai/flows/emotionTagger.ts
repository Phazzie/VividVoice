'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {DialogueSegmentSchema, CharacterSchema} from '@/ai/schemas';

export const EmotionTaggerInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema),
  characters: z.array(CharacterSchema),
});

export const EmotionTaggerOutputSchema = z.object({
  segments: z.array(DialogueSegmentSchema),
});

export const emotionTagger = ai.defineFlow(
  {
    name: 'emotionTagger',
    inputSchema: EmotionTaggerInputSchema,
    outputSchema: EmotionTaggerOutputSchema,
  },
  async ({segments, characters}) => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview',
      prompt: `You are an expert in literary analysis. Your task is to analyze a series of dialogue segments and assign an appropriate emotion to each one.
        For each segment, consider the character's personality, the context of the conversation, and the dialogue itself.
        The emotion should reflect the nuances of the scene, not just the literal words.
        Return the segments with the added emotion.
        Characters:
        ${JSON.stringify(characters)}
        Segments:
        ${JSON.stringify(segments)}
        `,
      output: {
        schema: EmotionTaggerOutputSchema,
      },
    });
    return output!;
  },
);
