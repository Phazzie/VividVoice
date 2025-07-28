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
      prompt: `You are a highly efficient and accurate story parser. Your task is to process a story script and extract the following information:

        **1. Characters:** A list of all the unique characters in the story.
        **2. Dialogue Segments:** A chronologically ordered list of dialogue and narration segments.

        **Instructions:**

        *   Identify all unique characters and return them as an array of objects, each with a "name" property.
        *   Break the story down into an array of dialogue and narration segments.
        *   For each segment, identify the character speaking (or "Narrator" for narration) and the dialogue or narration text.
        *   Return a single JSON object with two keys: "characters" and "segments".

        **Example:**

        **Input:**
        The old man sat on the porch, watching the sunset. "Another day gone," he sighed.

        **Output:**
        {
          "characters": [
            { "name": "Old Man" }
          ],
          "segments": [
            { "character": "Narrator", "dialogue": "The old man sat on the porch, watching the sunset." },
            { "character": "Old Man", "dialogue": "Another day gone," },
            { "character": "Narrator", "dialogue": "he sighed." }
          ]
        }

        **Story Script to Process:**
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
