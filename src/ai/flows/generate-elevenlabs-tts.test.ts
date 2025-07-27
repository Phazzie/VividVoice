import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateElevenLabsTTS } from './generate-elevenlabs-tts';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

// Mock the ElevenLabsClient
vi.mock('elevenlabs', () => {
    const mockCreate = vi.fn().mockImplementation(() => {
        const readable = new Readable();
        readable.push(Buffer.from('fake-audio-chunk'));
        readable.push(null);
        return readable;
    });
    return {
        ElevenLabsClient: vi.fn(() => ({
            textToSpeech: {
                create: mockCreate,
            },
        })),
    };
});


describe('generateElevenLabsTTS Flow', () => {
    let mockElevenLabsClient: ElevenLabsClient;

    beforeEach(() => {
        vi.clearAllMocks();
        mockElevenLabsClient = new ElevenLabsClient({ apiKey: 'fake-api-key' });
    });

    it('should call the ElevenLabs API with correct parameters and return an audio URL', async () => {
        const input = {
            text: 'Hello, world!',
            voiceId: 'voice_123',
            modelId: 'eleven_multilingual_v2',
            outputFormat: 'mp3_44100_128' as const,
        };

        const result = await generateElevenLabsTTS(input);

        expect(mockElevenLabsClient.textToSpeech.create).toHaveBeenCalledWith({
            text: input.text,
            voice_id: input.voiceId,
            model_id: input.modelId,
            output_format: input.outputFormat,
        });

        // Check if the result is a data URI
        expect(result.audioUrl).toMatch(/^data:audio\/mpeg;base64,/);
    });

    it('should handle API errors gracefully', async () => {
        const input = {
            text: 'This will fail.',
            voiceId: 'voice_456',
        };

        // Make the mock throw an error
        const apiError = new Error('ElevenLabs API Error');
        (mockElevenLabsClient.textToSpeech.create as vi.Mock).mockRejectedValue(apiError);

        await expect(generateElevenLabsTTS(input)).rejects.toThrow('ElevenLabs API Error');
    });

    it('should handle empty readable stream from API', async () => {
        const input = {
            text: 'Empty response',
            voiceId: 'voice_789',
        };

        (mockElevenLabsClient.textToSpeech.create as vi.Mock).mockImplementation(() => {
            const readable = new Readable();
            readable.push(null); // End the stream immediately
            return readable;
        });

        const result = await generateElevenLabsTTS(input);
        expect(result.audioUrl).toBe('data:audio/mpeg;base64,');
    });

    it('should correctly encode multiple audio chunks to base64', async () => {
        const input = {
            text: 'Multiple chunks',
            voiceId: 'voice_abc',
        };
        const chunk1 = Buffer.from('first-chunk');
        const chunk2 = Buffer.from('second-chunk');
        const expectedBase64 = Buffer.concat([chunk1, chunk2]).toString('base64');


        (mockElevenLabsClient.textToSpeech.create as vi.Mock).mockImplementation(() => {
            const readable = new Readable();
            readable.push(chunk1);
            readable.push(chunk2);
            readable.push(null);
            return readable;
        });

        const result = await generateElevenLabsTTS(input);
        expect(result.audioUrl).toBe(`data:audio/mpeg;base64,${expectedBase64}`);
    });
});
