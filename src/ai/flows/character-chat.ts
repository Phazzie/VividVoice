
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

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CharacterSchema, ChatMessageSchema } from '@/ai/schemas';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { GoogleGenerativeAiEmbeddings } from '@langchain/google-genai';
import { Document } from 'langchain/document';

const CharacterChatInputSchema = z.object({
  character: CharacterSchema.describe(
    "The character object, containing a detailed description which serves as the actor's brief."
  ),
  history: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
  userMessage: z.string().describe("The user's latest message to the character."),
  storyText: z.string().describe('The full text of the story for context retrieval.'),
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
    const { character, history, userMessage, storyText } = input;

    // 1. Create a vector store from the story text
    const vectorStore = await FaissStore.fromDocuments(
      [new Document({ pageContent: storyText })],
      new GoogleGenerativeAiEmbeddings({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
        model: 'text-embedding-004',
      })
    );

    // 2. Retrieve relevant context from the story
    const retriever = vectorStore.asRetriever();
    const relevantDocs = await retriever.invoke(userMessage);
    const storyContext = relevantDocs.map((doc) => doc.pageContent).join('\n\n');

    const prompt = ai.definePrompt({
      name: 'characterChatPrompt',
      input: { schema: z.object({ character, history, userMessage, storyContext }) },
      output: { schema: CharacterChatOutputSchema },
      prompt: `You are a world-class method actor preparing for a role. The character you are playing is named {{character.name}}.

Your task is to respond to the user's questions AS the character. Stay in character at all times. Use the provided Character Brief and the story context as the absolute source of truth.

**Character Brief for {{character.name}}:**
This is the most important information. The character's true voice, personality, and knowledge are defined by this brief.
\`\`\`
{{character.description}}
\`\`\`

**Relevant Story Context:**
Here are some excerpts from the story that might be relevant to the current conversation.
\`\`\`
{{storyContext}}
\`\`\`

**Interview History:**
This is the conversation you've had with the "interviewer" (the user) so far.
{{#each history}}
  - {{#if isUser}}Interviewer: {{else}}{{../character.name}}:{{/if}} {{message}}
{{/each}}

**New Question from Interviewer:**
{{userMessage}}

Now, provide the character's response. It must be consistent with their personality from the Character Brief and informed by the story context. Do not break character. Do not be a generic chatbot.
`,
    });

    const { output } = await prompt({ character, history, userMessage, storyContext });
    return output!;
  }
);
