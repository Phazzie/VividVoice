/**
 * Service Contracts Index
 * Central export point for all service interfaces
 */

export * from './types';
export * from './IStoryService';
export * from './IAudioService';
export * from './ICharacterService';
export * from './IDataService';

// Re-export Story type from IDataService for convenience
export type { Story } from './IDataService';
