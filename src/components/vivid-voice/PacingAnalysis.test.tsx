
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { PacingAnalysis } from './PacingAnalysis';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

// Mock recharts
vi.mock('recharts', async () => {
    const OriginalRecharts = await vi.importActual('recharts');
    return {
        ...OriginalRecharts,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 400 }}>{children}</div>
        ),
    };
});


describe('PacingAnalysis', () => {
    it('should render the pacing chart when analysis data is provided', () => {
        const mockPacing = { segments: [
            { type: 'Narration', wordCount: 10 },
            { type: 'Dialogue', wordCount: 20 },
        ]};
        render(<PacingAnalysis pacing={mockPacing} />);

        expect(screen.getByText('Pacing Visualization')).toBeInTheDocument();
    });

    it('should display a message when no analysis data is provided', () => {
        render(<PacingAnalysis pacing={null} />);

        expect(screen.getByText('Analysis Not Available')).toBeInTheDocument();
    });

    it('should display a message when analysis data is empty', () => {
        render(<PacingAnalysis pacing={{ segments: [] }} />);

        expect(screen.getByText('Analysis Not Available')).toBeInTheDocument();
    });
});
