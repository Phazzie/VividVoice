
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { SubtextAnalyzer } from './SubtextAnalyzer';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('SubtextAnalyzer', () => {
    it('should render analyses when provided', () => {
        const mockAnalyses = [{
            character: 'Alice',
            dialogue: 'Fine.',
            literalMeaning: 'Everything is okay.',
            subtext: 'Everything is not okay.',
            explanation: 'The context suggests anger.'
        }];
        render(<SubtextAnalyzer analyses={mockAnalyses} />);

        expect(screen.getByText('Alice says:')).toBeInTheDocument();
        expect(screen.getByText(/"Fine."/i)).toBeInTheDocument();
        expect(screen.getByText('Everything is not okay.')).toBeInTheDocument();
    });

    it('should display a message when no analyses are found', () => {
        render(<SubtextAnalyzer analyses={[]} />);

        expect(screen.getByText('No Subtext Detected')).toBeInTheDocument();
    });
});
