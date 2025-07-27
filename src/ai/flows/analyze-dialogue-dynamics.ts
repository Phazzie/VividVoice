'use server';

/**
 * @fileOverview Implements an AI agent that analyzes dialogue for power dynamics and pacing.
 * 
 * - analyzeDialogueDynamics - A function that handles the dialogue dynamics analysis.
 * - AnalyzeDialogueDynamicsInput - The input type for the function.
 * - AnalyzeDialogueDynamicsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DialogueDynamicsSchema } from '@/ai/schemas';

const AnalyzeDialogueDynamicsInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type AnalyzeDialogueDynamicsInput = z.infer<typeof AnalyzeDialogueDynamicsInputSchema>;

export type AnalyzeDialogueDynamicsOutput = z.infer<typeof DialogueDynamicsSchema>;


export async function analyzeDialogueDynamics(input: AnalyzeDialogueDynamicsInput): Promise<AnalyzeDialogueDynamicsOutput> {
    return analyzeDialogueDynamicsFlow(input);
}

const analyzeDialogueDynamicsFlow = ai.defineFlow(
  {
    name: 'analyzeDialogueDynamicsFlow',
    inputSchema: AnalyzeDialogueDynamicsInputSchema,
    outputSchema: DialogueDynamicsSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'dialogueDynamicsPrompt',
      input: {schema: AnalyzeDialogueDynamicsInputSchema},
      output: {schema: DialogueDynamicsSchema},
      prompt: `You are an expert script analyst and editor with a background in psychology. Your task is to perform a detailed analysis of the provided story text to understand the power dynamics and pacing of the dialogue.

**CRITICAL INSTRUCTIONS:**
- You MUST exclude the 'Narrator' from all character-specific metrics. Focus only on the dialogue between characters who are not the narrator.
- Ensure all numeric fields in the output are populated correctly. If a character has zero of something (e.g., questions asked), the value must be 0, not null.

**ANALYSIS STEPS:**
1.  **Power Balance Analysis**: For each character involved in the dialogue (excluding the Narrator), you will meticulously calculate the following metrics:
    *   'dialogueTurns': The total number of times the character has a block of dialogue.
    *   'wordCount': The total number of words spoken by the character across all their turns.
    *   'questionsAsked': The number of sentences spoken by the character that end in a question mark (?).
    *   'assertionsMade': The number of sentences that are declarative statements, not questions.
    *   'powerPlays': Identify specific conversational tactics or 'power plays' used by the character. For each, provide the 'tactic' name (e.g., "Dismissive Echo", "Leading Question", "Gish Gallop") and the 'quote' where it's used.

2.  **Pacing Analysis**:
    *   Calculate the 'overallWordsPerTurn' for the entire dialogue, averaging across all characters (excluding the Narrator).
    *   For each character (excluding the Narrator), calculate their average 'wordsPerTurn'.

3.  **Summary**: Based on your quantitative and qualitative analysis, provide a brief, insightful 'summary' of the dialogue dynamics. Mention who appears to be driving the conversation, whether the power balance is even or skewed, and what specific tactics are being used to establish dominance.

Return a single JSON object structured precisely according to the DialogueDynamics schema.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  Narrator: The air in the boardroom was thick with tension.
  Ms. Vance: So, the quarter's numbers are in. They are not good. I've reviewed the data, and the projections are worse. What happened, Frank?
  Frank: We hit unexpected headwinds. The market shifted.
  Ms. Vance: The market shifted. That's your analysis.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "powerBalance": [
      {
        "character": "Ms. Vance",
        "metrics": {
          "dialogueTurns": 2,
          "wordCount": 28,
          "questionsAsked": 1,
          "assertionsMade": 3
        },
        "powerPlays": [
          {
            "tactic": "Leading Question",
            "quote": "What happened, Frank?"
          },
          {
            "tactic": "Dismissive Echo",
            "quote": "The market shifted. That's your analysis."
          }
        ]
      },
      {
        "character": "Frank",
        "metrics": {
          "dialogueTurns": 1,
          "wordCount": 7,
          "questionsAsked": 0,
          "assertionsMade": 2
        },
        "powerPlays": []
      }
    ],
    "pacing": {
      "overallWordsPerTurn": 11.67,
      "characterPacing": [
        {
          "character": "Ms. Vance",
          "wordsPerTurn": 14
        },
        {
          "character": "Frank",
          "wordsPerTurn": 7
        }
      ]
    },
    "summary": "The dialogue is significantly skewed, with Ms. Vance dominating the conversation. She speaks four times as many words as Frank and uses tactics like Leading Questions and Dismissive Echoes to control the narrative and put Frank on the defensive. Frank is reactive and brief, indicating a clear power imbalance."
  }
  \`\`\`

Now, analyze the following story text using the same method.

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
