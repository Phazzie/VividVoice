
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
    it('should render the analysis results when analysis data is provided', () => {
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
        render(<DialogueDynamicsAnalysis analysis={mockAnalysis} />);

        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
        expect(screen.getByText('A balanced conversation.')).toBeInTheDocument();
        expect(screen.getByText('Power Balance')).toBeInTheDocument();
        expect(screen.getByText('Pacing')).toBeInTheDocument();
    });

    it('should display a message when no analysis data is provided', () => {
        render(<DialogueDynamicsAnalysis analysis={null} />);

        expect(screen.getByText('Analysis Not Available')).toBeInTheDocument();
    });
});
