
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
  if (!storyText.trim()) {
    throw new Error("Story text cannot be empty.");
  }
  
  const parsedSegments: ParseDialogueOutput = await parseDialogue({ storyText });

  if (!parsedSegments || parsedSegments.length === 0) {
    throw new Error("Could not parse any dialogue from the provided text. Please ensure it has standard dialogue formatting.");
  }

  try {
    // Reconstruct the story text with explicit speaker tags for the TTS model.
    const storyForTTS = parsedSegments
      .map(segment => `${segment.character}: ${segment.dialogue}`)
      .join('\n');
      
    // Generate a single audio file for the entire story.
    const { audioDataUri } = await generateEmotionalTTS({ storyText: storyForTTS });

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

    return segmentsWithAudio;

  } catch (error) {
    console.error("Error generating TTS:", error);
    throw new Error("There was an issue generating audio for the story. Please try again.");
  }
}
