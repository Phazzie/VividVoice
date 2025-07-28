import { z } from 'zod';

/** Shared schemas for AI flows */

export const CharacterSchema = z.object({
  name: z.string().describe('The name of the character.'),
  description: z.string().describe('A physical description of the character based on the story text.'),
  voiceId: z.string().optional().describe('The voice ID assigned to this character by the AI casting director.'),
});
export type Character = z.infer<typeof CharacterSchema>;

export const DialogueSegmentSchema = z.object({
  character: z.string().describe('The name of the character speaking, or "Narrator" for narrative text.'),
  dialogue: z.string().describe('The dialogue spoken by the character, or narrative text.'),
  emotion: z.string().describe('The primary emotion conveyed by the dialogue.'),
});
export type DialogueSegment = z.infer<typeof DialogueSegmentSchema>;

export const NARRATOR_BIAS_OPTIONS = [
  'Neutral',
  'Jealous of Main Character',
  'Secretly the Villain',
  'Admires Main Character',
  'Completely Unreliable',
  'Hides a Key Fact',
] as const;
export const NarratorBiasEnum = z.enum(NARRATOR_BIAS_OPTIONS);
export const NarratorBiasSchema = z.object({
  startBias: NarratorBiasEnum.describe("The narrator's bias at the beginning of the story."),
  endBias: NarratorBiasEnum.describe("The narrator's bias at the end of the story."),
});
export type NarratorBias = z.infer<typeof NarratorBiasEnum>;
export type NarratorBiasRange = z.infer<typeof NarratorBiasSchema>;

export const TranscriptWordSchema = z.object({
  word: z.string(),
  startTime: z.number(),
  endTime: z.number(),
});
export type TranscriptWord = z.infer<typeof TranscriptWordSchema>;

export const TranscriptSegmentSchema = z.object({
  segmentIndex: z.number(),
  words: z.array(TranscriptWordSchema),
  startTime: z.number(),
  endTime: z.number(),
});
export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>;
