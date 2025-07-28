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
      prompt: `You are an expert in literary analysis and a master of human emotion. Your task is to analyze a series of dialogue segments and assign a precise and nuanced emotion to each one.

        **Consider the following:**

        *   **Character:** What is the character's personality? Are they generally optimistic, pessimistic, sarcastic, etc.?
        *   **Context:** What is happening in the story at this moment? What was said or done immediately before this line of dialogue?
        *   **Subtext:** What is the underlying meaning of the dialogue? Is the character saying what they really mean, or are they hiding their true feelings?

        **Instructions:**

        *   For each segment, provide a single, descriptive emotion that captures the essence of the character's feelings.
        *   Avoid generic emotions like "happy" or "sad." Instead, use more specific emotions like "elated," "melancholy," "witty," "apprehensive," etc.
        *   Return the segments with the added emotion.

        **Characters:**
        ${JSON.stringify(characters)}

        **Segments:**
        ${JSON.stringify(segments)}
        `,
      output: {
        schema: EmotionTaggerOutputSchema,
      },
    });
    return output!;
  },
);
