import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the AuthProvider to provide a dummy user and avoid actual Firebase calls
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mockAuth = {
        user: { uid: 'test-user', email: 'test@example.com', displayName: 'Test User' },
        loading: false,
        signInWithGoogle: async () => { },
        signOut: async () => { },
        isPro: false,
        isTrial: true,
        remainingGenerations: 10,
        daysLeftInTrial: 7,
        subscriptionEndDate: null,
    };

    return (
        <AuthProvider value={mockAuth}>
            {children}
        </AuthProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: MockAuthProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };
