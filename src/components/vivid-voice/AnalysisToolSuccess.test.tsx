
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import * as actions from '@/lib/actions';

// Import all the components to be tested
import { LiteraryAnalysisTab } from './LiteraryAnalysis';
import { DialogueDynamicsAnalysis } from './DialogueDynamicsAnalysis';
import { TropeInverter } from './TropeInverter';
import { UnreliableNarrator } from './UnreliableNarrator';
import { PacingAnalysis } from './PacingAnalysis';
import { ShowDontTell } from './ShowDontTell';
import { ConsistencyGuardian } from './ConsistencyGuardian';
import { SubtextAnalyzer } from './SubtextAnalyzer';
import { PerspectiveShifter } from './PerspectiveShifter';


// Mock the entire actions module
vi.mock('@/lib/actions');

// Mock recharts for components that use it
vi.mock('recharts', async () => {
    const OriginalRecharts = await vi.importActual('recharts');
    return {
        ...OriginalRecharts,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 300 }}>{children}</div>
        ),
    };
});

describe('Analysis Tools Success Path Handling', () => {
    const storyText = 'A story to analyze.';
    const mockCharacters = [{ name: 'Alice', description: 'A character', voiceId: 'v1' }];
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const testSuccessCase = async (
        TestComponent: React.ComponentType<any>,
        props: any,
        actionToMock: keyof typeof actions,
        buttonName: string,
        mockResponse: any,
        expectedText: string | RegExp
    ) => {
        (actions[actionToMock] as vi.Mock).mockResolvedValue(mockResponse);

        render(<TestComponent {...props} />);
        
        const analyzeButton = screen.getByRole('button', { name: new RegExp(buttonName, 'i') });
        
        // Handle cases where a selection is needed first
        if (props.characters) {
            const charSelect = screen.getByRole('combobox');
            await user.click(charSelect);
            await user.click(await screen.findByText(props.characters[0].name));
        }

        await user.click(analyzeButton);

        await waitFor(() => {
            expect(screen.getByText(expectedText)).toBeInTheDocument();
        });
    };

    it('should show results for LiteraryAnalysisTab', async () => {
        const mockResponse = { devices: [{ device: 'Metaphor', quote: 'is a test', explanation: '...'}]};
        await testSuccessCase(LiteraryAnalysisTab, { storyText }, 'analyzeLiteraryDevices', 'Analyze for Literary Devices', mockResponse, 'Metaphor');
    });

    it('should show results for DialogueDynamicsAnalysis', async () => {
        const mockResponse = { summary: 'This is a summary.', powerBalance: [], pacing: { overallWordsPerTurn: 0, characterPacing: [] }};
        await testSuccessCase(DialogueDynamicsAnalysis, { storyText }, 'analyzeDialogueDynamics', 'Analyze Dialogue Dynamics', mockResponse, 'This is a summary.');
    });
    
    it('should show results for TropeInverter', async () => {
        const mockResponse = { tropes: [{ trope: 'The Mentor', quote: 'a quote', inversionSuggestion: 'the suggestion' }]};
        await testSuccessCase(TropeInverter, { storyText }, 'invertTropes', 'Analyze for Tropes', mockResponse, 'The Mentor');
    });

    it('should show results for UnreliableNarrator', async () => {
        const mockResponse = { biasedStoryText: 'This is the biased story.' };
         await testSuccessCase(UnreliableNarrator, { storyText }, 'getBiasedStory', 'Apply Bias', mockResponse, 'This is the biased story.');
    });

    it('should show results for PacingAnalysis', async () => {
        const mockResponse = { segments: [{ type: 'Dialogue', wordCount: 10 }]};
        await testSuccessCase(PacingAnalysis, { storyText }, 'analyzeStoryPacing', 'Analyze Story Pacing', mockResponse, 'Pacing Visualization');
    });

    it('should show results for ShowDontTell', async () => {
        const mockResponse = { suggestions: [{ tellingSentence: 'a sentence', showingSuggestion: 'a suggestion' }]};
        await testSuccessCase(ShowDontTell, { storyText, onApplySuggestion: vi.fn() }, 'getShowDontTellSuggestions', 'Find "Telling" Sentences', mockResponse, /Original "Telling" Sentence:/i);
    });

    it('should show results for ConsistencyGuardian', async () => {
        const mockResponse = { issues: [{ issue: 'The issue', quote: 'a quote', explanation: 'an explanation' }]};
        await testSuccessCase(ConsistencyGuardian, { storyText }, 'findInconsistencies', 'Check for Inconsistencies', mockResponse, 'The issue');
    });

    it('should show results for SubtextAnalyzer', async () => {
        const mockResponse = { analyses: [{ character: 'Alice', dialogue: 'Fine.', literalMeaning: 'Ok', subtext: 'Not ok', explanation: '...' }]};
        await testSuccessCase(SubtextAnalyzer, { storyText }, 'analyzeSubtext', 'Analyze for Subtext', mockResponse, /Subtext \\(What's Really Meant\\)/i);
    });
    
    it('should show results for PerspectiveShifter', async () => {
        const mockResponse = { character: 'Alice', role: 'Protagonist', summary: 'A new summary'};
        await testSuccessCase(PerspectiveShifter, { storyText, characters: mockCharacters }, 'shiftPerspective', 'Shift Perspective', mockResponse, /The Story According to/i);
    });
});
