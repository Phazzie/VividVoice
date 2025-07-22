'use server';

/**
 * @fileOverview An AI agent that rewrites a story summary from a different character's perspective.
 * 
 * - shiftPerspective - A function that handles the perspective shift.
 * - ShiftPerspectiveInput - The input type for the function.
 * - ShiftPerspectiveOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PerspectiveSchema } from '@/ai/schemas';

const ShiftPerspectiveInputSchema = z.object({
  storyText: z.string().describe('The full text of the original story.'),
  characterName: z.string().describe("The name of the character whose perspective we should adopt."),
  role: z.enum(['Protagonist', 'Antagonist']).describe("The new role to cast this character in for the summary."),
  format: z.enum(['summary', 'diaryEntry', 'letter', 'policeStatement']).describe("The format of the rewritten text."),
});
export type ShiftPerspectiveInput = z.infer<typeof ShiftPerspectiveInputSchema>;

export type ShiftPerspectiveOutput = z.infer<typeof PerspectiveSchema>;


export async function shiftPerspective(input: ShiftPerspectiveInput): Promise<ShiftPerspectiveOutput> {
    return shiftPerspectiveFlow(input);
}


const shiftPerspectiveFlow = ai.defineFlow(
    {
        name: 'shiftPerspectiveFlow',
        inputSchema: ShiftPerspectiveInputSchema,
        outputSchema: PerspectiveSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'shiftPerspectivePrompt',
            input: {schema: ShiftPerspectiveInputSchema},
            output: {schema: PerspectiveSchema},
prompt: `You are a master storyteller and literary analyst. Your task is to rewrite a section of the provided story, but from the unique perspective of a specific character, casting them in a new light and in a specific format.

**Instructions:**
1.  Read the entire original story text to fully understand the plot, events, and all characters.
2.  Adopt the voice, worldview, and knowledge of the specified character: '{{characterName}}'.
3.  Rewrite a one-paragraph section of the story's main events as if '{{characterName}}' were the '{{role}}' of the story.
4.  The rewritten text must be in the format of a '{{format}}'.
5.  The rewritten text must reflect their biases, motivations, and interpretation of events. For example, if they are the 'Antagonist', they might see the original hero's actions as villainous or misguided.
6.  The rewritten text should be compelling and written in a narrative style, not a dry list of events.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: Sir Gideon, the valiant knight, drew his shining sword and charged the dragon's lair to rescue the kingdom's stolen treasure.
  \`\`\`
- **Input Character to Embody:** The Dragon
- **Input New Role:** Protagonist
- **Input Format:** diaryEntry
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "character": "The Dragon",
    "role": "Protagonist",
    "rewrittenText": "Dear Diary, another human interrupted my nap today. This one was particularly noisy, clanking around in a metal suit and yelling about some treasure he thinks I stole. I tried to ignore him, but he just wouldn't leave. I really wish they'd learn to respect a dragon's privacy."
  }
  \`\`\`

Return a single JSON object containing the character's name, their new role, and the rewritten text.

**Character to Embody:** {{characterName}}
**New Role:** {{role}}
**Format:** {{format}}

**Original Story Text:**
\`\`\`
{{storyText}}
\`\`\`
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);