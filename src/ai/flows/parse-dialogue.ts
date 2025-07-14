'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing dialogue from a story text and assigning it to characters.
 *
 * - parseDialogue - A function that takes story text as input and returns a list of dialogue segments with character assignments.
 * - ParseDialogueInput - The input type for the parseDialogue function (story text).
 * - ParseDialogueOutput - The return type for the parseDialogue function (list of dialogue segments).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseDialogueInputSchema = z.object({
  storyText: z.string().describe('The complete text of the story to parse.'),
});
export type ParseDialogueInput = z.infer<typeof ParseDialogueInputSchema>;

const DialogueSegmentSchema = z.object({
  character: z.string().describe('The name of the character speaking, or narrator.'),
  dialogue: z.string().describe('The dialogue spoken by the character, or narrative text.'),
});

const ParseDialogueOutputSchema = z.array(DialogueSegmentSchema);
export type ParseDialogueOutput = z.infer<typeof ParseDialogueOutputSchema>;

export async function parseDialogue(input: ParseDialogueInput): Promise<ParseDialogueOutput> {
  return parseDialogueFlow(input);
}

const parseDialoguePrompt = ai.definePrompt({
  name: 'parseDialoguePrompt',
  input: {schema: ParseDialogueInputSchema},
  output: {schema: ParseDialogueOutputSchema},
  prompt: `You are an expert in parsing story text and identifying dialogue sections, assigning them to the correct character or narrator.

  Analyze the following story text and identify each dialogue segment, determining the character who is speaking. If there's no explicit character, treat it as narrator text.

  Return a JSON array where each object has a 'character' field (the character's name or 'narrator') and a 'dialogue' field (the corresponding dialogue or narrative text).

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

