import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { User } from 'firebase/auth';

// Create a mock user
const mockUser: User = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/avatar.png',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toUTCString(),
    lastSignInTime: new Date().toUTCString(),
  },
  providerData: [{
    providerId: 'google.com',
    uid: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/avatar.png',
    phoneNumber: null,
  }],
  refreshToken: 'test-refresh-token',
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('test-id-token'),
  getIdTokenResult: () => Promise.resolve({
    token: 'test-id-token',
    expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'google.com',
    signInSecondFactor: null,
    claims: {},
  }),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
};

// Create a mock auth context value
const mockAuthContext = {
  user: mockUser,
  loading: false,
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  );
};
