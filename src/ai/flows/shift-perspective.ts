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
            prompt: `You are a master storyteller and literary analyst. Your task is to rewrite a summary of the provided story, but from the unique perspective of a specific character, casting them in a new light.

**Instructions:**
1.  Read the entire original story text to fully understand the plot, events, and all characters.
2.  Adopt the voice, worldview, and knowledge of the specified character: '{{characterName}}'.
3.  Rewrite a one-paragraph summary of the story's main events as if '{{characterName}}' were the '{{role}}' of the story.
4.  The summary must reflect their biases, motivations, and interpretation of events. For example, if they are the 'Antagonist', they might see the original hero's actions as villainous or misguided. If they are the 'Protagonist', events will be framed around their struggles and goals.
5.  The summary should be compelling and written in a narrative style, not a dry list of events.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: Sir Gideon, the valiant knight, drew his shining sword and charged the dragon's lair to rescue the kingdom's stolen treasure.
  \`\`\`
- **Input Character to Embody:** The Dragon
- **Input New Role:** Protagonist
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "character": "The Dragon",
    "role": "Protagonist",
    "summary": "For centuries, I peacefully guarded the sacred ancestral artifacts of my clan in my mountain sanctuary. Then, one day, a loud, tin-plated thief named Gideon invaded my home, waving a sharp piece of metal and making baseless accusations about 'stolen treasure.' I was forced to defend my home and my heritage from this violent intruder, who clearly had no respect for ancient traditions."
  }
  \`\`\`

Return a single JSON object containing the character's name, their new role, and the rewritten summary.

**Character to Embody:** {{characterName}}
**New Role:** {{role}}

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