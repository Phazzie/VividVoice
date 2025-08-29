import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock hasPointerCapture and other Element.prototype functions
if (typeof window !== 'undefined') {
  if (!window.Element.prototype.hasPointerCapture) {
    window.Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  }
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = vi.fn();
  }
}

// Mock server actions
vi.mock('@/lib/actions', async (importOriginal) => {
    const original = await importOriginal() as any;
    // We need to keep the original enums and other exports, so we spread the original module
    // and then overwrite the functions we want to mock.
    return {
        ...original,
        parseStory: vi.fn(),
        generateCharacterPortraits: vi.fn(),
        generateAudio: vi.fn(),
        getCharacterProfile: vi.fn(),
        chatWithCharacter: vi.fn(),
        getSoundDesign: vi.fn(),
        analyzeLiteraryDevices: vi.fn(),
        analyzeDialogue: vi.fn(),
        analyzePacing: vi.fn(),
        analyzeShowVsTell: vi.fn(),
        invertTropes: vi.fn(),
        findInconsistencies: vi.fn(),
        analyzeSubtext: vi.fn(),
        shiftPerspective: vi.fn(),
        rewriteWithBias: vi.fn(),
    };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '/',
}));

// Mock the useToast hook from sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
