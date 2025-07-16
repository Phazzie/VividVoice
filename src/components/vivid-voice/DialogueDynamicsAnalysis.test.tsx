
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { DialogueDynamicsAnalysis } from './DialogueDynamicsAnalysis';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

// Mock recharts
vi.mock('recharts', async () => {
    const OriginalRecharts = await vi.importActual('recharts');
    return {
        ...OriginalRecharts,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 300 }}>{children}</div>
        ),
    };
});


describe('DialogueDynamicsAnalysis', () => {
    const storyText = 'Alice: Hello! Bob: Hi there.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockAnalysis = {
            summary: 'A balanced conversation.',
            powerBalance: [{
                character: 'Alice',
                metrics: { dialogueTurns: 1, wordCount: 1, questionsAsked: 0, assertionsMade: 1 }
            }],
            pacing: {
                overallWordsPerTurn: 1.5,
                characterPacing: [{ character: 'Alice', wordsPerTurn: 1 }]
            }
        };
        (actions.analyzeDialogueDynamics as vi.Mock).mockResolvedValue(mockAnalysis);

        render(<DialogueDynamicsAnalysis storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Analyze Dialogue Dynamics/i });
        await user.click(analyzeButton);

        await waitFor(() => {
            expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
            expect(screen.getByText('A balanced conversation.')).toBeInTheDocument();
            expect(screen.getByText('Power Balance')).toBeInTheDocument();
            expect(screen.getByText('Pacing')).toBeInTheDocument();
        });
    });

    it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'AI analysis failed';
        (actions.analyzeDialogueDynamics as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<DialogueDynamicsAnalysis storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Analyze Dialogue Dynamics/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
