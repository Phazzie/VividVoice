
"use server";

import { parseDialogue } from "@/ai/flows/parse-dialogue";
import { generateEmotionalTTS } from "@/ai/flows/generate-emotional-tts";
import { z } from "zod";

const StorySegmentSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
});

const StorySegmentWithAudioSchema = StorySegmentSchema.extend({
  audioUri: z.string(),
});

export type StorySegment = z.infer<typeof StorySegmentSchema>;
export type StorySegmentWithAudio = z.infer<typeof StorySegmentWithAudioSchema>;

export async function processStory(
  storyText: string
): Promise<StorySegmentWithAudio[]> {
  if (!storyText.trim()) {
    throw new Error("Story text cannot be empty.");
  }
  
  const parsedSegments = await parseDialogue({ storyText });

  if (!parsedSegments || parsedSegments.length === 0) {
    throw new Error("Could not parse any dialogue from the provided text. Please ensure it has standard dialogue formatting.");
  }

  try {
    const segmentsWithAudio = await Promise.all(
      parsedSegments.map(async (segment) => {
        const textForTTS = `${segment.character}: ${segment.dialogue}`;
        const { audioDataUri } = await generateEmotionalTTS({ storyText: textForTTS });
        return {
          ...segment,
          audioUri: audioDataUri,
        };
      })
    );
    return segmentsWithAudio;

  } catch (error) {
    console.error("Error generating TTS:", error);
    throw new Error("There was an issue generating audio for the story. Please try again.");
  }
}
