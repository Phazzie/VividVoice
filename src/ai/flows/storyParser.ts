'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {DialogueSegmentSchema, CharacterSchema} from '@/ai/schemas';

export const StoryParserInputSchema = z.object({
  storyText: z.string(),
});

export const StoryParserOutputSchema = z.object({
  segments: z.array(DialogueSegmentSchema),
  characters: z.array(CharacterSchema),
});

export const storyParser = ai.defineFlow(
  {
    name: 'storyParser',
    inputSchema: StoryParserInputSchema,
    outputSchema: StoryParserOutputSchema,
  },
  async ({storyText}) => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview',
      prompt: `You are an expert in literary analysis. Your task is to process a story script, identify all characters, and break the script into a clean, ordered list of dialogue and narration segments.
        Return a single JSON object with two keys: 'characters' (an array of character objects) and 'segments' (an array of dialogue segment objects).
        The 'segments' array must be in the exact chronological order of the story.
        Story Script to Process:
        \`\`\`
        ${storyText}
        \`\`\`
        `,
      output: {
        schema: StoryParserOutputSchema,
      },
    });
    return output!;
  },
);
