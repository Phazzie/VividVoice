
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { UnreliableNarrator } from './UnreliableNarrator';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('UnreliableNarrator', () => {
    const storyText = 'The hero saved the day.';

    it('should allow selecting a bias and generating a biased story', async () => {
        const user = userEvent.setup();
        const biasedText = 'The so-called "hero" luckily stumbled into success.';
        (actions.getBiasedStory as vi.Mock).mockResolvedValue(biasedText);

        render(<UnreliableNarrator storyText={storyText} />);

        // Check initial state
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue(storyText);

        // Select a bias
        const selectTrigger = screen.getByRole('combobox');
        await user.click(selectTrigger);
        const biasOption = await screen.findByText('Jealous of Main Character');
        await user.click(biasOption);

        // Click generate
        const generateButton = screen.getByRole('button', { name: /Apply Bias/i });
        await user.click(generateButton);

        // Check loading state
        expect(generateButton).toBeDisabled();

        // Check for new text
        await waitFor(() => {
            expect(textarea).toHaveValue(biasedText);
        });

        expect(actions.getBiasedStory).toHaveBeenCalledWith(storyText, 'Jealous of Main Character');
    });
});
