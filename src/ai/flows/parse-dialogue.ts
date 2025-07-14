'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing dialogue from a story text and assigning it to characters, including inferring emotion and physical descriptions.
 *
 * - parseDialogue - A function that takes story text as input and returns dialogue segments, character descriptions, and emotions.
 * - ParseDialogueInput - The input type for the parseDialogue function (story text).
 * - ParseDialogueOutput - The return type for the parseDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema, DialogueSegmentSchema } from '@/ai/schemas';


const ParseDialogueInputSchema = z.object({
  storyText: z.string().describe('The complete text of the story to parse.'),
});
export type ParseDialogueInput = z.infer<typeof ParseDialogueInputSchema>;

const ParseDialogueOutputSchema = z.object({
    segments: z.array(DialogueSegmentSchema),
    characters: z.array(CharacterSchema)
});

export type ParseDialogueOutput = z.infer<typeof ParseDialogueOutputSchema>;
export type DialogueSegment = z.infer<typeof DialogueSegmentSchema>;

export async function parseDialogue(input: ParseDialogueInput): Promise<ParseDialogueOutput> {
  return parseDialogueFlow(input);
}

const parseDialoguePrompt = ai.definePrompt({
  name: 'parseDialoguePrompt',
  input: {schema: ParseDialogueInputSchema},
  output: {schema: ParseDialogueOutputSchema},
  prompt: `You are an expert in literary analysis. Your task is to parse story text into dialogue segments and extract character information.

  First, go through the entire story and compile a list of all unique characters. For each character (except the 'Narrator'), provide a detailed physical description based on any details mentioned in the text.

  Second, break down the story into an array of segments. For each segment, provide:
  1.  The 'character' speaking (or 'Narrator').
  2.  The 'dialogue' or narrative text.
  3.  The inferred 'emotion' for that line.

  Return a single JSON object with two keys: 'characters' (an array of character objects with names and descriptions) and 'segments' (an array of dialogue segment objects).

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
