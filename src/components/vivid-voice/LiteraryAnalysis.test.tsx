
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { LiteraryAnalysisTab } from './LiteraryAnalysis';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('LiteraryAnalysisTab', () => {
    it('should render the analysis results when devices are provided', () => {
        const mockDevices = [{
            device: 'Metaphor',
            quote: 'The sun was a golden eye',
            explanation: 'The sun is compared to an eye.'
        }];
        render(<LiteraryAnalysisTab devices={mockDevices} />);

        expect(screen.getByText('Metaphor')).toBeInTheDocument();
        expect(screen.getByTestId('quote')).toHaveTextContent("The sun was a golden eye");
        expect(screen.getByText('The sun is compared to an eye.')).toBeInTheDocument();
    });

    it('should display a message when no devices are found', () => {
        render(<LiteraryAnalysisTab devices={[]} />);

        expect(screen.getByText('No Devices Found')).toBeInTheDocument();
    });
});
