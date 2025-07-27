
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { PerspectiveShifter } from './PerspectiveShifter';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('PerspectiveShifter', () => {
    const storyText = 'The hero saved the day.';
    const mockCharacters = [
        { name: 'Alice', description: 'The hero' },
        { name: 'Bob', description: 'The villain' },
    ];

    it('should allow selecting a character and role, and generating a new perspective', async () => {
        const user = userEvent.setup();
        const mockResult = {
            character: 'Bob',
            role: 'Protagonist',
            summary: 'I, Bob, was simply trying to achieve my goals when the so-called hero interfered.'
        };
        (actions.shiftPerspective as vi.Mock).mockResolvedValue(mockResult);

        render(<PerspectiveShifter characters={mockCharacters} storyText={storyText} />);

        // Select a character
        const charSelect = screen.getByRole('combobox');
        await user.click(charSelect);
        await user.click(await screen.findByText('Bob'));
        
        // Select a role (Antagonist is the second radio button)
        const antagonistRadio = screen.getByLabelText('As Antagonist');
        await user.click(antagonistRadio);

        // Click generate
        const generateButton = screen.getByRole('button', { name: /Shift Perspective/i });
        await user.click(generateButton);

        // Check for new text
        await waitFor(() => {
            expect(screen.getByText(/The Story According to/i)).toBeInTheDocument();
            expect(screen.getByText(mockResult.summary)).toBeInTheDocument();
        }, { timeout: 5000 });

        expect(actions.shiftPerspective).toHaveBeenCalledWith(storyText, 'Bob', 'Antagonist');
    });
});
