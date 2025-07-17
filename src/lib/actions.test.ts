
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getParsedStory,
    getCharacterPortraits,
    generateMultiVoiceSceneAudio,
    analyzeLiteraryDevices,
    analyzeDialogueDynamics,
    invertTropes,
    getCharacterResponse,
    getBiasedStory,
    analyzeStoryPacing,
    getShowDontTellSuggestions,
    findInconsistencies,
    analyzeSubtext,
    shiftPerspective,
    getSoundDesign,
    type DialogueSegment,
    type Character,
} from './actions';

// Mock the AI flows to isolate the actions
vi.mock('@/ai/flows/parse-dialogue', () => ({ parseDialogue: vi.fn() }));
vi.mock('@/ai/flows/generate-character-portraits', () => ({ generateCharacterPortraits: vi.fn() }));
vi.mock('@/ai/flows/generate-multi-voice-tts', () => ({ generateMultiVoiceTTS: vi.fn() }));
vi.mock('@/ai/flows/analyze-literary-devices', () => ({ analyzeLiteraryDevices: vi.fn() }));
vi.mock('@/ai/flows/analyze-dialogue-dynamics', () => ({ analyzeDialogueDynamics: vi.fn() }));
vi.mock('@/ai/flows/trope-inverter', () => ({ invertTropes: vi.fn() }));
vi.mock('@/ai/flows/character-chat', () => ({ characterChat: vi.fn() }));
vi.mock('@/ai/flows/unreliable-narrator', () => ({ applyNarratorBias: vi.fn() }));
vi.mock('@/ai/flows/analyze-pacing', () => ({ analyzePacing: vi.fn() }));
vi.mock('@/ai/flows/show-dont-tell', () => ({ getShowDontTellSuggestions: vi.fn() }));
vi.mock('@/ai/flows/consistency-guardian', () => ({ findInconsistencies: vi.fn() }));
vi.mock('@/ai/flows/analyze-subtext', () => ({ analyzeSubtext: vi.fn() }));
vi.mock('@/ai/flows/shift-perspective', () => ({ shiftPerspective: vi.fn() }));
vi.mock('@/ai/flows/generate-sound-design', () => ({ generateSoundDesign: vi.fn() }));


// We need to import the mocked flows *after* the vi.mock call
import { parseDialogue as parseDialogueFlow } from '@/ai/flows/parse-dialogue';
import { generateCharacterPortraits as generateCharacterPortraitsFlow } from '@/ai/flows/generate-character-portraits';
import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';
import { invertTropes as invertTropesFlow } from '@/ai/flows/trope-inverter';
import { characterChat as characterChatFlow } from '@/ai/flows/character-chat';
import { applyNarratorBias as applyNarratorBiasFlow } from '@/ai/flows/unreliable-narrator';
import { analyzePacing as analyzePacingFlow } from '@/ai/flows/analyze-pacing';
import { getShowDontTellSuggestions as getShowDontTellSuggestionsFlow } from '@/ai/flows/show-dont-tell';
import { findInconsistencies as findInconsistenciesFlow } from '@/ai/flows/consistency-guardian';
import { analyzeSubtext as analyzeSubtextFlow } from '@/ai/flows/analyze-subtext';
import { shiftPerspective as shiftPerspectiveFlow } from '@/ai/flows/shift-perspective';
import { generateSoundDesign as generateSoundDesignFlow } from '@/ai/flows/generate-sound-design';


describe('Server Actions Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Test for: `getParsedStory` action
    describe('getParsedStory', () => {
        it('should call the parsing flow and return results', async () => {
            const storyText = 'Alice says hello.';
            const mockParsed = {
                segments: [{ character: 'Alice', dialogue: 'hello', emotion: 'Happy' }],
                characters: [{ name: 'Alice', description: 'A character', voiceId: 'v1' }],
            };
            (parseDialogueFlow as vi.Mock).mockResolvedValue(mockParsed);

            const result = await getParsedStory(storyText);

            expect(parseDialogueFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockParsed);
        });

        it('should throw an error if story text is empty', async () => {
            const storyText = '  ';
            await expect(getParsedStory(storyText)).rejects.toThrow('Validation Error: Story text cannot be empty.');
        });

        it('should throw a generic error if the parsing flow fails', async () => {
            const storyText = 'A valid story.';
            (parseDialogueFlow as vi.Mock).mockRejectedValue(new Error('AI failed'));

            await expect(getParsedStory(storyText)).rejects.toThrow('Failed to process the story.');
        });
    });

    // Test for: `getCharacterPortraits` action
    describe('getCharacterPortraits', () => {
        it('should call the portrait generation flow and return results', async () => {
            const mockCharacters: Character[] = [{ name: 'Alice', description: 'A character', voiceId: 'v1' }];
            const mockPortraits = [{ name: 'Alice', portraitDataUri: 'uri' }];
            (generateCharacterPortraitsFlow as vi.Mock).mockResolvedValue(mockPortraits);

            const result = await getCharacterPortraits(mockCharacters);

            expect(generateCharacterPortraitsFlow).toHaveBeenCalledWith({ characters: mockCharacters });
            expect(result).toEqual(mockPortraits);
        });

        it('should return an empty array without throwing if the flow fails', async () => {
            const mockCharacters: Character[] = [{ name: 'Alice', description: 'A character', voiceId: 'v1' }];
            (generateCharacterPortraitsFlow as vi.Mock).mockRejectedValue(new Error('Image generation failed'));

            const result = await getCharacterPortraits(mockCharacters);
            expect(result).toEqual([]);
        });
    });


    // Test for: `generateMultiVoiceSceneAudio` action
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
    
    // Test for: `analyzeDialogueDynamics` action
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

    // Test for: `analyzeLiteraryDevices` action
    describe('analyzeLiteraryDevices', () => {
        it('should call the literary devices flow and return its result', async () => {
            const storyText = "The moon was a pearl.";
            const mockResult = { devices: [{ device: 'Metaphor', quote: '...', explanation: '...' }] };
            (analyzeLiteraryDevicesFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await analyzeLiteraryDevices(storyText);

            expect(analyzeLiteraryDevicesFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `invertTropes` action
    describe('invertTropes', () => {
        it('should call the trope inverter flow and return its result', async () => {
            const storyText = "He is the chosen one.";
            const mockResult = { tropes: [{ trope: 'The Chosen One', quote: '...', inversionSuggestion: '...' }] };
            (invertTropesFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await invertTropes(storyText);

            expect(invertTropesFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `getCharacterResponse` action
    describe('getCharacterResponse', () => {
        it('should call the character chat flow and return its result', async () => {
            const mockInput = {
                character: { name: 'Alice', description: 'desc', voiceId: 'v1' },
                history: [],
                userMessage: 'hello'
            };
            const mockResult = { response: 'Hello back!' };
            (characterChatFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await getCharacterResponse(mockInput.character, mockInput.history, mockInput.userMessage);

            expect(characterChatFlow).toHaveBeenCalledWith(mockInput);
            expect(result).toEqual(mockResult.response);
        });
    });
    
    // Test for: `getBiasedStory` action
    describe('getBiasedStory', () => {
        it('should call the unreliable narrator flow and return its result', async () => {
            const storyText = "Original story.";
            const bias = "Jealous of Main Character";
            const mockResult = { biasedStoryText: 'Biased story.' };
            (applyNarratorBiasFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await getBiasedStory(storyText, bias);

            expect(applyNarratorBiasFlow).toHaveBeenCalledWith({ storyText, bias });
            expect(result).toEqual(mockResult.biasedStoryText);
        });
    });

    // Test for: `analyzeStoryPacing` action
    describe('analyzeStoryPacing', () => {
        it('should call the analyze pacing flow and return its result', async () => {
            const storyText = "Pacing test.";
            const mockResult = { segments: [{ type: 'Narration', wordCount: 10 }] };
            (analyzePacingFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await analyzeStoryPacing(storyText);

            expect(analyzePacingFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `getShowDontTellSuggestions` action
    describe('getShowDontTellSuggestions', () => {
        it('should call the show dont tell flow and return its result', async () => {
            const storyText = "She was sad.";
            const mockResult = { suggestions: [{ tellingSentence: '...', showingSuggestion: '...' }] };
            (getShowDontTellSuggestionsFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await getShowDontTellSuggestions(storyText);

            expect(getShowDontTellSuggestionsFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `findInconsistencies` action
    describe('findInconsistencies', () => {
        it('should call the consistency guardian flow and return its result', async () => {
            const storyText = "Blue eyes. Brown eyes.";
            const mockResult = { issues: [{ issue: '...', quote: '...', explanation: '...' }] };
            (findInconsistenciesFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await findInconsistencies(storyText);

            expect(findInconsistenciesFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `analyzeSubtext` action
    describe('analyzeSubtext', () => {
        it('should call the subtext analyzer flow and return its result', async () => {
            const storyText = "He said 'Fine.'";
            const mockResult = { analyses: [{ dialogue: '...', subtext: '...', explanation: '...' }] };
            (analyzeSubtextFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await analyzeSubtext(storyText);

            expect(analyzeSubtextFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `shiftPerspective` action
    describe('shiftPerspective', () => {
        it('should call the perspective shifter flow and return its result', async () => {
            const storyText = "The hero won.";
            const characterName = 'Villain';
            const role = 'Protagonist';
            const mockResult = { character: 'Villain', role: 'Protagonist', summary: '...' };
            (shiftPerspectiveFlow as vi.Mock).mockResolvedValue(mockResult);

            const result = await shiftPerspective(storyText, characterName, role);

            expect(shiftPerspectiveFlow).toHaveBeenCalledWith({ storyText, characterName, role });
            expect(result).toEqual(mockResult);
        });
    });

    // Test for: `getSoundDesign` action
    describe('getSoundDesign', () => {
        it('should call the sound design flow and return a result with placeholder URLs', async () => {
            const storyText = "A door creaked.";
            const mockResult = { soundEffects: [{ segmentIndex: 0, description: '...', soundQuery: 'door creak' }] };
            (generateSoundDesignFlow as vi.Mock).mockResolvedValue(mockResult);
            const placeholderSoundUrl = 'https://actions.google.com/sounds/v1/doors/creaking_door_opening.ogg';

            const result = await getSoundDesign(storyText);

            expect(generateSoundDesignFlow).toHaveBeenCalledWith({ storyText });
            expect(result).toEqual([{ ...mockResult.soundEffects[0], soundUrl: placeholderSoundUrl }]);
        });
    });
});
