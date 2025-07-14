'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing dialogue from a story text and assigning it to characters, including inferring the emotion of each line.
 *
 * - parseDialogue - A function that takes story text as input and returns a list of dialogue segments with character and emotion assignments.
 * - ParseDialogueInput - The input type for the parseDialogue function (story text).
 * - ParseDialogueOutput - The return type for the parseDialogue function (list of dialogue segments with emotions).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseDialogueInputSchema = z.object({
  storyText: z.string().describe('The complete text of the story to parse.'),
});
export type ParseDialogueInput = z.infer<typeof ParseDialogueInputSchema>;

const DialogueSegmentSchema = z.object({
  character: z
    .string()
    .describe('The name of the character speaking, or "Narrator" for narrative text.'),
  dialogue: z
    .string()
    .describe('The dialogue spoken by the character, or narrative text.'),
  emotion: z
    .string()
    .describe('The primary emotion conveyed by the dialogue (e.g., Happy, Sad, Angry, Intrigued, Worried). For the Narrator, this can be "Neutral" or reflect the scene\'s mood.'),
});

const ParseDialogueOutputSchema = z.array(DialogueSegmentSchema);
export type ParseDialogueOutput = z.infer<typeof ParseDialogueOutputSchema>;
export type DialogueSegment = z.infer<typeof DialogueSegmentSchema>;

export async function parseDialogue(input: ParseDialogueInput): Promise<ParseDialogueOutput> {
  return parseDialogueFlow(input);
}

const parseDialoguePrompt = ai.definePrompt({
  name: 'parseDialoguePrompt',
  input: {schema: ParseDialogueInputSchema},
  output: {schema: ParseDialogueOutputSchema},
  prompt: `You are an expert in literary analysis. Your task is to parse story text, identify dialogue, and assign it to the correct character or the narrator.

  For each segment of dialogue or narration, you must also determine the primary emotion being conveyed.

  Analyze the following story text. Return a JSON array where each object contains:
  1.  A 'character' field (the character's name or 'Narrator').
  2.  A 'dialogue' field (the corresponding text).
  3.  An 'emotion' field (a single word describing the emotion, e.g., 'Anxious', 'Excited', 'Somber', 'Neutral').

  Here is the story text:
  {{{storyText}}}`,
});

const parseDialogueFlow = ai.defineFlow(
  {
    name: 'parseDialogueFlow',
    inputSchema: ParseDialogueInputSchema,
    outputSchema: ParseDialogueOutputSchema,
  },
  async input => {
    const {output} = await parseDialoguePrompt(input);
    return output!;
  }
);
