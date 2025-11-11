/**
 * Story Service Contract
 * Defines the interface for story parsing and analysis operations
 */

import type {
  DialogueSegment,
  Character,
  LiteraryDevice,
  DialogueDynamics,
  PacingSegment,
  Trope,
  ShowDontTellSuggestion,
  ConsistencyIssue,
  SubtextAnalysis,
} from './types';

export interface ParsedStory {
  segments: DialogueSegment[];
  characters: Character[];
}

export interface StoryAnalysis {
  segments: DialogueSegment[];
  characters: Character[];
  dialogueDynamics: DialogueDynamics;
  literaryDevices: { devices: LiteraryDevice[] };
  pacing: { segments: PacingSegment[] };
  tropes: { tropes: Trope[] };
  showDontTellSuggestions: { suggestions: ShowDontTellSuggestion[] };
  consistencyIssues: { issues: ConsistencyIssue[] };
  subtextAnalyses: { analyses: SubtextAnalysis[] };
  errors: Record<string, string>;
}

/**
 * Core story processing service interface
 */
export interface IStoryService {
  /**
   * Parse raw story text into structured segments and characters
   */
  parseStory(storyText: string): Promise<ParsedStory>;

  /**
   * Perform comprehensive story analysis
   */
  analyzeStory(storyText: string): Promise<StoryAnalysis>;

  /**
   * Analyze emotional tone of a dialogue segment
   */
  analyzeEmotionalTone(
    dialogue: string,
    context: string
  ): Promise<{ emotion: string }>;

  /**
   * Analyze dialogue dynamics
   */
  analyzeDialogueDynamics(storyText: string): Promise<DialogueDynamics>;

  /**
   * Analyze literary devices used in the story
   */
  analyzeLiteraryDevices(
    storyText: string
  ): Promise<{ devices: LiteraryDevice[] }>;

  /**
   * Analyze story pacing
   */
  analyzePacing(storyText: string): Promise<{ segments: PacingSegment[] }>;

  /**
   * Identify and suggest trope inversions
   */
  invertTropes(storyText: string): Promise<{ tropes: Trope[] }>;

  /**
   * Get "show don't tell" suggestions
   */
  getShowDontTellSuggestions(
    storyText: string
  ): Promise<{ suggestions: ShowDontTellSuggestion[] }>;

  /**
   * Find consistency issues in the story
   */
  findInconsistencies(
    storyText: string
  ): Promise<{ issues: ConsistencyIssue[] }>;

  /**
   * Analyze subtext in dialogue
   */
  analyzeSubtext(
    storyText: string
  ): Promise<{ analyses: SubtextAnalysis[] }>;
}
