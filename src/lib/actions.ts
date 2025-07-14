
"use server";

import { parseDialogue, type ParseDialogueOutput } from "@/ai/flows/parse-dialogue";
import { generateEmotionalTTS } from "@/ai/flows/generate-emotional-tts";
import { z } from "zod";

const StorySegmentSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
});

const StorySegmentWithAudioSchema = StorySegmentSchema.extend({
  audioUri: z.string().optional(),
  start: z.number().optional(),
  end: z.number().optional(),
});

export type StorySegment = z.infer<typeof StorySegmentSchema>;
export type StorySegmentWithAudio = z.infer<typeof StorySegmentWithAudioSchema>;

export async function processStory(
  storyText: string
): Promise<StorySegmentWithAudio[]> {
  console.log("Starting story processing...");
  if (!storyText.trim()) {
    console.error("Validation Error: Story text cannot be empty.");
    throw new Error("Story text cannot be empty.");
  }
  
  let parsedSegments: ParseDialogueOutput;
  try {
    parsedSegments = await parseDialogue({ storyText });
    if (!parsedSegments || parsedSegments.length === 0) {
      console.error("Parsing Error: Could not parse any dialogue from the provided text.");
      throw new Error("Could not parse any dialogue from the provided text. Please ensure it has standard dialogue formatting.");
    }
  } catch(error) {
    console.error("Error during dialogue parsing flow:", error);
    throw new Error("Failed to parse the story. The AI model may be temporarily unavailable.");
  }

  try {
    // Reconstruct the story text with explicit speaker tags for the TTS model.
    const storyForTTS = parsedSegments
      .map(segment => `${segment.character}: ${segment.dialogue}`)
      .join('\n');
      
    console.log("Generating TTS for the story...");
    // Generate a single audio file for the entire story.
    const { audioDataUri } = await generateEmotionalTTS({ storyText: storyForTTS });
    console.log("TTS generation successful.");

    // For simplicity in this step, we'll return the segments with the main audio URI on the first segment.
    // A more advanced implementation would include timestamps for each segment.
    const segmentsWithAudio: StorySegmentWithAudio[] = parsedSegments.map((segment, index) => {
        if (index === 0) {
            return {
                ...segment,
                audioUri: audioDataUri,
            };
        }
        return segment;
    });

    console.log("Story processing finished successfully.");
    return segmentsWithAudio;

  } catch (error) {
    console.error("Error during TTS generation flow:", error);
    throw new Error("There was an issue generating audio for the story. The AI model may be temporarily unavailable, please try again.");
  }
}
