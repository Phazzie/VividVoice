
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ConsistencyGuardian } from './ConsistencyGuardian';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('ConsistencyGuardian', () => {
    const storyText = 'Her eyes were blue. Later, her eyes were brown.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockIssues = [{
            issue: 'Character eye color changed',
            quote: 'Her eyes were blue. ... her eyes were brown.',
            explanation: 'The character\'s eye color changes without explanation.'
        }];
        (actions.findInconsistencies as vi.Mock).mockResolvedValue(mockIssues);

        render(<ConsistencyGuardian storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Check for Inconsistencies/i });
        await user.click(analyzeButton);
        
        await waitFor(() => {
            expect(screen.getByText('Character eye color changed')).toBeInTheDocument();
            expect(screen.getByText(/"Her eyes were blue. ... her eyes were brown."/i)).toBeInTheDocument();
            expect(screen.getByText('The character\'s eye color changes without explanation.')).toBeInTheDocument();
        });
    });

     it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Consistency analysis failed';
        (actions.findInconsistencies as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<ConsistencyGuardian storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Check for Inconsistencies/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
