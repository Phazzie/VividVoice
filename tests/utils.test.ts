import { describe, it, expect } from 'vitest';
import { getCharacterColor } from '@/lib/utils';

describe('getCharacterColor', () => {
  it('should return a specific HSL color for the Narrator', () => {
    const narratorColor = getCharacterColor('Narrator');
    expect(narratorColor).toBe('hsl(190, 100%, 75%)');
  });

   it('should return a specific HSL color for the narrator regardless of case', () => {
    const narratorColor = getCharacterColor('narrator');
    expect(narratorColor).toBe('hsl(190, 100%, 75%)');
  });

  it('should consistently return the same color for the same character name', () => {
    const aliceColor1 = getCharacterColor('Alice');
    const aliceColor2 = getCharacterColor('Alice');
    expect(aliceColor1).toBe(aliceColor2);
  });

  it('should return different colors for different character names', () => {
    const aliceColor = getCharacterColor('Alice');
    const bobColor = getCharacterColor('Bob');
    expect(aliceColor).not.toBe(bobColor);
  });

  it('should return a valid HSL string for any character name', () => {
    const characterName = 'Sir Reginald von Gigglesworth III';
    const color = getCharacterColor(characterName);
    expect(color).toMatch(/^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$/);
  });
});
