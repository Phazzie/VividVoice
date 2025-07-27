
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ActorStudio } from './ActorStudio';
import * as actions from '@/lib/actions';
import { MockAuthProvider } from '@/contexts/AuthContext.mock';

// Mock the actions module
vi.mock('@/lib/actions');

describe('ActorStudio', () => {
    const mockCharacters = [
        { name: 'Alice', description: 'A hero, brave and noble.', voiceId: 'v1' },
        { name: 'Bob', description: 'A villain, cunning and sly.', voiceId: 'v2' },
    ];
    it('should allow selecting a character and sending a message', async () => {
        const user = userEvent.setup();
        const characterResponse = 'This is my response as Alice.';
        (actions.getCharacterResponse as vi.Mock).mockResolvedValue(characterResponse);

        render(<ActorStudio characters={mockCharacters} />);

        // Select a character
        const selectTrigger = screen.getByRole('combobox');
        await user.click(selectTrigger);
        const aliceOption = await screen.findByText('Alice');
        await user.click(aliceOption);

        await waitFor(() => {
             expect(screen.getByPlaceholderText(/Ask Alice a question.../i)).toBeInTheDocument();
        });

        // Type and send a message
        const input = screen.getByPlaceholderText(/Ask Alice a question.../i);
        const sendButton = screen.getByRole('button', { name: '' }); // Send icon button
        
        await user.type(input, 'Hello Alice');
        await user.click(sendButton);

        // Verify user message appears
        expect(screen.getByText('Hello Alice')).toBeInTheDocument();
        // Verify loading state appears
        // await waitFor(() => {
        //     expect(screen.getByRole('button', {name: ''})).toBeDisabled();
        // })

        // Verify AI response appears
        await waitFor(() => {
            expect(screen.getByText(characterResponse)).toBeInTheDocument();
        });
        
        expect(actions.getCharacterResponse).toHaveBeenCalledWith(
            mockCharacters[0], // Alice's full character object
            [{ isUser: true, message: 'Hello Alice' }], // History includes user message
            'Hello Alice'
        );
    });
});
