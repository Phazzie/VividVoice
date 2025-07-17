
'use server';

/**
 * @fileOverview Implements an AI agent that analyzes the pacing of a story.
 * 
 * - analyzeStoryPacing - A function that handles the story pacing analysis.
 * - AnalyzePacingInput - The input type for the function.
 * - AnalyzePacingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PacingSegmentSchema } from '@/ai/schemas';

const AnalyzePacingInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type AnalyzePacingInput = z.infer<typeof AnalyzePacingInputSchema>;

const AnalyzePacingOutputSchema = z.object({
    segments: z.array(PacingSegmentSchema),
});
export type AnalyzePacingOutput = z.infer<typeof AnalyzePacingOutputSchema>;


export async function analyzeStoryPacing(input: AnalyzePacingInput): Promise<AnalyzePacingOutput> {
    return analyzePacingFlow(input);
}

const analyzePacingFlow = ai.defineFlow(
  {
    name: 'analyzePacingFlow',
    inputSchema: AnalyzePacingInputSchema,
    outputSchema: AnalyzePacingOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'pacingAnalysisPrompt',
      input: {schema: AnalyzePacingInputSchema},
      output: {schema: AnalyzePacingOutputSchema},
      prompt: `You are a story structure analyst. Your task is to analyze the provided story text and break it down into segments to visualize its pacing.

Go through the text and identify contiguous blocks of 'Dialogue' and 'Narration'. For each block, provide:
1.  The 'type' of the segment ('Dialogue' or 'Narration').
2.  The 'wordCount' of that segment.

**CRITICAL INSTRUCTIONS:**
- Combine consecutive lines of the same type into a single segment. For example, if there are three lines of narration followed by two lines of dialogue, you should return two segments.
- Dialogue is any line prefixed with a character name and a colon (e.g., "Alice:"). Everything else is Narration.
- Your output must be an array of segments that covers the entire story from beginning to end.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: The sun set. It was cold now.
  Alice: Are you there?
  Bob: I'm here.
  Narrator: A shadow moved in the corner.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "segments": [
      {
        "type": "Narration",
        "wordCount": 7
      },
      {
        "type": "Dialogue",
        "wordCount": 6
      },
      {
        "type": "Narration",
        "wordCount": 6
      }
    ]
  }
  \`\`\`

Return the results as a JSON object with a single key 'segments' containing an array of these segment objects.

**Story Text:**
\`\`\`
{{{storyText}}}
\`\`\`
`,
    });
    
    const {output} = await prompt(input);
    return output!;
  }
);
