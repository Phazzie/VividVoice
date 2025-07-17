
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { PacingAnalysis } from './PacingAnalysis';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

// Mock recharts
vi.mock('recharts', async () => {
    const OriginalRecharts = await vi.importActual('recharts');
    return {
        ...OriginalRecharts,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 400 }}>{children}</div>
        ),
    };
});


describe('PacingAnalysis', () => {
    const storyText = 'Narration. Alice: Dialogue.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockAnalysis = { segments: [
            { type: 'Narration', wordCount: 10 },
            { type: 'Dialogue', wordCount: 20 },
        ]};
        (actions.analyzeStoryPacing as vi.Mock).mockResolvedValue(mockAnalysis);

        render(<PacingAnalysis storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Analyze Story Pacing/i });
        await user.click(analyzeButton);

        await waitFor(() => {
            expect(screen.getByText('Pacing Visualization')).toBeInTheDocument();
        });
    });

    it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Pacing analysis failed';
        (actions.analyzeStoryPacing as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<PacingAnalysis storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Analyze Story Pacing/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
