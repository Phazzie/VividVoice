
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ShowDontTell } from './ShowDontTell';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('ShowDontTell', () => {
    const storyText = 'She was angry.';
    const onApply = vi.fn();

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockResponse = {suggestions: [{
            tellingSentence: 'She was angry.',
            showingSuggestion: 'Her knuckles turned white.'
        }]};
        (actions.getShowDontTellSuggestions as vi.Mock).mockResolvedValue(mockResponse);

        render(<ShowDontTell storyText={storyText} onApplySuggestion={onApply} />);

        const analyzeButton = screen.getByRole('button', { name: /Find "Telling" Sentences/i });
        await user.click(analyzeButton);
        
        await waitFor(() => {
            expect(screen.getByText('Original "Telling" Sentence:')).toBeInTheDocument();
            expect(screen.getByText(/"She was angry."/i)).toBeInTheDocument();
            expect(screen.getByText('"Showing" Suggestion:')).toBeInTheDocument();
            expect(screen.getByText('Her knuckles turned white.')).toBeInTheDocument();
        });
    });

     it('should call onApplySuggestion when apply button is clicked', async () => {
        const user = userEvent.setup();
        const mockResponse = {suggestions: [{
            tellingSentence: 'She was angry.',
            showingSuggestion: 'Her knuckles turned white.'
        }]};
        (actions.getShowDontTellSuggestions as vi.Mock).mockResolvedValue(mockResponse);

        render(<ShowDontTell storyText={storyText} onApplySuggestion={onApply} />);
        
        await user.click(screen.getByRole('button', { name: /Find/i }));
        const applyButton = await screen.findByRole('button', { name: /Apply/i });
        await user.click(applyButton);

        expect(onApply).toHaveBeenCalledWith('She was angry.', 'Her knuckles turned white.');
    });

     it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Show, Dont Tell analysis failed';
        (actions.getShowDontTellSuggestions as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<ShowDontTell storyText={storyText} onApplySuggestion={onApply} />);
        
        await user.click(screen.getByRole('button', { name: /Find "Telling" Sentences/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
