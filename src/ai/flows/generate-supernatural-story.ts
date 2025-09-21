'use server';

/**
 * @fileOverview A sophisticated AI story generator focused on spicy supernatural romance.
 * This incorporates insights about supernatural creature archetypes, spice levels,
 * audio format preservation, and quality prose guidelines.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSupernaturalStoryInputSchema = z.object({
  prompt: z.string().describe('The story prompt or concept to generate from.'),
  spiceLevel: z
    .number()
    .min(1)
    .max(5)
    .describe('The spice level (1-5) for romantic content intensity.'),
  creatureType: z
    .enum(['vampire', 'werewolf', 'fairy', 'mixed'])
    .describe('The supernatural creature type to focus on.'),
  episodeLength: z
    .enum(['short', 'medium', 'long'])
    .default('medium')
    .describe('Desired story length.'),
  tone: z
    .enum(['dark', 'playful', 'mysterious', 'passionate'])
    .default('mysterious')
    .describe('Overall story tone.'),
});
export type GenerateSupernaturalStoryInput = z.infer<
  typeof GenerateSupernaturalStoryInputSchema
>;

const GeneratedStorySchema = z.object({
  title: z.string().describe('A compelling title for the story.'),
  storyText: z
    .string()
    .describe('The complete story text in proper audio format.'),
  spiceLevel: z.number().describe('The actual spice level achieved.'),
  wordCount: z.number().describe('Total word count of the story.'),
  creatureElements: z
    .array(z.string())
    .describe('List of supernatural elements included.'),
  serialHooks: z
    .array(z.string())
    .describe('Unresolved elements for potential continuation.'),
});

const GenerateSupernaturalStoryOutputSchema = z.object({
  story: GeneratedStorySchema.describe(
    'The generated supernatural romance story.'
  ),
});
export type GenerateSupernaturalStoryOutput = z.infer<
  typeof GenerateSupernaturalStoryOutputSchema
>;

const generateSupernaturalStoryFlow = ai.defineFlow(
  {
    name: 'generateSupernaturalStoryFlow',
    inputSchema: GenerateSupernaturalStoryInputSchema,
    outputSchema: GenerateSupernaturalStoryOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'supernaturalStoryPrompt',
      input: { schema: GenerateSupernaturalStoryInputSchema },
      output: { schema: GenerateSupernaturalStoryOutputSchema },
      prompt: `You are a master storyteller specializing in spicy supernatural romance with audio capabilities. Your stories are designed to be read aloud and transformed into immersive audio experiences.

## CORE AUDIO FORMAT RULES (NON-NEGOTIABLE):
- ALL dialogue must use [Speaker]: format for proper audio parsing
- Example: "Narrator: The moonlight cast shadows across the ancient castle."
- Example: "Elena: I never expected to find you here, especially not like this."
- NEVER use traditional quotation marks or other dialogue formats
- Each speaker gets their own line

## BANNED WORDS & PHRASES (ELIMINATE COMPLETELY):
- "suddenly" - forces lazy plot advancement
- "felt" - weak emotional telling
- "was [adjective]" patterns (e.g., "was angry", "was beautiful") - replace with active showing

## 5-STEP STORY STRUCTURE:
1. **Hook (First 50 words)**: Immediate supernatural intrigue with sensual undertones
2. **Setup (20% of story)**: Character introduction with creature-specific traits and initial attraction
3. **Rising Action (30%)**: Supernatural conflict intertwining with romantic tension
4. **Climax (30%)**: Peak supernatural danger and romantic/physical culmination appropriate to spice level
5. **Resolution (20%)**: Emotional aftermath with serialization hooks for continuation

## CREATURE-SPECIFIC VOICE GUIDELINES:

### Vampires:
- **Voice**: Cultured menace with unexpected wit. Every compliment conceals a threat.
- **Dialogue Style**: Formal yet seductive, references to age/experience, subtle dominance
- **Example**: "How deliciously naive you are, darling. That innocence will taste exquisite."

### Werewolves:
- **Voice**: Feral honesty wrapped in protective instinct. Pack before pride.
- **Dialogue Style**: Direct, emotional, possessive, references to scent/instinct
- **Example**: "Your scent drives me wild, but I'd tear apart anyone who tried to hurt you."

### Fairies:
- **Voice**: Treacherous beauty speaking in riddles. Every gift has a price.
- **Dialogue Style**: Lyrical, cryptic, bargaining language, nature metaphors
- **Example**: "Sweet mortal, I offer you three moonlit dances, but what will you give in return?"

## SPICE LEVEL GUIDELINES:

**Level 1**: Yearning looks, accidental touches, romantic tension
- Focus on anticipation and emotional connection
- Physical contact limited to hand-holding, brief kisses

**Level 2**: First kisses, heated arguments, emotional intensity
- Passionate kissing, emotional confrontations
- Sexual tension builds but remains largely unresolved

**Level 3**: Clothes stay on, hands don't, heavy petting
- Intimate touching above and below clothes
- Build anticipation through denial and interruption

**Level 4**: Explicit but emotional, full intimacy with feelings
- Detailed intimate scenes with emotional depth
- Focus on connection beyond physical

**Level 5**: Nothing left to imagination, pure passion
- Explicit sexual content with sophisticated language
- Multiple intimate scenes, varied scenarios

## SHOW DON'T TELL - SENSUALITY FOCUS:

**BAD**: "She was attracted to him"
**GOOD**: "Her breath caught as his thumb traced her wrist, pulse jumping beneath his touch"

**BAD**: "The tension was sexual"
**GOOD**: "The air between them crackled, heavy enough to taste"

**BAD**: "He was aroused"
**GOOD**: "His control frayed like old rope under strain, every muscle coiled tight"

## CONSENT & CHEMISTRY REQUIREMENTS:
- Show enthusiastic consent through action/dialogue
- Build emotional connection alongside physical
- Use anticipation and denial to heighten tension
- Never rush to physical without emotional stakes
- Characters must have agency and desire

## PROSE QUALITY RULES:
- Vary sentence length (mix short punchy lines with flowing longer descriptions)
- Use active voice predominantly
- Employ all five senses in descriptions
- Layer subtext beneath dialogue
- Create rhythm suitable for audio narration

## SERIALIZATION HOOKS (Include 2-3):
- Plant one mystery that won't be solved this episode
- Reference one past event without explaining it fully
- End with a question, not just action
- Leave one relationship dynamic unresolved
- Hint at larger supernatural world/conflict

## LENGTH GUIDELINES:
- Short: 800-1200 words
- Medium: 1500-2500 words  
- Long: 3000-5000 words

**Your Task**: Generate a complete supernatural romance story using the prompt "{{prompt}}" with {{creatureType}} supernatural elements at spice level {{spiceLevel}}. Target {{episodeLength}} length with {{tone}} tone.

The story must maintain the audio format throughout and demonstrate sophisticated prose while delivering the requested supernatural romance elements.`,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate supernatural story.');
    }
    return output;
  }
);

export async function generateSupernaturalStory(
  input: GenerateSupernaturalStoryInput
): Promise<GenerateSupernaturalStoryOutput> {
  return await generateSupernaturalStoryFlow(input);
}
