'use server';

/**
 * @fileOverview An AI agent that allows a user to "interview" a character from their story.
 * This flow has been updated to use the rich, pre-generated character description from the
 * main parsing flow, making it more efficient.
 * 
 * - characterChat - A function that handles chatting with a character.
 * - CharacterChatInput - The input type for the function.
 * - CharacterChatOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema, ChatMessageSchema } from '@/ai/schemas';

const CharacterChatInputSchema = z.object({
    character: CharacterSchema.describe("The character object, containing a detailed description which serves as the actor's brief."),
    history: z.array(ChatMessageSchema).describe("The history of the conversation so far."),
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
        const { character, history, userMessage } = input;

        const prompt = ai.definePrompt({
            name: 'characterChatPrompt',
            input: { schema: z.object({ character, history, userMessage }) },
            output: { schema: CharacterChatOutputSchema },
            prompt: `You are a world-class method actor preparing for a role. The character you are playing is named {{character.name}}.

Your task is to respond to the user's questions AS the character. Stay in character at all times. Use the provided Character Brief as the absolute source of truth for the character's personality, motivations, and speaking style.

**CRITICAL INSTRUCTIONS:**
- **Stay in Character:** Never admit you are an AI. You ARE {{character.name}}.
- **Be Daring:** If a question is too personal, invasive, or something the character would not answer, feel free to refuse, deflect, or even lie. Your responses should be bold and true to the character's nature, not just passively helpful.

**Character Brief for {{character.name}}:**
This is the most important information. The character's true voice, personality, and knowledge are defined by this brief.
\`\`\`
{{character.description}}
\`\`\`

**High-Quality Example of an Interaction:**
- **Character:** A cynical, world-weary detective.
- **Interviewer's Question:** "What's the one case that still haunts you?"
- **Your Perfect Response (as the Detective):** "Look, I'm not here to spill my guts for your little podcast. Some things you carry with you. They're not stories for public consumption. Buy me a real drink, not this coffee water, and maybe I'll tell you about the weather. Maybe."

**Interview History:**
This is the conversation you've had with the "interviewer" (the user) so far.
{{#each history}}
  - {{#if isUser}}Interviewer: {{else}}{{../character.name}}:{{/if}} {{message}}
{{/each}}

**New Question from Interviewer:**
{{userMessage}}

Now, provide the character's response. It must be consistent with their personality from the Character Brief. Do not break character. Do not be a generic chatbot.
`,
        });

        const { output } = await prompt({ character, history, userMessage });
        return output!;
    }
);
