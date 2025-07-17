
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { ConsistencyGuardian } from './ConsistencyGuardian';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions');

describe('ConsistencyGuardian', () => {
    it('should render issues when provided', () => {
        const mockIssues = [{
            issue: 'Character eye color changed',
            quote: 'Her eyes were blue. ... her eyes were brown.',
            explanation: 'The character\'s eye color changes without explanation.'
        }];
        render(<ConsistencyGuardian issues={mockIssues} />);

        expect(screen.getByText('Character eye color changed')).toBeInTheDocument();
        expect(screen.getByText(/"Her eyes were blue. ... her eyes were brown."/i)).toBeInTheDocument();
        expect(screen.getByText('The character\'s eye color changes without explanation.')).toBeInTheDocument();
    });

    it('should display a message when no issues are found', () => {
        render(<ConsistencyGuardian issues={[]} />);

        expect(screen.getByText('No Inconsistencies Found')).toBeInTheDocument();
    });
});
