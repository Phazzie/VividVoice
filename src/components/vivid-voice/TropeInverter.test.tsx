
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { TropeInverter } from './TropeInverter';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('TropeInverter', () => {
    const storyText = 'He was the chosen one.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockTropes = [{
            trope: 'The Chosen One',
            quote: 'He was the chosen one.',
            inversionSuggestion: 'Turns out, he was chosen by the villains.'
        }];
        (actions.invertTropes as vi.Mock).mockResolvedValue(mockTropes);

        render(<TropeInverter storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Analyze for Tropes to Invert/i });
        await user.click(analyzeButton);

        // Check for loading state
        expect(screen.getByText(/Analyze for Tropes to Invert/i)).toBeDisabled();

        // Check for results
        await waitFor(() => {
            expect(screen.getByText('The Chosen One')).toBeInTheDocument();
            expect(screen.getByText('Inversion Suggestion:')).toBeInTheDocument();
            expect(screen.getByText('Turns out, he was chosen by the villains.')).toBeInTheDocument();
        });
    });

    it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Trope analysis failed';
        (actions.invertTropes as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<TropeInverter storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Analyze for Tropes to Invert/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
