import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Mock the ElevenLabs client at the module level
vi.mock('@elevenlabs/elevenlabs-js', () => {
  const mockTextToSpeech = {
    convert: vi.fn()
  };
  
  const MockElevenLabsClient = vi.fn().mockImplementation(() => ({
    textToSpeech: mockTextToSpeech
  }));
  
  return {
    ElevenLabsClient: MockElevenLabsClient,
  };
});

// Helper to re-import the module under test after setting env vars and mocks
const loadModule = async () => {
  const mod = await import('../src/ai/flows/generate-elevenlabs-tts');
  return mod.generateElevenLabsTTS as typeof import('../src/ai/flows/generate-elevenlabs-tts').generateElevenLabsTTS;
};

describe('generateElevenLabsTTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.ELEVENLABS_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.ELEVENLABS_API_KEY;
  });

  it('should return audio data uri when API key is present', async () => {
    // Mock successful audio stream with proper ReadableStream
    const mockAudioData = new Uint8Array([1, 2, 3, 4]);
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(mockAudioData);
        controller.close();
      }
    });

    const convertMock = vi.fn().mockResolvedValue(mockStream);
    (ElevenLabsClient as unknown as vi.Mock).mockImplementation(() => ({
      textToSpeech: { convert: convertMock },
    }));
    
    const generateElevenLabsTTS = await loadModule();

    const result = await generateElevenLabsTTS({ text: 'hello', voiceId: 'voice1' });

    expect(result.audioDataUri).toMatch(/^data:audio\/mpeg;base64,/);
    expect(convertMock).toHaveBeenCalledWith(
      'voice1',
      {
        text: 'hello',
      }
    );
  });

  it('should handle missing API key gracefully', async () => {
    delete process.env.ELEVENLABS_API_KEY;
    const generateElevenLabsTTS = await loadModule();

    await expect(
      generateElevenLabsTTS({ text: 'test', voiceId: 'voice1' })
    ).rejects.toThrow('ElevenLabs API key not configured');
  });

  it('should handle API errors properly', async () => {
    const convertMock = vi.fn().mockRejectedValue(new Error('API Error'));
    (ElevenLabsClient as unknown as vi.Mock).mockImplementation(() => ({
      textToSpeech: { convert: convertMock },
    }));
    
    const generateElevenLabsTTS = await loadModule();

    await expect(
      generateElevenLabsTTS({ text: 'test', voiceId: 'voice1' })
    ).rejects.toThrow('Failed to generate TTS audio');
  });
});