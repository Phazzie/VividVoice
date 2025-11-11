/**
 * Audio Service Contract
 * Defines the interface for audio generation operations
 */

import type { DialogueSegment, Character, TranscriptSegment } from './types';

export interface AudioResult {
  audioDataUri: string;
  transcript: TranscriptSegment[];
}

/**
 * Audio generation service interface
 */
export interface IAudioService {
  /**
   * Generate multi-voice audio for a scene
   */
  generateMultiVoiceAudio(
    segments: DialogueSegment[],
    characters: Character[]
  ): Promise<AudioResult>;

  /**
   * Generate single voice audio for a segment
   */
  generateSingleVoiceAudio(
    text: string,
    voiceId: string,
    emotion?: string
  ): Promise<string>;
}
