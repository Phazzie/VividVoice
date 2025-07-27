
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
            <div className="recharts-responsive-container" style={{ width: '100%', height: '100%' }}>
                {children}
            </div>
        ),
        AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
        Area: ({ children }: { children: React.ReactNode }) => <div data-testid="area">{children}</div>,
        XAxis: () => <div data-testid="x-axis" />,
        YAxis: () => <div data-testid="y-axis" />,
        Tooltip: () => <div data-testid="tooltip" />,
        Legend: () => <div data-testid="legend" />,
        CartesianGrid: () => <div data-testid="cartesian-grid" />,
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
