/**
 * Mock Audio Service Implementation
 * Used for testing and development
 */

import type {
  IAudioService,
  AudioResult,
  DialogueSegment,
  Character,
} from '../contracts';

export class MockAudioService implements IAudioService {
  async generateMultiVoiceAudio(
    segments: DialogueSegment[],
    characters: Character[]
  ): Promise<AudioResult> {
    if (!segments || segments.length === 0) {
      throw new Error('Segments cannot be empty');
    }

    // Generate mock audio data URI (1 second of silence)
    const mockAudioDataUri =
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQAAAAA=';

    // Generate mock transcript
    const transcript = segments.map((segment, index) => ({
      character: segment.character,
      text: segment.dialogue,
      startTime: index * 2,
      endTime: (index + 1) * 2,
      words: segment.dialogue.split(' ').map((word, wordIndex) => ({
        word,
        startTime: index * 2 + wordIndex * 0.5,
        endTime: index * 2 + (wordIndex + 1) * 0.5,
      })),
    }));

    return {
      audioDataUri: mockAudioDataUri,
      transcript,
    };
  }

  async generateSingleVoiceAudio(
    text: string,
    voiceId: string,
    emotion?: string
  ): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    // Return mock audio data URI
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQAAAAA=';
  }
}
