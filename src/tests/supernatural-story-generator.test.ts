import { describe, expect, test } from 'vitest';
import { SupernaturalStoryInputSchema, GeneratedSupernaturalStorySchema } from '../ai/schemas';

describe('Supernatural Story Generator', () => {
  test('should validate input schema correctly', () => {
    const validInput = {
      prompt: "A vampire librarian discovers an ancient prophecy",
      spiceLevel: 3,
      creatureType: 'vampire',
      episodeLength: 'medium',
      tone: 'mysterious'
    };

    const result = SupernaturalStoryInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  test('should reject invalid spice levels', () => {
    const invalidInput = {
      prompt: "A story",
      spiceLevel: 6, // Invalid - should be 1-5
      creatureType: 'vampire',
      episodeLength: 'medium',
      tone: 'mysterious'
    };

    const result = SupernaturalStoryInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  test('should reject invalid creature types', () => {
    const invalidInput = {
      prompt: "A story",
      spiceLevel: 3,
      creatureType: 'dragon', // Invalid - not in enum
      episodeLength: 'medium',
      tone: 'mysterious'
    };

    const result = SupernaturalStoryInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  test('should validate generated story schema', () => {
    const generatedStory = {
      title: "Moonlit Desires",
      storyText: "Narrator: The ancient library held secrets darker than midnight...",
      spiceLevel: 3,
      wordCount: 1500,
      creatureElements: ["vampire", "ancient magic", "forbidden romance"],
      serialHooks: ["Who is the mysterious figure in the shadows?", "What power lies within the ancient tome?"]
    };

    const result = GeneratedSupernaturalStorySchema.safeParse(generatedStory);
    expect(result.success).toBe(true);
  });

  test('should have all required prompt elements in flow', async () => {
    // Load the flow file to verify it contains key elements
    const fs = await import('fs');
    const path = await import('path');
    
    const flowPath = path.resolve('./src/ai/flows/generate-supernatural-story.ts');
    const flowContent = fs.readFileSync(flowPath, 'utf-8');

    // Check for banned words
    expect(flowContent).toContain('suddenly');
    expect(flowContent).toContain('felt');
    expect(flowContent).toContain('was [adjective]');

    // Check for creature guidelines
    expect(flowContent).toContain('Vampires:');
    expect(flowContent).toContain('Werewolves:');
    expect(flowContent).toContain('Fairies:');

    // Check for spice levels
    expect(flowContent).toContain('Level 1');
    expect(flowContent).toContain('Level 5');

    // Check for audio format requirements
    expect(flowContent).toContain('[Speaker]:');
    expect(flowContent).toContain('NON-NEGOTIABLE');

    // Check for show don't tell examples
    expect(flowContent).toContain('BAD');
    expect(flowContent).toContain('GOOD');

    // Check for consent guidelines
    expect(flowContent).toContain('consent');
    expect(flowContent.toLowerCase()).toContain('chemistry');

    // Check for serialization hooks
    expect(flowContent).toContain('SERIALIZATION HOOKS');
  });
});