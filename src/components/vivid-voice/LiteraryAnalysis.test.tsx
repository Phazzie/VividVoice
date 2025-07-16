
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { LiteraryAnalysisTab } from './LiteraryAnalysis';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('LiteraryAnalysisTab', () => {
    const storyText = 'The sun was a golden eye in the sky.';

    it('should render the button and handle successful analysis', async () => {
        const user = userEvent.setup();
        const mockDevices = [{
            device: 'Metaphor',
            quote: 'The sun was a golden eye',
            explanation: 'The sun is compared to an eye.'
        }];
        (actions.analyzeLiteraryDevices as vi.Mock).mockResolvedValue(mockDevices);

        render(<LiteraryAnalysisTab storyText={storyText} />);

        const analyzeButton = screen.getByRole('button', { name: /Analyze for Literary Devices/i });
        expect(analyzeButton).toBeInTheDocument();

        await user.click(analyzeButton);

        // Check for loading state
        expect(screen.getByText(/Analyze for Literary Devices/i)).toBeDisabled();

        // Check for results
        await waitFor(() => {
            expect(screen.getByText('Metaphor')).toBeInTheDocument();
            expect(screen.getByText(/"The sun was a golden eye"/i)).toBeInTheDocument();
        });
    });

    it('should display a message when no devices are found', async () => {
        const user = userEvent.setup();
        (actions.analyzeLiteraryDevices as vi.Mock).mockResolvedValue([]);
         // Mock useToast to spy on it
        const toastMock = vi.fn();
        vi.spyOn(await import('@/hooks/use-toast'), 'useToast').mockReturnValue({ toast: toastMock } as any);

        render(<LiteraryAnalysisTab storyText={storyText} />);

        await user.click(screen.getByRole('button', { name: /Analyze for Literary Devices/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: "Analysis Complete",
                description: "No specific literary devices were identified in the text."
            });
        });
    });

    it('should display an error alert if analysis fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'AI analysis failed';
        (actions.analyzeLiteraryDevices as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<LiteraryAnalysisTab storyText={storyText} />);
        
        await user.click(screen.getByRole('button', { name: /Analyze for Literary Devices/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
