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


export const LiteraryDeviceSchema = z.object({
    device: z.string().describe('The name of the literary device.'),
    quote: z.string().describe('The specific quote from the text that uses the device.'),
    explanation: z.string().describe('A brief explanation of how the quote uses the device.'),
});
export type LiteraryDevice = z.infer<typeof LiteraryDeviceSchema>;


export const DialogueDynamicsSchema = z.object({
  powerBalance: z.array(z.object({
    character: z.string(),
    metrics: z.object({
      dialogueTurns: z.number().describe('Total number of times the character speaks.'),
      wordCount: z.number().describe('Total number of words spoken by the character.'),
      questionsAsked: z.number().describe('Number of questions the character asked.'),
      assertionsMade: z.number().describe('Number of assertive or declarative statements made.'),
    }),
  })).describe('An analysis of the power balance between characters.'),
  pacing: z.object({
    overallWordsPerTurn: z.number().describe('The average number of words per turn for the entire dialogue.'),
    characterPacing: z.array(z.object({
        character: z.string(),
        wordsPerTurn: z.number().describe('The average number of words per turn for this specific character.')
    })),
  }).describe('An analysis of the dialogue pacing.'),
  summary: z.string().describe('A brief, insightful summary of the overall dialogue dynamics, including who is driving the conversation.'),
});
export type DialogueDynamics = z.infer<typeof DialogueDynamicsSchema>;
