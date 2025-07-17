
'use server';

/**
 * @fileOverview Implements an AI agent that scans text for literary devices.
 * 
 * - analyzeLiteraryDevices - A function that handles the literary device analysis.
 * - AnalyzeLiteraryDevicesInput - The input type for the function.
 * - AnalyzeLiteraryDevicesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { LiteraryDeviceSchema } from '@/ai/schemas';

const AnalyzeLiteraryDevicesInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze.'),
});
export type AnalyzeLiteraryDevicesInput = z.infer<typeof AnalyzeLiteraryDevicesInputSchema>;

const AnalyzeLiteraryDevicesOutputSchema = z.object({
    devices: z.array(LiteraryDeviceSchema),
});
export type AnalyzeLiteraryDevicesOutput = z.infer<typeof AnalyzeLiteraryDevicesOutputSchema>;


export async function analyzeLiteraryDevices(input: AnalyzeLiteraryDevicesInput): Promise<AnalyzeLiteraryDevicesOutput> {
    return analyzeLiteraryDevicesFlow(input);
}


const analyzeLiteraryDevicesFlow = ai.defineFlow(
  {
    name: 'analyzeLiteraryDevicesFlow',
    inputSchema: AnalyzeLiteraryDevicesInputSchema,
    outputSchema: AnalyzeLiteraryDevicesOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'literaryDevicePrompt',
      input: {schema: AnalyzeLiteraryDevicesInputSchema},
      output: {schema: AnalyzeLiteraryDevicesOutputSchema},
      prompt: `You are a literary expert with a deep understanding of rhetorical and literary devices. Your task is to meticulously analyze the following story text and identify all instances of literary devices.

For each distinct device you find, you must provide:
1.  The 'device' name (e.g., "Metaphor", "Simile", "Personification", "Foreshadowing", "Irony", "Alliteration"). Be precise in your identification.
2.  The exact 'quote' from the text where the device is used. The quote must be verbatim from the provided text and should be long enough to provide context.
3.  A brief but clear 'explanation' of how the quote exemplifies the literary device. Explain the effect of the device in the context of the quote.

Your goal is to be comprehensive and accurate. Search for a wide range of devices. Return the results as a JSON object with a single key 'devices' containing an array of these objects. If no devices are found, return an empty array.

**High-Quality Example:**
- **Input Story Text:**
  \`\`\`
  The wind whispered warnings through the weeping willows, a sound like a silk sheet slipping over stone.
  \`\`\`
- **Your Perfect JSON Output:**
  \`\`\`json
  {
    "devices": [
      {
        "device": "Personification",
        "quote": "The wind whispered warnings",
        "explanation": "The wind, an inanimate force, is given the human ability to 'whisper warnings,' creating a sense of foreboding and intelligent menace."
      },
      {
        "device": "Alliteration",
        "quote": "weeping willows",
        "explanation": "The repetition of the 'w' sound creates a soft, melancholic auditory effect that reinforces the image of sadness associated with weeping willows."
      },
      {
        "device": "Simile",
        "quote": "a sound like a silk sheet slipping over stone",
        "explanation": "The sound of the wind is compared to a 'silk sheet slipping over stone' using the word 'like'. This creates a specific, eerie auditory image that is both smooth and hard, contributing to the unsettling atmosphere."
      }
    ]
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
