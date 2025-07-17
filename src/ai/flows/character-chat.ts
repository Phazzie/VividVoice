
'use server';

/**
 * @fileOverview An AI agent that allows a user to "interview" a character from their story.
 * 
 * - characterChat - A function that handles chatting with a character.
 * - CharacterChatInput - The input type for the function.
 * - CharacterChatOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CharacterSchema, ChatMessageSchema } from '@/ai/schemas';

const CharacterChatInputSchema = z.object({
    character: CharacterSchema,
    storyText: z.string().describe("The full text of the story for context."),
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
        const { character, storyText, history, userMessage } = input;

        const prompt = ai.definePrompt({
            name: 'characterChatPrompt',
            input: { schema: CharacterChatInputSchema },
            output: { schema: CharacterChatOutputSchema },
            prompt: `You are a world-class method actor preparing for a role. The character you are playing is named {{character.name}}.

Your task is to respond to the user's questions AS the character. Stay in character at all times. Use the provided information to inform your responses, embodying their personality, motivations, and speaking style as revealed in the story.

**Character Brief:**
- **Name:** {{character.name}}
- **AI-Generated Description:** {{character.description}}

**Full Story Context:**
This is the most important information. The character's true voice, personality, and knowledge are defined by their actions and dialogue within this story. Base your responses primarily on this text.
\`\`\`
{{storyText}}
\`\`\`

**High-Quality Example:**
- **Character:** Captain Eva Rostova
- **Story Context Snippet:** "Captain Rostova stared at the alien artifact, her jaw tight. 'I've sacrificed too much to turn back now,' she whispered, ignoring the concerned pleas of her crew."
- **User Question:** "What are your biggest fears?"
- **Your Perfect Response (as Eva):** "Fear? Fear is a luxury for those with something left to lose. I worry about failure, about my crew not understanding the necessity of our mission. Every choice I make is weighed against the fate of billions. That is a burden far heavier than fear."

**Interview History:**
This is the conversation you've had with the "interviewer" (the user) so far.
{{#each history}}
  - {{#if isUser}}Interviewer: {{else}}{{../character.name}}:{{/if}} {{message}}
{{/each}}

**New Question from Interviewer:**
{{userMessage}}

Now, provide the character's response. It must be consistent with their personality and knowledge from the story text. Do not break character. Do not be a generic chatbot.
`,
        });

        const { output } = await prompt(input);
        return output!;
    }
);
