/**
 * Tests for Mock Audio Service
 * Validates contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockAudioService } from './MockAudioService';
import type { IAudioService } from '../contracts';

describe('MockAudioService', () => {
  let service: IAudioService;

  beforeEach(() => {
    service = new MockAudioService();
  });

  describe('generateMultiVoiceAudio', () => {
    const mockSegments = [
      {
        character: 'Hero',
        dialogue: 'Hello world!',
        emotion: 'happy',
      },
      {
        character: 'Narrator',
        dialogue: 'The story begins...',
        emotion: 'neutral',
      },
    ];

    const mockCharacters = [
      {
        name: 'Hero',
        description: 'The protagonist',
        voiceId: 'voice-1',
      },
      {
        name: 'Narrator',
        description: 'The storyteller',
        voiceId: 'voice-2',
      },
    ];

    it('should generate audio for valid segments', async () => {
      const result = await service.generateMultiVoiceAudio(
        mockSegments,
        mockCharacters
      );

      expect(result).toBeDefined();
      expect(result.audioDataUri).toBeDefined();
      expect(result.transcript).toBeInstanceOf(Array);
      expect(typeof result.audioDataUri).toBe('string');
      expect(result.audioDataUri).toMatch(/^data:audio/);
    });

    it('should throw error for empty segments', async () => {
      await expect(
        service.generateMultiVoiceAudio([], mockCharacters)
      ).rejects.toThrow('Segments cannot be empty');
    });

    it('should return transcript with required properties', async () => {
      const result = await service.generateMultiVoiceAudio(
        mockSegments,
        mockCharacters
      );

      expect(result.transcript.length).toBeGreaterThan(0);
      result.transcript.forEach((segment) => {
        expect(segment).toHaveProperty('character');
        expect(segment).toHaveProperty('text');
        expect(segment).toHaveProperty('startTime');
        expect(segment).toHaveProperty('endTime');
        expect(typeof segment.startTime).toBe('number');
        expect(typeof segment.endTime).toBe('number');
      });
    });

    it('should generate word-level timing in transcript', async () => {
      const result = await service.generateMultiVoiceAudio(
        mockSegments,
        mockCharacters
      );

      result.transcript.forEach((segment) => {
        expect(segment.words).toBeInstanceOf(Array);
        segment.words.forEach((word) => {
          expect(word).toHaveProperty('word');
          expect(word).toHaveProperty('startTime');
          expect(word).toHaveProperty('endTime');
        });
      });
    });
  });

  describe('generateSingleVoiceAudio', () => {
    it('should generate audio for valid text', async () => {
      const result = await service.generateSingleVoiceAudio(
        'Hello world',
        'voice-1',
        'happy'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^data:audio/);
    });

    it('should throw error for empty text', async () => {
      await expect(
        service.generateSingleVoiceAudio('', 'voice-1')
      ).rejects.toThrow('Text cannot be empty');
    });

    it('should work without emotion parameter', async () => {
      const result = await service.generateSingleVoiceAudio(
        'Hello world',
        'voice-1'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});
