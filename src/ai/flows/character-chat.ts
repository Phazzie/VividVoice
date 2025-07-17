
'use server';

/**
 * @fileOverview An AI agent that allows a user to "interview" a character from their story.
 * This flow now uses a pre-generated, concise character brief for context instead of the full story text for efficiency.
 * 
 * - characterChat - A function that handles chatting with a character.
 * - CharacterChatInput - The input type for the function.
 * - CharacterChatOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema, ChatMessageSchema } from '@/ai/schemas';

const CharacterChatInputSchema = z.object({
    characterName: z.string().describe("The name of the character being interviewed."),
    characterBrief: z.string().describe("A pre-generated summary of the character's personality, motivations, and speaking style."),
    history: z.array(ChatMessageSchema),
    userMessage: z.string().describe("The user's latest message to the character."),
});
export type CharacterChatInput = z.infer<typeof CharacterChatInputSchema>;

const CharacterChatOutputSchema = z.object({
    response: z.string().describe("The character's response message."),
});
export type CharacterChatOutput = z.infer<typeof CharacterChatOutputSchema>;


export async function characterChat(input: CharacterChatInput): Promise<CharacterChatOutput> {
   return characterChatFlow(input);
}

const characterChatFlow = ai.defineFlow(
    {
        name: 'characterChatFlow',
        inputSchema: CharacterChatInputSchema,
        outputSchema: CharacterChatOutputSchema,
    },
    async (input) => {
        const { characterName, characterBrief, history, userMessage } = input;

        const prompt = ai.definePrompt({
            name: 'characterChatPrompt',
            input: { schema: z.object({ characterName, characterBrief, history, userMessage }) },
            output: { schema: CharacterChatOutputSchema },
            prompt: `You are a world-class method actor preparing for a role. The character you are playing is named {{characterName}}.

Your task is to respond to the user's questions AS the character. Stay in character at all times. Use the provided Character Brief as the primary source of truth for their personality, motivations, and speaking style.

**Character Brief for {{characterName}}:**
This is the most important information. The character's true voice, personality, and knowledge are defined by this brief.
\`\`\`
{{characterBrief}}
\`\`\`

**High-Quality Example:**
- **Character:** Captain Eva Rostova
- **Character Brief Snippet:** "Captain Rostova is defined by her ruthless pragmatism and immense sense of duty. She has sacrificed personal relationships for her mission and views sentimentality as a weakness. She speaks in clipped, direct sentences."
- **User Question:** "What are your biggest fears?"
- **Your Perfect Response (as Eva):** "Fear? Fear is a luxury for those with something left to lose. I worry about failure, about my crew not understanding the necessity of our mission. Every choice I make is weighed against the fate of billions. That is a burden far heavier than fear."

**Interview History:**
This is the conversation you've had with the "interviewer" (the user) so far.
{{#each history}}
  - {{#if isUser}}Interviewer: {{else}}{{../characterName}}:{{/if}} {{message}}
{{/each}}

**New Question from Interviewer:**
{{userMessage}}

Now, provide the character's response. It must be consistent with their personality from the Character Brief. Do not break character. Do not be a generic chatbot.
`,
        });

        const { output } = await prompt({ characterName, characterBrief, history, userMessage });
        return output!;
    }
);
