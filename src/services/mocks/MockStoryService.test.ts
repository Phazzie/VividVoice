/**
 * Tests for Mock Story Service
 * Validates contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockStoryService } from './MockStoryService';
import type { IStoryService } from '../contracts';

describe('MockStoryService', () => {
  let service: IStoryService;

  beforeEach(() => {
    service = new MockStoryService();
  });

  describe('parseStory', () => {
    it('should parse valid story text', async () => {
      const result = await service.parseStory('Once upon a time...');

      expect(result).toBeDefined();
      expect(result.segments).toBeInstanceOf(Array);
      expect(result.characters).toBeInstanceOf(Array);
      expect(result.segments.length).toBeGreaterThan(0);
    });

    it('should throw error for empty text', async () => {
      await expect(service.parseStory('')).rejects.toThrow(
        'Story text cannot be empty'
      );
    });

    it('should return segments with required properties', async () => {
      const result = await service.parseStory('Test story');

      result.segments.forEach((segment) => {
        expect(segment).toHaveProperty('character');
        expect(segment).toHaveProperty('dialogue');
        expect(typeof segment.character).toBe('string');
        expect(typeof segment.dialogue).toBe('string');
      });
    });

    it('should return characters with required properties', async () => {
      const result = await service.parseStory('Test story');

      result.characters.forEach((character) => {
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('description');
        expect(typeof character.name).toBe('string');
        expect(typeof character.description).toBe('string');
      });
    });
  });

  describe('analyzeStory', () => {
    it('should analyze valid story text', async () => {
      const result = await service.analyzeStory('Once upon a time...');

      expect(result).toBeDefined();
      expect(result.segments).toBeInstanceOf(Array);
      expect(result.characters).toBeInstanceOf(Array);
      expect(result.dialogueDynamics).toBeDefined();
      expect(result.literaryDevices).toBeDefined();
      expect(result.pacing).toBeDefined();
      expect(result.tropes).toBeDefined();
      expect(result.showDontTellSuggestions).toBeDefined();
      expect(result.consistencyIssues).toBeDefined();
      expect(result.subtextAnalyses).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it('should throw error for empty text', async () => {
      await expect(service.analyzeStory('')).rejects.toThrow(
        'Story text cannot be empty'
      );
    });

    it('should return errors object', async () => {
      const result = await service.analyzeStory('Test story');

      expect(result.errors).toBeDefined();
      expect(typeof result.errors).toBe('object');
    });
  });

  describe('analyzeEmotionalTone', () => {
    it('should analyze emotional tone', async () => {
      const result = await service.analyzeEmotionalTone(
        'I am happy!',
        'Context text'
      );

      expect(result).toBeDefined();
      expect(result.emotion).toBeDefined();
      expect(typeof result.emotion).toBe('string');
    });
  });

  describe('analyzeDialogueDynamics', () => {
    it('should analyze dialogue dynamics', async () => {
      const result = await service.analyzeDialogueDynamics('Test story');

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.powerBalance).toBeInstanceOf(Array);
      expect(result.pacing).toBeDefined();
    });
  });

  describe('analyzeLiteraryDevices', () => {
    it('should analyze literary devices', async () => {
      const result = await service.analyzeLiteraryDevices('Test story');

      expect(result).toBeDefined();
      expect(result.devices).toBeInstanceOf(Array);
      result.devices.forEach((device) => {
        expect(device).toHaveProperty('type');
        expect(device).toHaveProperty('quote');
        expect(device).toHaveProperty('explanation');
      });
    });
  });

  describe('analyzePacing', () => {
    it('should analyze pacing', async () => {
      const result = await service.analyzePacing('Test story');

      expect(result).toBeDefined();
      expect(result.segments).toBeInstanceOf(Array);
      result.segments.forEach((segment) => {
        expect(segment).toHaveProperty('start');
        expect(segment).toHaveProperty('end');
        expect(segment).toHaveProperty('type');
      });
    });
  });

  describe('invertTropes', () => {
    it('should identify and invert tropes', async () => {
      const result = await service.invertTropes('Test story');

      expect(result).toBeDefined();
      expect(result.tropes).toBeInstanceOf(Array);
      result.tropes.forEach((trope) => {
        expect(trope).toHaveProperty('name');
        expect(trope).toHaveProperty('description');
        expect(trope).toHaveProperty('suggestion');
      });
    });
  });

  describe('getShowDontTellSuggestions', () => {
    it('should provide show dont tell suggestions', async () => {
      const result = await service.getShowDontTellSuggestions('Test story');

      expect(result).toBeDefined();
      expect(result.suggestions).toBeInstanceOf(Array);
      result.suggestions.forEach((suggestion) => {
        expect(suggestion).toHaveProperty('original');
        expect(suggestion).toHaveProperty('suggestion');
        expect(suggestion).toHaveProperty('explanation');
      });
    });
  });

  describe('findInconsistencies', () => {
    it('should find consistency issues', async () => {
      const result = await service.findInconsistencies('Test story');

      expect(result).toBeDefined();
      expect(result.issues).toBeInstanceOf(Array);
    });
  });

  describe('analyzeSubtext', () => {
    it('should analyze subtext', async () => {
      const result = await service.analyzeSubtext('Test story');

      expect(result).toBeDefined();
      expect(result.analyses).toBeInstanceOf(Array);
      result.analyses.forEach((analysis) => {
        expect(analysis).toHaveProperty('dialogue');
        expect(analysis).toHaveProperty('character');
        expect(analysis).toHaveProperty('subtext');
      });
    });
  });
});
