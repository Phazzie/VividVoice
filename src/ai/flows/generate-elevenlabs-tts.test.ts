import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Readable } from 'stream';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Mock the ElevenLabs client at the module level
vi.mock('@elevenlabs/elevenlabs-js', () => ({
  ElevenLabsClient: vi.fn(),
}));

// Helper to re-import the module under test after setting env vars and mocks
const loadModule = async () => {
  const mod = await import('./generate-elevenlabs-tts');
  return mod.generateElevenLabsTTS as typeof import('./generate-elevenlabs-tts').generateElevenLabsTTS;
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

  it('should generate audio data uri from ElevenLabs API', async () => {
    // Arrange
    const chunks = [Buffer.from('foo'), Buffer.from('bar')];
    const stream = Readable.from(chunks);
    const convertMock = vi.fn().mockResolvedValue(stream);
    (ElevenLabsClient as unknown as vi.Mock).mockImplementation(() => ({
      textToSpeech: { convert: convertMock },
    }));
    const generateElevenLabsTTS = await loadModule();

    // Act
    const result = await generateElevenLabsTTS({ text: 'hello', voiceId: 'voice1' });

    // Assert
    expect(convertMock).toHaveBeenCalledWith('voice1', {
      text: 'hello',
      model_id: 'eleven_multilingual_v2',
      output_format: 'mp3_22050_32',
    });
    const expected = 'data:audio/mpeg;base64,' + Buffer.concat(chunks).toString('base64');
    expect(result.audioDataUri).toBe(expected);
  });

  it('should properly handle readable streams', async () => {
    // Arrange
    const chunks = [Buffer.from('chunk1'), Buffer.from('chunk2')];
    const stream = Readable.from(chunks);
    const convertMock = vi.fn().mockResolvedValue(stream);
    (ElevenLabsClient as unknown as vi.Mock).mockImplementation(() => ({
      textToSpeech: { convert: convertMock },
    }));
    const generateElevenLabsTTS = await loadModule();

    // Act
    const result = await generateElevenLabsTTS({ text: 'text', voiceId: 'voice2' });

    // Assert
    const expected = 'data:audio/mpeg;base64,' + Buffer.concat(chunks).toString('base64');
    expect(result.audioDataUri).toBe(expected);
  });

  it('should propagate errors from the API call', async () => {
    // Arrange
    const convertMock = vi.fn().mockRejectedValue(new Error('api fail'));
    (ElevenLabsClient as unknown as vi.Mock).mockImplementation(() => ({
      textToSpeech: { convert: convertMock },
    }));
    const generateElevenLabsTTS = await loadModule();

    // Act & Assert
    await expect(
      generateElevenLabsTTS({ text: 'oops', voiceId: 'voice3' })
    ).rejects.toThrow('Failed to generate audio with ElevenLabs TTS.');
  });
});
