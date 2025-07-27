
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ShowDontTell } from './ShowDontTell';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('ShowDontTell', () => {
    const onApply = vi.fn();

    it('should render suggestions when provided', () => {
        const mockSuggestions = [{
            tellingSentence: 'She was angry.',
            showingSuggestion: 'Her knuckles turned white.'
        }];
        render(<ShowDontTell suggestions={mockSuggestions} onApplySuggestion={onApply} />);

        expect(screen.getByText('Original "Telling" Sentence:')).toBeInTheDocument();
        expect(screen.getByTestId('telling-sentence')).toHaveTextContent("She was angry.");
        expect(screen.getByText('"Showing" Suggestion:')).toBeInTheDocument();
        expect(screen.getByText('Her knuckles turned white.')).toBeInTheDocument();
    });

    it('should call onApplySuggestion when apply button is clicked', async () => {
        const user = userEvent.setup();
        const mockSuggestions = [{
            tellingSentence: 'She was angry.',
            showingSuggestion: 'Her knuckles turned white.'
        }];
        render(<ShowDontTell suggestions={mockSuggestions} onApplySuggestion={onApply} />);

        const applyButton = screen.getByRole('button', { name: /Apply/i });
        await user.click(applyButton);

        expect(onApply).toHaveBeenCalledWith('She was angry.', 'Her knuckles turned white.');
    });

    it('should display a message when no suggestions are provided', () => {
        render(<ShowDontTell suggestions={[]} onApplySuggestion={onApply} />);

        expect(screen.getByText('No "Telling" Sentences Found')).toBeInTheDocument();
    });
});
