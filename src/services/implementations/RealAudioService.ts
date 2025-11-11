/**
 * Real Audio Service Implementation
 * Wraps existing TTS functionality for production use
 */

import type {
  IAudioService,
  AudioResult,
  DialogueSegment,
  Character,
} from '../contracts';

import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';

export class RealAudioService implements IAudioService {
  async generateMultiVoiceAudio(
    segments: DialogueSegment[],
    characters: Character[]
  ): Promise<AudioResult> {
    console.log('RealAudioService: Generating multi-voice audio...');

    if (!segments || segments.length === 0) {
      throw new Error('Segments cannot be empty');
    }

    try {
      const result = await generateMultiVoiceTTS({ segments, characters });

      console.log('RealAudioService: Audio generation successful.');
      return {
        audioDataUri: result.audioDataUri,
        transcript: result.transcript,
      };
    } catch (error) {
      console.error(
        'RealAudioService: Error during generateMultiVoiceAudio:',
        error
      );
      throw new Error('Failed to generate audio.');
    }
  }

  async generateSingleVoiceAudio(
    text: string,
    voiceId: string,
    emotion?: string
  ): Promise<string> {
    console.log('RealAudioService: Generating single voice audio...');

    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      // For single voice, we can use the multi-voice TTS with a single segment
      const mockCharacter: Character = {
        name: 'Speaker',
        description: 'Single speaker',
        voiceId: voiceId,
      };

      const segment: DialogueSegment = {
        character: 'Speaker',
        dialogue: text,
        emotion: emotion || 'neutral',
      };

      const result = await this.generateMultiVoiceAudio(
        [segment],
        [mockCharacter]
      );

      console.log('RealAudioService: Single voice audio generation successful.');
      return result.audioDataUri;
    } catch (error) {
      console.error(
        'RealAudioService: Error during generateSingleVoiceAudio:',
        error
      );
      throw new Error('Failed to generate single voice audio.');
    }
  }
}
