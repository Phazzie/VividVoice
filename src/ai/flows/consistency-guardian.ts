'use server';

/**
 * @fileOverview An AI agent that scans a story for consistency issues.
 * 
 * - findInconsistencies - A function that handles the consistency analysis.
 * - FindInconsistenciesInput - The input type for the function.
 * - FindInconsistenciesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ConsistencyIssueSchema } from '@/ai/schemas';

const FindInconsistenciesInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type FindInconsistenciesInput = z.infer<typeof FindInconsistenciesInputSchema>;

const FindInconsistenciesOutputSchema = z.object({
    issues: z.array(ConsistencyIssueSchema),
});
export type FindInconsistenciesOutput = z.infer<typeof FindInconsistenciesOutputSchema>;


export async function findInconsistencies(input: FindInconsistenciesInput): Promise<FindInconsistenciesOutput> {
    return findInconsistenciesFlow(input);
}


const findInconsistenciesFlow = ai.defineFlow(
    {
        name: 'findInconsistenciesFlow',
        inputSchema: FindInconsistenciesInputSchema,
        outputSchema: FindInconsistenciesOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'consistencyGuardianPrompt',
            input: {schema: FindInconsistenciesInputSchema},
            output: {schema: FindInconsistenciesOutputSchema},
            prompt: `You are a meticulous continuity editor for a major publishing house. Your task is to read the provided story text and identify any and all continuity errors or inconsistencies. Be diligent and thorough.

Look for issues across the entire text, such as:
- **Character Details:** Physical attributes (eye color, height), backstory elements, or personality traits that change without explanation.
- **Plot Holes:** A character knowing something they couldn't possibly know, events happening in an illogical order, or unresolved plot points that are forgotten.
- **Timeline Errors:** Inconsistent references to time, day, or the duration of events.
- **Object Inconsistencies:** An object appearing, disappearing, or changing properties illogically.

For each distinct issue you find, provide:
1.  A concise description of the 'issue'.
2.  The relevant 'quote' (or quotes) from the text that best illustrates the inconsistency.
3.  A brief 'explanation' of why it's a potential problem and how it impacts the narrative's integrity.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: Chapter 1. The young wizard, known for his strict pacifist code, entered the tavern. His striking green eyes scanned the room.
  ...
  Narrator: Chapter 5. Cornered, the wizard drew his sword and slew the goblin. He stared at the body, his brown eyes filled with a cold fury.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "issues": [
      {
        "issue": "Character's eye color changes",
        "quote": "His striking green eyes scanned the room. ... He stared at the body, his brown eyes filled with a cold fury.",
        "explanation": "The character's eye color is described as 'green' in Chapter 1 and 'brown' in Chapter 5. This is a direct contradiction that can break reader immersion."
      },
      {
        "issue": "Character acts against established code",
        "quote": "...known for his strict pacifist code... the wizard drew his sword and slew the goblin.",
        "explanation": "The character is defined by a 'strict pacifist code' but then kills a goblin without any indication that he has abandoned this core principle. This is a significant character inconsistency that undermines a key trait."
      }
    ]
  }
  \`\`\`

Return your findings as a JSON object with an 'issues' array. If no inconsistencies are found after a thorough review, return an empty array.

**Story Text to Analyze:**
\`\`\`
{{{storyText}}}
\`\`\`
`,
        });

        const {output} = await prompt(input);
        return output!;
    }
);
