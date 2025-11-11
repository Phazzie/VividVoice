/**
 * Tests for Mock Data Service
 * Validates contract compliance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockDataService } from './MockDataService';
import type { IDataService } from '../contracts';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    service = new MockDataService();
    service.clear();
  });

  describe('saveStory', () => {
    const mockStoryData = {
      userId: 'user-1',
      title: 'Test Story',
      storyText: 'Once upon a time...',
    };

    it('should create new story', async () => {
      const storyId = await service.saveStory(mockStoryData);

      expect(storyId).toBeDefined();
      expect(typeof storyId).toBe('string');
      expect(storyId).toMatch(/^story-/);
    });

    it('should update existing story', async () => {
      const storyId = await service.saveStory(mockStoryData);
      const updatedData = {
        ...mockStoryData,
        id: storyId,
        title: 'Updated Title',
      };

      const returnedId = await service.saveStory(updatedData);

      expect(returnedId).toBe(storyId);

      const story = await service.getStoryById(storyId);
      expect(story?.title).toBe('Updated Title');
    });

    it('should throw error for missing userId', async () => {
      await expect(
        service.saveStory({ ...mockStoryData, userId: '' })
      ).rejects.toThrow('User ID, title, and story text are required');
    });

    it('should throw error for missing title', async () => {
      await expect(
        service.saveStory({ ...mockStoryData, title: '' })
      ).rejects.toThrow('User ID, title, and story text are required');
    });

    it('should throw error for missing storyText', async () => {
      await expect(
        service.saveStory({ ...mockStoryData, storyText: '' })
      ).rejects.toThrow('User ID, title, and story text are required');
    });

    it('should set timestamps on new story', async () => {
      const storyId = await service.saveStory(mockStoryData);
      const story = await service.getStoryById(storyId);

      expect(story).toBeDefined();
      expect(story?.createdAt).toBeDefined();
      expect(story?.updatedAt).toBeDefined();
      expect(new Date(story!.createdAt).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });

    it('should update timestamp on existing story', async () => {
      const storyId = await service.saveStory(mockStoryData);
      const originalStory = await service.getStoryById(storyId);

      await new Promise((resolve) => setTimeout(resolve, 10));

      await service.saveStory({
        ...mockStoryData,
        id: storyId,
        title: 'Updated',
      });
      const updatedStory = await service.getStoryById(storyId);

      expect(updatedStory?.updatedAt).not.toBe(originalStory?.updatedAt);
    });
  });

  describe('getStoriesForUser', () => {
    it('should return empty array for new user', async () => {
      const stories = await service.getStoriesForUser('user-1');

      expect(stories).toBeInstanceOf(Array);
      expect(stories.length).toBe(0);
    });

    it('should return stories for user', async () => {
      await service.saveStory({
        userId: 'user-1',
        title: 'Story 1',
        storyText: 'Text 1',
      });
      await service.saveStory({
        userId: 'user-1',
        title: 'Story 2',
        storyText: 'Text 2',
      });

      const stories = await service.getStoriesForUser('user-1');

      expect(stories.length).toBe(2);
      expect(stories[0]).toHaveProperty('id');
      expect(stories[0]).toHaveProperty('userId');
      expect(stories[0]).toHaveProperty('title');
      expect(stories[0]).toHaveProperty('storyText');
      expect(stories[0]).toHaveProperty('createdAt');
      expect(stories[0]).toHaveProperty('updatedAt');
    });

    it('should only return stories for specified user', async () => {
      await service.saveStory({
        userId: 'user-1',
        title: 'Story 1',
        storyText: 'Text 1',
      });
      await service.saveStory({
        userId: 'user-2',
        title: 'Story 2',
        storyText: 'Text 2',
      });

      const stories = await service.getStoriesForUser('user-1');

      expect(stories.length).toBe(1);
      expect(stories[0].userId).toBe('user-1');
    });

    it('should throw error for missing userId', async () => {
      await expect(service.getStoriesForUser('')).rejects.toThrow(
        'User ID is required'
      );
    });
  });

  describe('getStoryById', () => {
    it('should return null for non-existent story', async () => {
      const story = await service.getStoryById('non-existent');

      expect(story).toBeNull();
    });

    it('should return story by id', async () => {
      const storyId = await service.saveStory({
        userId: 'user-1',
        title: 'Test Story',
        storyText: 'Test text',
      });

      const story = await service.getStoryById(storyId);

      expect(story).toBeDefined();
      expect(story?.id).toBe(storyId);
      expect(story?.title).toBe('Test Story');
      expect(story?.storyText).toBe('Test text');
    });

    it('should throw error for missing storyId', async () => {
      await expect(service.getStoryById('')).rejects.toThrow(
        'Story ID is required'
      );
    });
  });

  describe('test utilities', () => {
    it('should clear all stories', async () => {
      await service.saveStory({
        userId: 'user-1',
        title: 'Story 1',
        storyText: 'Text 1',
      });

      service.clear();

      const stories = await service.getStoriesForUser('user-1');
      expect(stories.length).toBe(0);
    });

    it('should seed stories', async () => {
      const mockStories = [
        {
          id: 'story-1',
          userId: 'user-1',
          title: 'Story 1',
          storyText: 'Text 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      service.seed(mockStories);

      const story = await service.getStoryById('story-1');
      expect(story).toBeDefined();
      expect(story?.title).toBe('Story 1');
    });
  });
});
