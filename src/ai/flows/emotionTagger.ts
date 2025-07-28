'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DialogueSegmentSchema, CharacterSchema } from '@/ai/schemas';
import { analyzeEmotionalTone } from './analyze-emotional-tone';

const EmotionTaggerInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema),
  characters: z.array(CharacterSchema)
});
export type EmotionTaggerInput = z.infer<typeof EmotionTaggerInputSchema>;

const EmotionTaggerOutputSchema = z.object({
  segments: z.array(DialogueSegmentSchema)
});
export type EmotionTaggerOutput = z.infer<typeof EmotionTaggerOutputSchema>;

export async function emotionTagger(input: EmotionTaggerInput): Promise<EmotionTaggerOutput> {
  return emotionTaggerFlow(input);
}

const emotionTaggerFlow = ai.defineFlow(
  {
    name: 'emotionTaggerFlow',
    inputSchema: EmotionTaggerInputSchema,
    outputSchema: EmotionTaggerOutputSchema,
  },
  async ({ segments }) => {
    const processed = await Promise.all(
      segments.map(async (segment, index) => {
        if (segment.character === 'Narrator') return segment;
        const context = segments
          .slice(Math.max(0, index - 2), Math.min(segments.length, index + 3))
          .map((s) => `${s.character}: ${s.dialogue}`)
          .join('\n');
        const { emotion } = await analyzeEmotionalTone({ dialogue: segment.dialogue, context });
        return { ...segment, emotion };
      })
    );
    return { segments: processed };
  }
);
