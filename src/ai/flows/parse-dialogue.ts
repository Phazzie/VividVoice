
'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing dialogue from a story text and assigning it to characters.
 * It has been enhanced to generate a comprehensive character profile upfront, including a detailed description of personality,
 * motivations, and speaking style, which serves as a brief for other AI tools.
 *
 * - parseDialogue - A function that takes story text and returns dialogue segments and detailed character profiles.
 * - ParseDialogueInput - The input type for the parseDialogue function.
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
  prompt: `You are an expert in literary analysis and a casting director for a major film studio. Your task is to process a story script, identify all characters, create detailed casting profiles for them, and then break the script into a clean, ordered list of dialogue and narration segments.

**PART 1: CHARACTER ANALYSIS & CASTING**

First, read the entire story text to understand the plot, characters, and overall tone. Based on this holistic understanding, compile a list of all unique characters mentioned.

For each character (including the 'Narrator'), provide:
1.  A rich, detailed 'description' that can serve as an actor's brief. This should synthesize all available information from the text (dialogue, actions, narrator descriptions) to cover:
    - **Personality & Traits:** Are they brave, witty, cynical, naive? What are their core characteristics?
    - **Motivations:** What do they seem to want in the story?
    - **Speaking Style:** Do they speak in long, elaborate sentences or short, clipped ones? Are they formal or informal?
    - **Physical Appearance:** Include any physical details mentioned or clearly implied. If none, infer a plausible appearance based on their personality.
2.  A 'voiceId' selected from the list of available voices below. As a casting director, your choice is critical. Choose the voice that best fits the character's comprehensive description. You must assign a unique voice to each character if possible.

**PART 2: SCRIPT SEGMENTATION**

Second, break down the entire story chronologically into an array of dialogue or narrative segments.

For each segment, provide:
1.  The 'character' speaking (use 'Narrator' for all non-dialogue text).
2.  The 'dialogue' or narrative text itself.
3.  The inferred 'emotion' for that line. To determine the emotion, carefully consider the context: what happened just before this line? What is the character's overall personality? What is the mood of the scene? The emotion should reflect these nuances, not just the literal words. For the Narrator, the emotion should reflect the mood of the scene (e.g., "Tense," "Somber," "Lighthearted").

**CRITICAL INSTRUCTIONS:**
- Return a single JSON object with two keys: 'characters' (an array of character objects) and 'segments' (an array of dialogue segment objects).
- The 'segments' array must be in the exact chronological order of the story.

**Available Voices for Casting:**
${availableVoices.join(', ')}

Now, process the following story script using the same method.

**Story Script to Process:**
\`\`\`
{{{storyText}}}
\`\`\`
`,
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
