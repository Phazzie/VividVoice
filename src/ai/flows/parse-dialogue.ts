
'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing dialogue from a story text and assigning it to characters, including inferring emotion, physical descriptions, and assigning a suitable voice.
 *
 * - parseDialogue - A function that takes story text as input and returns dialogue segments, character descriptions, emotions, and voice assignments.
 * - ParseDialogueInput - The input type for the parseDialogue function (story text).
 * - ParseDialogueOutput - The return type for the parseDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema, DialogueSegmentSchema } from '@/ai/schemas';

// A predefined list of available high-quality voices for the AI to choose from.
const availableVoices = [
  'en-US-Standard-A', 'en-US-Standard-B', 'en-US-Standard-C', 
  'en-US-Standard-D', 'en-US-Standard-E', 'en-US-Standard-F',
  'en-US-Standard-G', 'en-US-Standard-H', 'en-US-Standard-I', 'en-US-Standard-J'
];

const ParseDialogueInputSchema = z.object({
  storyText: z.string().describe('The complete text of the story to parse.'),
});
export type ParseDialogueInput = z.infer<typeof ParseDialogueInputSchema>;

const ParseDialogueOutputSchema = z.object({
    segments: z.array(DialogueSegmentSchema),
    characters: z.array(CharacterSchema)
});

export type ParseDialogueOutput = z.infer<typeof ParseDialogueOutputSchema>;

export async function parseDialogue(input: ParseDialogueInput): Promise<ParseDialogueOutput> {
  return parseDialogueFlow(input);
}

const parseDialoguePrompt = ai.definePrompt({
  name: 'parseDialoguePrompt',
  input: {schema: ParseDialogueInputSchema},
  output: {schema: ParseDialogueOutputSchema},
  prompt: `You are an expert in literary analysis and a casting director. Your task is to parse a story into dialogue segments and extract detailed character information, including assigning a voice actor.

First, read the entire story text to understand the plot, characters, and overall tone. Based on this holistic understanding, compile a list of all unique characters.

For each character (except the 'Narrator'), provide:
1.  A detailed physical 'description' based on any details mentioned in the text.
2.  A 'voiceId' selected from the list of available voices. As a casting director, choose the voice that best fits the character's description, personality, and role in the story. You must assign a unique voice to each character if possible.

Second, break down the story into an array of dialogue or narrative segments. For each segment, provide:
1.  The 'character' speaking (or 'Narrator' for narrative text).
2.  The 'dialogue' or narrative text itself.
3.  The inferred 'emotion' for that line. To determine the emotion, carefully consider the context: what happened just before this line? What is the character's overall personality? What is the mood of the scene? The emotion should reflect these nuances.

Return a single JSON object with two keys: 'characters' (an array of character objects with names, descriptions, and voice IDs) and 'segments' (an array of dialogue segment objects).

Available Voices:
${availableVoices.join(', ')}

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
