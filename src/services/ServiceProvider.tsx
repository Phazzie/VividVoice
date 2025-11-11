/**
 * Service Provider for Dependency Injection
 * Provides centralized service management with mock/real switching
 */

'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type {
  IStoryService,
  IAudioService,
  ICharacterService,
  IDataService,
} from './contracts';

import {
  MockStoryService,
  MockAudioService,
  MockCharacterService,
  MockDataService,
} from './mocks';

import {
  RealStoryService,
  RealAudioService,
  RealCharacterService,
  RealDataService,
} from './implementations';

export type ServiceMode = 'mock' | 'real';

interface Services {
  storyService: IStoryService;
  audioService: IAudioService;
  characterService: ICharacterService;
  dataService: IDataService;
}

interface ServiceContextValue extends Services {
  mode: ServiceMode;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
  mode?: ServiceMode;
  /**
   * Optional custom service implementations for testing
   */
  customServices?: Partial<Services>;
}

/**
 * Service Provider Component
 * Wraps the application to provide services via context
 */
export function ServiceProvider({
  children,
  mode = 'real',
  customServices,
}: ServiceProviderProps) {
  const services = useMemo<ServiceContextValue>(() => {
    // Allow custom services to override defaults (useful for testing)
    if (customServices) {
      return {
        mode,
        storyService:
          customServices.storyService ||
          (mode === 'mock' ? new MockStoryService() : new RealStoryService()),
        audioService:
          customServices.audioService ||
          (mode === 'mock' ? new MockAudioService() : new RealAudioService()),
        characterService:
          customServices.characterService ||
          (mode === 'mock'
            ? new MockCharacterService()
            : new RealCharacterService()),
        dataService:
          customServices.dataService ||
          (mode === 'mock' ? new MockDataService() : new RealDataService()),
      };
    }

    // Default: create services based on mode
    if (mode === 'mock') {
      return {
        mode,
        storyService: new MockStoryService(),
        audioService: new MockAudioService(),
        characterService: new MockCharacterService(),
        dataService: new MockDataService(),
      };
    }

    return {
      mode,
      storyService: new RealStoryService(),
      audioService: new RealAudioService(),
      characterService: new RealCharacterService(),
      dataService: new RealDataService(),
    };
  }, [mode, customServices]);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * Hook to access all services
 */
export function useServices(): ServiceContextValue {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}

/**
 * Hook to access story service
 */
export function useStoryService(): IStoryService {
  const { storyService } = useServices();
  return storyService;
}

/**
 * Hook to access audio service
 */
export function useAudioService(): IAudioService {
  const { audioService } = useServices();
  return audioService;
}

/**
 * Hook to access character service
 */
export function useCharacterService(): ICharacterService {
  const { characterService } = useServices();
  return characterService;
}

/**
 * Hook to access data service
 */
export function useDataService(): IDataService {
  const { dataService } = useServices();
  return dataService;
}
