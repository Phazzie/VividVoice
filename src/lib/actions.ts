
"use server";

import { parseDialogue, type ParseDialogueOutput, type DialogueSegment as ParsedDialogueSegment } from "@/ai/flows/parse-dialogue";
import { generateEmotionalTTS } from "@/ai/flows/generate-emotional-tts";
import { z } from "zod";

// Re-exporting for use in client components
export type DialogueSegment = ParsedDialogueSegment;

const StorySegmentWithAudioSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
  emotion: z.string(),
  audioUri: z.string().optional(),
});

export type StorySegmentWithAudio = z.infer<typeof StorySegmentWithAudioSchema>;

/**
 * Step 1: Parses the story text into dialogue segments with emotions.
 */
export async function parseStory(
  storyText: string
): Promise<ParsedDialogueSegment[]> {
  console.log("Starting story parsing...");
  if (!storyText.trim()) {
    console.error("Validation Error: Story text cannot be empty.");
    throw new Error("Story text cannot be empty.");
  }
  
  try {
    const parsedSegments = await parseDialogue({ storyText });
    if (!parsedSegments || parsedSegments.length === 0) {
      console.error("Parsing Error: Could not parse any dialogue from the provided text.");
      throw new Error("Could not parse dialogue. Please ensure it has standard dialogue formatting (e.g., Character: Dialogue).");
    }
    console.log("Story parsing successful.");
    return parsedSegments;
  } catch(error) {
    console.error("Error during dialogue parsing flow:", error);
    throw new Error("Failed to parse the story. The AI model may be temporarily unavailable.");
  }
}

/**
 * Step 2: Generates audio for the provided (and potentially edited) dialogue segments.
 */
export async function generateStoryAudio(
  segments: ParsedDialogueSegment[]
): Promise<StorySegmentWithAudio[]> {
   console.log("Starting TTS generation for refined segments...");
   if (!segments || segments.length === 0) {
    console.error("Validation Error: Segments for audio generation cannot be empty.");
    throw new Error("No dialogue segments provided for audio generation.");
   }

  try {
    const { audioDataUri } = await generateEmotionalTTS({ segments });
    console.log("TTS generation successful.");

    // Attach the single audio URI to the first segment for the player to use.
    const segmentsWithAudio: StorySegmentWithAudio[] = segments.map((segment, index) => {
        if (index === 0) {
            return {
                ...segment,
                audioUri: audioDataUri,
            };
        }
        return segment;
    });

    console.log("Story audio processing finished successfully.");
    return segmentsWithAudio;

  } catch (error) {
    console.error("Error during TTS generation flow:", error);
    throw new Error("There was an issue generating audio. The AI model may be temporarily unavailable, please try again.");
  }
}
