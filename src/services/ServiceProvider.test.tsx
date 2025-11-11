/**
 * Tests for Service Provider
 * Validates dependency injection and service access
 */

import { describe, it, expect } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import {
  ServiceProvider,
  useServices,
  useStoryService,
  useAudioService,
  useCharacterService,
  useDataService,
} from './ServiceProvider';
import { MockStoryService } from './mocks';
import type { IStoryService } from './contracts';

describe('ServiceProvider', () => {
  describe('Provider initialization', () => {
    it('should render children', () => {
      const { container } = render(
        <ServiceProvider>
          <div>Test Content</div>
        </ServiceProvider>
      );

      expect(container.textContent).toContain('Test Content');
    });

    it('should provide real services by default', () => {
      const { result } = renderHook(() => useServices(), {
        wrapper: ({ children }) => (
          <ServiceProvider>{children}</ServiceProvider>
        ),
      });

      expect(result.current.mode).toBe('real');
      expect(result.current.storyService).toBeDefined();
      expect(result.current.audioService).toBeDefined();
      expect(result.current.characterService).toBeDefined();
      expect(result.current.dataService).toBeDefined();
    });

    it('should provide mock services when mode is mock', () => {
      const { result } = renderHook(() => useServices(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      expect(result.current.mode).toBe('mock');
      expect(result.current.storyService).toBeDefined();
    });

    it('should accept custom service implementations', () => {
      const customStoryService = new MockStoryService();

      const { result } = renderHook(() => useServices(), {
        wrapper: ({ children }) => (
          <ServiceProvider customServices={{ storyService: customStoryService }}>
            {children}
          </ServiceProvider>
        ),
      });

      expect(result.current.storyService).toBe(customStoryService);
    });
  });

  describe('Service hooks', () => {
    it('useStoryService should return story service', () => {
      const { result } = renderHook(() => useStoryService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.parseStory).toBeDefined();
      expect(result.current.analyzeStory).toBeDefined();
    });

    it('useAudioService should return audio service', () => {
      const { result } = renderHook(() => useAudioService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.generateMultiVoiceAudio).toBeDefined();
      expect(result.current.generateSingleVoiceAudio).toBeDefined();
    });

    it('useCharacterService should return character service', () => {
      const { result } = renderHook(() => useCharacterService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.generatePortraits).toBeDefined();
      expect(result.current.chatWithCharacter).toBeDefined();
    });

    it('useDataService should return data service', () => {
      const { result } = renderHook(() => useDataService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.saveStory).toBeDefined();
      expect(result.current.getStoriesForUser).toBeDefined();
      expect(result.current.getStoryById).toBeDefined();
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useServices());
      }).toThrow('useServices must be used within a ServiceProvider');
    });
  });

  describe('Service integration', () => {
    it('should allow calling service methods through hooks', async () => {
      const { result } = renderHook(() => useStoryService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      const parsed = await result.current.parseStory('Test story');

      expect(parsed).toBeDefined();
      expect(parsed.segments).toBeInstanceOf(Array);
      expect(parsed.characters).toBeInstanceOf(Array);
    });

    it('should maintain service instance across re-renders', () => {
      const { result, rerender } = renderHook(() => useStoryService(), {
        wrapper: ({ children }) => (
          <ServiceProvider mode="mock">{children}</ServiceProvider>
        ),
      });

      const firstInstance = result.current;
      rerender();
      const secondInstance = result.current;

      expect(firstInstance).toBe(secondInstance);
    });
  });
});
