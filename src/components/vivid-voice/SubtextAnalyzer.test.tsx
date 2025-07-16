
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { SubtextAnalyzer } from './SubtextAnalyzer';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('SubtextAnalyzer', () => {
    const storyText = 'Alice: Fine.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockAnalyses = [{
            character: 'Alice',
            dialogue: 'Fine.',
            literalMeaning: 'Everything is okay.',
            subtext: 'Everything is not okay.',
            explanation: 'The context suggests anger.'
        }];
        (actions.analyzeSubtext as vi.Mock).mockResolvedValue(mockAnalyses);

        render(<SubtextAnalyzer storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Analyze for Subtext/i });
        await user.click(analyzeButton);
        
        await waitFor(() => {
            expect(screen.getByText('Alice says:')).toBeInTheDocument();
            expect(screen.getByText(/"Fine."/i)).toBeInTheDocument();
            expect(screen.getByText('Everything is not okay.')).toBeInTheDocument();
        });
    });

     it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Subtext analysis failed';
        (actions.analyzeSubtext as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<SubtextAnalyzer storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Analyze for Subtext/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
