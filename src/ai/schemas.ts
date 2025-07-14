import { z } from 'zod';

/**
 * @fileOverview This file contains shared Zod schemas for Genkit flows.
 * It does not have a "use server" directive and can be safely imported
 * into both server and client components.
 */

export const CharacterSchema = z.object({
  name: z.string().describe('The name of the character.'),
  description: z
    .string()
    .describe(
      'A physical description of the character based on the story text.'
    ),
});
export type Character = z.infer<typeof CharacterSchema>;

export const DialogueSegmentSchema = z.object({
  character: z
    .string()
    .describe(
      'The name of the character speaking, or "Narrator" for narrative text.'
    ),
  dialogue: z
    .string()
    .describe('The dialogue spoken by the character, or narrative text.'),
  emotion: z
    .string()
    .describe(
      'The primary emotion conveyed by the dialogue (e.g., Happy, Sad, Angry, Intrigued, Worried). For the Narrator, this can be "Neutral" or reflect the scene\'s mood.'
    ),
});
export type DialogueSegment = z.infer<typeof DialogueSegmentSchema>;
