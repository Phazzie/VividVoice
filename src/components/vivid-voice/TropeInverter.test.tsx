
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { TropeInverter } from './TropeInverter';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('TropeInverter', () => {
    it('should render the analysis results when tropes are provided', () => {
        const mockTropes = [{
            trope: 'The Chosen One',
            quote: 'He was the chosen one.',
            inversionSuggestion: 'Turns out, he was chosen by the villains.'
        }];
        render(<TropeInverter tropes={mockTropes} />);

        expect(screen.getByText('The Chosen One')).toBeInTheDocument();
        expect(screen.getByText('Inversion Suggestion:')).toBeInTheDocument();
        expect(screen.getByText('Turns out, he was chosen by the villains.')).toBeInTheDocument();
    });

    it('should display a message when no tropes are found', () => {
        render(<TropeInverter tropes={[]} />);

        expect(screen.getByText('No Tropes Identified')).toBeInTheDocument();
    });
});
