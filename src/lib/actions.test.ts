
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    parseStory,
    getParsedStory,
    getCharacterPortraits,
    generateMultiVoiceSceneAudio,
    analyzeDialogueDynamics,
    type DialogueSegment,
    type Character,
} from './actions';

// Mock the AI flows to isolate the actions
vi.mock('@/ai/flows/parse-dialogue', () => ({
    parseDialogue: vi.fn(),
}));
vi.mock('@/ai/flows/generate-character-portraits', () => ({
    generateCharacterPortraits: vi.fn(),
}));
vi.mock('@/ai/flows/generate-multi-voice-tts', () => ({
    generateMultiVoiceTTS: vi.fn(),
}));
vi.mock('@/ai/flows/analyze-dialogue-dynamics', () => ({
    analyzeDialogueDynamics: vi.fn(),
}));

// We need to import the mocked flows *after* the vi.mock call
import { parseDialogue as parseDialogueFlow } from '@/ai/flows/parse-dialogue';
import { generateCharacterPortraits as generateCharacterPortraitsFlow } from '@/ai/flows/generate-character-portraits';
import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';


describe('Server Actions Tests', () => {

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    // Test for: `parseStory` action (Rank 5 & 6)
    describe('parseStory', () => {
        it('should call parsing and portrait generation and return combined results', async () => {
            const storyText = 'Alice says hello.';
            const mockParsed = {
                segments: [{ character: 'Alice', dialogue: 'hello', emotion: 'Happy' }],
                characters: [{ name: 'Alice', description: 'A character', voiceId: 'v1' }],
            };
            const mockPortraits = [{ name: 'Alice', portraitDataUri: 'uri' }];

            (parseDialogueFlow as vi.Mock).mockResolvedValue(mockParsed);
            (generateCharacterPortraitsFlow as vi.Mock).mockResolvedValue(mockPortraits);

            const result = await parseStory(storyText);

            expect(parseDialogueFlow).toHaveBeenCalledWith({ storyText });
            expect(generateCharacterPortraitsFlow).toHaveBeenCalledWith({ characters: mockParsed.characters });
            
            expect(result).toEqual({
                segments: mockParsed.segments,
                characters: mockParsed.characters,
                portraits: mockPortraits,
            });
        });

        it('should throw an error if story text is empty', async () => {
            const storyText = '  ';
            await expect(parseStory(storyText)).rejects.toThrow('Validation Error: Story text cannot be empty.');
        });

        it('should throw a generic error if the parsing flow fails', async () => {
            const storyText = 'A valid story.';
            (parseDialogueFlow as vi.Mock).mockRejectedValue(new Error('AI failed'));

            await expect(parseStory(storyText)).rejects.toThrow('Failed to process the story.');
        });
    });

    // Test for: `generateMultiVoiceSceneAudio` action (Rank 6)
    describe('generateMultiVoiceSceneAudio', () => {
        it('should call the TTS flow with the correct segments and characters', async () => {
            const segments: DialogueSegment[] = [{ character: 'Bob', dialogue: 'Hi', emotion: 'Neutral' }];
            const characters: Character[] = [{ name: 'Bob', description: 'A guy', voiceId: 'v2' }];
            const mockTtsResult = { audioDataUri: 'wav-data', transcript: [] };
            (generateMultiVoiceTTS as vi.Mock).mockResolvedValue(mockTtsResult);

            const result = await generateMultiVoiceSceneAudio(segments, characters);

            expect(generateMultiVoiceTTS).toHaveBeenCalledWith({ segments, characters });
            expect(result).toEqual(mockTtsResult);
        });

        it('should throw an error if segments are empty', async () => {
            await expect(generateMultiVoiceSceneAudio([], [])).rejects.toThrow('Validation Error: Segments for audio generation cannot be empty.');
        });
    });
    
    // Test for: `analyzeDialogueDynamics` action (Rank 7)
    describe('analyzeDialogueDynamics', () => {
        it('should call the analysis flow and return the result', async () => {
            const storyText = "Let's talk.";
            const mockAnalysis = {
                powerBalance: [],
                pacing: { overallWordsPerTurn: 0, characterPacing: [] },
                summary: 'A summary'
            };
            (analyzeDialogueDynamicsFlow as vi.Mock).mockResolvedValue(mockAnalysis);

            const result = await analyzeDialogueDynamics(storyText);

            expect(analyzeDialogueDynamicsFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockAnalysis);
        });

         it('should throw an error if the analysis flow fails', async () => {
            const storyText = "Let's talk.";
            (analyzeDialogueDynamicsFlow as vi.Mock).mockRejectedValue(new Error('AI failed'));

            await expect(analyzeDialogueDynamics(storyText)).rejects.toThrow('Failed to analyze dialogue dynamics.');
        });
    });
});
