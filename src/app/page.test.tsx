
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VividVoicePage from './page';
import { userEvent } from '@testing-library/user-event';
import { useToast } from '@/hooks/use-toast';

// Mock the server actions module
vi.mock('@/lib/actions', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        getParsedStory: vi.fn(),
        getCharacterPortraits: vi.fn(),
        generateMultiVoiceSceneAudio: vi.fn(),
    };
});

// Mock the child components for isolation
vi.mock('@/components/vivid-voice/StoryForm', () => ({
  StoryForm: ({ onSubmit, isLoading }: { onSubmit: (text: string) => void, isLoading: boolean }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit('mock story'); }}>
      <button type="submit" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Start Generation'}</button>
    </form>
  ),
}));

vi.mock('@/components/vivid-voice/DialogueEditor', () => ({
  DialogueEditor: ({ onGenerateAudio, isLoading }: { onGenerateAudio: (segments: any[]) => void, isLoading: boolean }) => (
    <div>
      <h1>Dialogue Editor</h1>
      <button onClick={() => onGenerateAudio([])} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Audio'}</button>
    </div>
  ),
}));

vi.mock('@/components/vivid-voice/StoryDisplay', () => ({
  StoryDisplay: ({ onBack }: { onBack: () => void }) => (
    <div>
        <h1>Story Display</h1>
        <button onClick={onBack}>Back to Editor</button>
    </div>
  )
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast');

// We need to import the mocked actions *after* the vi.mock call
import { getParsedStory, getCharacterPortraits, generateMultiVoiceSceneAudio } from '@/lib/actions';

describe('VividVoicePage State Machine', () => {

  const toastMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as vi.Mock).mockReturnValue({ toast: toastMock });
  });

  // Test the transition from 'initial' to 'parsing' to 'editing'
  it('should transition from initial -> parsing -> editing on story submission', async () => {
    const user = userEvent.setup();
    const mockParsedResponse = {
      segments: [{ character: 'Alice', dialogue: 'Hi', emotion: 'Happy' }],
      characters: [{ name: 'Alice', description: 'A character' }],
    };
    const mockPortraitResponse = [{ name: 'Alice', portraitDataUri: 'url' }];
    (getParsedStory as vi.Mock).mockResolvedValue(mockParsedResponse);
    (getCharacterPortraits as vi.Mock).mockResolvedValue(mockPortraitResponse);

    render(<VividVoicePage />);
    
    // Initial state
    expect(screen.getByText('Your Story Awaits')).toBeInTheDocument();

    // Click submit button in mock StoryForm
    const submitButton = screen.getByRole('button', { name: /Start Generation/i });
    await user.click(submitButton);

    // Parsing state
    expect(screen.getByText('Analyzing Story & Characters...')).toBeInTheDocument();
    expect(getParsedStory).toHaveBeenCalledWith('mock story');

    // Editing state (after promise resolves)
    await waitFor(() => {
      expect(getCharacterPortraits).toHaveBeenCalledWith(mockParsedResponse.characters);
      expect(screen.getByRole('heading', { name: /Dialogue Editor/i })).toBeInTheDocument();
    });
  });

  // Test the transition from 'editing' to 'generating' to 'displaying'
  it('should transition from editing -> generating -> displaying on audio generation', async () => {
    const user = userEvent.setup();
     const mockAudioResponse = {
      audioDataUri: 'test.wav',
      transcript: []
    };
    (generateMultiVoiceSceneAudio as vi.Mock).mockResolvedValue(mockAudioResponse);

    // Start the component in the 'editing' state by mocking a successful parse
     const mockParsedResponse = {
      segments: [{ character: 'Alice', dialogue: 'Hi', emotion: 'Happy' }],
      characters: [{ name: 'Alice', description: 'A character' }],
    };
    const mockPortraitResponse = [{ name: 'Alice', portraitDataUri: 'url' }];
    (getParsedStory as vi.Mock).mockResolvedValue(mockParsedResponse);
    (getCharacterPortraits as vi.Mock).mockResolvedValue(mockPortraitResponse);
    
    render(<VividVoicePage />);
    
    // Get to editing state
    await user.click(screen.getByRole('button', { name: /Start Generation/i }));
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Dialogue Editor/i })).toBeInTheDocument();
    });

    // Click generate button in mock DialogueEditor
    const generateButton = screen.getByRole('button', { name: /Generate Audio/i });
    await user.click(generateButton);

    // Generating state
    expect(screen.getByText('Generating Audio...')).toBeInTheDocument();

    // Displaying state
     await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Story Display/i })).toBeInTheDocument();
    });
  });

    // Test the transition from 'displaying' back to 'editing'
    it('should transition from displaying to editing when back button is clicked', async () => {
        const user = userEvent.setup();
        const mockAudioResponse = { audioDataUri: 'test.wav', transcript: [] };
        (generateMultiVoiceSceneAudio as vi.Mock).mockResolvedValue(mockAudioResponse);
        const mockParsedResponse = { segments: [], characters: [{name: 'Alice', description: 'desc'}] };
        (getParsedStory as vi.Mock).mockResolvedValue(mockParsedResponse);
        (getCharacterPortraits as vi.Mock).mockResolvedValue([]);

        render(<VividVoicePage />);

        // Go through the whole flow to get to 'displaying'
        await user.click(screen.getByRole('button', { name: /Start Generation/i }));
        await waitFor(() => expect(screen.getByRole('heading', { name: /Dialogue Editor/i })).toBeInTheDocument());
        await user.click(screen.getByRole('button', { name: /Generate Audio/i }));
        await waitFor(() => expect(screen.getByRole('heading', { name: /Story Display/i })).toBeInTheDocument());

        // Click back button in mock StoryDisplay
        const backButton = screen.getByRole('button', { name: /Back to Editor/i });
        await user.click(backButton);

        // Should be back in editing state
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Dialogue Editor/i })).toBeInTheDocument();
        });
    });

    // Test a failure during parsing
    it('should return to initial state and show a toast if parsing fails', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Parsing failed!';
        (getParsedStory as vi.Mock).mockRejectedValue(new Error(errorMessage));

        render(<VividVoicePage />);
        
        await user.click(screen.getByRole('button', { name: /Start Generation/i }));

        await waitFor(() => {
            // Should go back to the initial screen
             expect(screen.getByText('Your Story Awaits')).toBeInTheDocument();
             // Check for toast message
             expect(toastMock).toHaveBeenCalledWith({
                variant: "destructive",
                title: "Parsing Error",
                description: errorMessage,
             });
        });
    });
    
    // Test a non-critical failure during portrait generation
    it('should proceed to editing and show a toast if only portrait generation fails', async () => {
      const user = userEvent.setup();
      const mockParsedResponse = {
        segments: [{ character: 'Alice', dialogue: 'Hi', emotion: 'Happy' }],
        characters: [{ name: 'Alice', description: 'A character' }, { name: 'Bob', description: 'Another' }],
      };
      (getParsedStory as vi.Mock).mockResolvedValue(mockParsedResponse);
      // Simulate portrait generation returning only one portrait for two characters
      (getCharacterPortraits as vi.Mock).mockResolvedValue([{ name: 'Alice', portraitDataUri: 'url' }]);

      render(<VividVoicePage />);

      await user.click(screen.getByRole('button', { name: /Start Generation/i }));

      // Should still go to editing state
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Dialogue Editor/i })).toBeInTheDocument();
      });

      // Should show a non-destructive toast
      expect(toastMock).toHaveBeenCalledWith({
        variant: "default",
        title: "Portrait Generation Note",
        description: "Could not generate all character portraits, but you can continue editing.",
      });
    });
});
