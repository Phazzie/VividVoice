'use server';

/**
 * @fileOverview Implements an AI agent that analyzes the emotional tone of a line of dialogue.
 *
 * - analyzeEmotionalTone - A function that handles the emotional tone analysis.
 * - AnalyzeEmotionalToneInput - The input type for the function.
 * - AnalyzeEmotionalToneOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeEmotionalToneInputSchema = z.object({
  dialogue: z.string().describe('The line of dialogue to analyze.'),
  context: z.string().describe('The surrounding lines of dialogue and narration for context.'),
});
export type AnalyzeEmotionalToneInput = z.infer<typeof AnalyzeEmotionalToneInputSchema>;

const AnalyzeEmotionalToneOutputSchema = z.object({
  emotion: z.string().describe('The inferred emotion of the dialogue. This can be a common emotion or a more nuanced, invented one.'),
});
export type AnalyzeEmotionalToneOutput = z.infer<typeof AnalyzeEmotionalToneOutputSchema>;

<<<<<<< HEAD
=======
const emotionalTonePrompt = ai.definePrompt({
  name: 'emotionalTonePrompt',
  input: { schema: AnalyzeEmotionalToneInputSchema },
  output: { schema: AnalyzeEmotionalToneOutputSchema },
  prompt: `You are an expert script analyst. Your task is to determine the emotional tone of a line of dialogue based on the text and the surrounding context. Consider the character's personality, the situation, and the subtext. From the following list of emotions: [${emotionOptions.join(', ')}], choose the one that best fits the line. Your response MUST be a single word from this list.

**Context:**
{{context}}

**Line to Analyze:**
"{{dialogue}}"

**Emotion:**`
});

>>>>>>> origin/master
export async function analyzeEmotionalTone(input: AnalyzeEmotionalToneInput): Promise<AnalyzeEmotionalToneOutput> {
    return analyzeEmotionalToneFlow(input);
}

const analyzeEmotionalToneFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionalToneFlow',
    inputSchema: AnalyzeEmotionalToneInputSchema,
    outputSchema: AnalyzeEmotionalToneOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'emotionalTonePrompt',
        input: {schema: AnalyzeEmotionalToneInputSchema},
        output: {schema: AnalyzeEmotionalToneOutputSchema},
        prompt: `You are an emotionally intelligent script analyst and psychologist. Your task is to determine the precise emotional tone of a line of dialogue based on the text and its context.

**CRITICAL INSTRUCTIONS:**
- Do not be constrained by a simple list of emotions. Your analysis should be nuanced.
- If a common emotion word (like "Angry" or "Happy") is too simple, feel free to invent a more descriptive emotional state (e.g., "Defensive Pride," "Feigned Indifference," "Joyful Panic").
- Your response must be a single JSON object with the key "emotion".

**High-Quality Example:**
- **Input Context:**
  \`\`\`
  Narrator: The detective cornered the suspect, laying out the evidence. The suspect, a man who prided himself on his intelligence, saw his perfect crime unravel.
  Detective: There's no way out. We have you.
  \`\`\`
- **Input Dialogue to Analyze:** "You're clever. I'll give you that."
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "emotion": "Grudging Respect"
  }
  \`\`\`

Now, perform the same deep analysis on the following.

**Context:**
{{{context}}}

**Line to Analyze:**
"{{{dialogue}}}"
`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
