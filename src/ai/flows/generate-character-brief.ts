
'use server';

/**
 * @fileOverview An AI agent that generates a concise "character brief" for the Actor's Studio.
 * This brief summarizes a character's personality, motivations, and voice based on the full story text.
 * 
 * - generateCharacterBrief - A function that handles the brief generation.
 * - GenerateCharacterBriefInput - The input type for the function.
 * - GenerateCharacterBriefOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterBriefInputSchema = z.object({
  characterName: z.string().describe("The name of the character to analyze."),
  storyText: z.string().describe("The full text of the story for context."),
});
export type GenerateCharacterBriefInput = z.infer<typeof GenerateCharacterBriefInputSchema>;

const GenerateCharacterBriefOutputSchema = z.object({
    characterBrief: z.string().describe("A detailed summary of the character's personality, motivations, speaking style, and key relationships based on the story text."),
});
export type GenerateCharacterBriefOutput = z.infer<typeof GenerateCharacterBriefOutputSchema>;


export async function generateCharacterBrief(input: GenerateCharacterBriefInput): Promise<GenerateCharacterBriefOutput> {
   return generateCharacterBriefFlow(input);
}

const generateCharacterBriefFlow = ai.defineFlow(
    {
        name: 'generateCharacterBriefFlow',
        inputSchema: GenerateCharacterBriefInputSchema,
        outputSchema: GenerateCharacterBriefOutputSchema,
    },
    async (input) => {
        const { characterName, storyText } = input;

        const prompt = ai.definePrompt({
            name: 'characterBriefPrompt',
            input: { schema: GenerateCharacterBriefInputSchema },
            output: { schema: GenerateCharacterBriefOutputSchema },
            prompt: `You are an expert script analyst and casting director. Your task is to create a detailed, one-paragraph "Character Brief" for an actor who will be playing the role of '{{characterName}}'.

Read the entire story text provided below. Based on the character's actions, dialogue, and how others react to them, synthesize a comprehensive summary covering:
- **Core Personality:** Are they brave, cowardly, witty, naive, cynical?
- **Primary Motivations:** What do they want? What drives their decisions?
- **Speaking Style:** Do they speak in long, elaborate sentences or short, clipped ones? Are they formal or informal?
- **Key Relationships:** Briefly describe their relationship with other major characters.
- **Relevant Knowledge:** What do they know (and not know) about the events of the story?

This brief will be the actor's only source of information. It needs to be rich enough for them to embody the character completely.

**Character to Analyze:** {{characterName}}

**Full Story Text:**
\`\`\`
{{storyText}}
\`\`\`

Return the result as a single JSON object with the key 'characterBrief'.
`,
        });

        const { output } = await prompt(input);
        return output!;
    }
);
