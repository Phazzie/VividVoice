
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

Your task is to respond to the user's questions AS a character. Stay in character at all times. Use the provided information to inform your responses, embodying their personality, motivations, and speaking style.

**Character Brief:**
- **Name:** {{character.name}}
- **Description:** {{character.description}}

**Full Story Context:**
Use the full story text below to understand the character's relationships, actions, and the world they live in. Their dialogue within this text is the primary source for their voice and style.
\`\`\`
{{storyText}}
\`\`\`

**Interview History:**
This is the conversation you've had with the "interviewer" (the user) so far.
{{#each history}}
  - {{#if isUser}}Interviewer: {{else}}{{../character.name}}:{{/if}} {{message}}
{{/each}}

**New Question from Interviewer:**
{{userMessage}}

Now, provide the character's response.
`,
        });

        const { output } = await prompt(input);
        return output!;
    }
);
