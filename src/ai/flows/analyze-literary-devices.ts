
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
1.  The 'device' name (e.g., "Metaphor", "Simile", "Personification", "Foreshadowing", "Irony", "Alliteration").
2.  The exact 'quote' from the text where the device is used. The quote must be verbatim from the provided text.
3.  A brief but clear 'explanation' of how the quote exemplifies the literary device.

Your goal is to be comprehensive and accurate. Return the results as a JSON object with a single key 'devices' containing an array of these objects. If no devices are found, return an empty array.

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
