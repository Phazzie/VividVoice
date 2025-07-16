
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import * as actions from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

// Import all the components to be tested
import { LiteraryAnalysisTab } from './LiteraryAnalysis';
import { DialogueDynamicsAnalysis } from './DialogueDynamicsAnalysis';
import { TropeInverter } from './TropeInverter';
import { ActorStudio } from './ActorStudio';
import { UnreliableNarrator } from './UnreliableNarrator';
import { PacingAnalysis } from './PacingAnalysis';
import { ShowDontTell } from './ShowDontTell';
import { ConsistencyGuardian } from './ConsistencyGuardian';
import { SubtextAnalyzer } from './SubtextAnalyzer';
import { PerspectiveShifter } from './PerspectiveShifter';


// Mock the entire actions module
vi.mock('@/lib/actions');
// Mock the useToast hook to spy on its calls
vi.mock('@/hooks/use-toast');

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

describe('Analysis Tools Failure Handling', () => {
    const storyText = 'A story to analyze.';
    const mockCharacters = [{ name: 'Alice', description: 'A character' }];
    const user = userEvent.setup();
    const toastMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useToast as vi.Mock).mockReturnValue({ toast: toastMock });
    });

    const testFailureCase = async (
        TestComponent: React.ComponentType<any>,
        props: any,
        actionToMock: keyof typeof actions,
        buttonName: string,
        errorMessage: string
    ) => {
        (actions[actionToMock] as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<TestComponent {...props} />);
        
        const analyzeButton = screen.getByRole('button', { name: new RegExp(buttonName, 'i') });
        await user.click(analyzeButton);

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                variant: "destructive",
                title: expect.any(String),
                description: errorMessage,
            });
        });
    };

    it('should show a toast on failure for LiteraryAnalysisTab', async () => {
        await testFailureCase(LiteraryAnalysisTab, { storyText }, 'analyzeLiteraryDevices', 'Analyze for Literary Devices', 'Literary analysis failed.');
    });

    it('should show a toast on failure for DialogueDynamicsAnalysis', async () => {
        await testFailureCase(DialogueDynamicsAnalysis, { storyText }, 'analyzeDialogueDynamics', 'Analyze Dialogue Dynamics', 'Dialogue dynamics analysis failed.');
    });
    
    it('should show a toast on failure for TropeInverter', async () => {
        await testFailureCase(TropeInverter, { storyText }, 'invertTropes', 'Analyze for Tropes', 'Trope analysis failed.');
    });

    it('should show a toast on failure for ActorStudio', async () => {
        const errorMessage = 'Character chat failed.';
        (actions.getCharacterResponse as vi.Mock).mockRejectedValue(new Error(errorMessage));
        
        render(<ActorStudio characters={mockCharacters} storyText={storyText} />);
        
        // Select character to enable form
        await user.click(screen.getByRole('combobox'));
        await user.click(await screen.findByText('Alice'));

        // Send message
        await user.type(screen.getByPlaceholderText(/Ask Alice a question/i), 'Hello');
        await user.click(screen.getByRole('button', {name: ''})); // Send button

         await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                variant: "destructive",
                title: "Chat Error",
                description: errorMessage,
            });
        });
    });

    it('should show a toast on failure for UnreliableNarrator', async () => {
         await testFailureCase(UnreliableNarrator, { storyText }, 'getBiasedStory', 'Apply Bias', 'Bias generation failed.');
    });

    it('should show a toast on failure for PacingAnalysis', async () => {
        await testFailureCase(PacingAnalysis, { storyText }, 'analyzeStoryPacing', 'Analyze Story Pacing', 'Pacing analysis failed.');
    });

    it('should show a toast on failure for ShowDontTell', async () => {
        await testFailureCase(ShowDontTell, { storyText }, 'getShowDontTellSuggestions', 'Find "Telling" Sentences', 'Show, dont tell analysis failed.');
    });

    it('should show a toast on failure for ConsistencyGuardian', async () => {
        await testFailureCase(ConsistencyGuardian, { storyText }, 'findInconsistencies', 'Check for Inconsistencies', 'Consistency analysis failed.');
    });

    it('should show a toast on failure for SubtextAnalyzer', async () => {
        await testFailureCase(SubtextAnalyzer, { storyText }, 'analyzeSubtext', 'Analyze for Subtext', 'Subtext analysis failed.');
    });
    
    it('should show a toast on failure for PerspectiveShifter', async () => {
        const errorMessage = 'Perspective shift failed.';
         (actions.shiftPerspective as vi.Mock).mockRejectedValue(new Error(errorMessage));
        
        render(<PerspectiveShifter characters={mockCharacters} storyText={storyText} />);
        
        // Select character to enable form
        await user.click(screen.getByRole('combobox'));
        await user.click(await screen.findByText('Alice'));

        await user.click(screen.getByRole('button', { name: /Shift Perspective/i }));

         await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                variant: "destructive",
                title: "Analysis Error",
                description: errorMessage,
            });
        });
    });
});
