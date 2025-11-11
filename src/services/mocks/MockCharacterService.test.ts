/**
 * Tests for Mock Character Service
 * Validates contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockCharacterService } from './MockCharacterService';
import type { ICharacterService } from '../contracts';

describe('MockCharacterService', () => {
  let service: ICharacterService;

  beforeEach(() => {
    service = new MockCharacterService();
  });

  describe('generatePortraits', () => {
    const mockCharacters = [
      {
        name: 'Hero',
        description: 'The brave protagonist',
        voiceId: 'voice-1',
      },
      {
        name: 'Villain',
        description: 'The evil antagonist',
        voiceId: 'voice-2',
      },
      {
        name: 'Narrator',
        description: 'The storyteller',
        voiceId: 'voice-3',
      },
    ];

    it('should generate portraits for valid characters', async () => {
      const result = await service.generatePortraits(mockCharacters);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should exclude narrator from portraits', async () => {
      const result = await service.generatePortraits(mockCharacters);

      const narratorPortrait = result.find((p) => p.name === 'Narrator');
      expect(narratorPortrait).toBeUndefined();
    });

    it('should return empty array for empty characters', async () => {
      const result = await service.generatePortraits([]);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('should return portraits with required properties', async () => {
      const result = await service.generatePortraits(mockCharacters);

      result.forEach((portrait) => {
        expect(portrait).toHaveProperty('name');
        expect(portrait).toHaveProperty('portraitDataUri');
        expect(typeof portrait.name).toBe('string');
        expect(typeof portrait.portraitDataUri).toBe('string');
        expect(portrait.portraitDataUri).toMatch(/^data:image/);
      });
    });
  });

  describe('chatWithCharacter', () => {
    const mockCharacter = {
      name: 'Hero',
      description: 'The brave protagonist',
      voiceId: 'voice-1',
    };

    const mockMessages = [
      {
        role: 'user' as const,
        content: 'Hello, how are you?',
      },
    ];

    it('should chat with character', async () => {
      const result = await service.chatWithCharacter(
        mockCharacter,
        mockMessages
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('content');
      expect(result.role).toBe('assistant');
      expect(typeof result.content).toBe('string');
    });

    it('should throw error for missing character', async () => {
      await expect(
        service.chatWithCharacter(null as any, mockMessages)
      ).rejects.toThrow('Character and messages are required');
    });

    it('should throw error for empty messages', async () => {
      await expect(
        service.chatWithCharacter(mockCharacter, [])
      ).rejects.toThrow('Character and messages are required');
    });

    it('should include character name in response', async () => {
      const result = await service.chatWithCharacter(
        mockCharacter,
        mockMessages
      );

      expect(result.content).toContain(mockCharacter.name);
    });

    it('should reference user message in response', async () => {
      const result = await service.chatWithCharacter(
        mockCharacter,
        mockMessages
      );

      expect(result.content).toContain(mockMessages[0].content);
    });
  });
});
