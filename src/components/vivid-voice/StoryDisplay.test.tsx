import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StoryDisplay } from './StoryDisplay';
import { userEvent } from '@testing-library/user-event';

const mockSegments = [
  { character: 'Narrator', dialogue: 'The beginning.', emotion: 'Neutral' },
  { character: 'Alice', dialogue: 'Hello there.', emotion: 'Happy' },
];

const mockCharacters = [
    { name: 'Narrator', description: 'The narrator', voiceId: 'voice-narrator' },
    { name: 'Alice', description: 'A friendly character', voiceId: 'voice-alice' },
]

const mockPortraits = [
    { name: 'Alice', portraitDataUri: 'data:image/png;base64,alice' }
]

const mockTranscript = [
    { segmentIndex: 0, startTime: 0, endTime: 1, words: [] },
    { segmentIndex: 1, startTime: 1, endTime: 2, words: [] },
]

describe('StoryDisplay', () => {
  beforeEach(() => {
    // Mock the HTMLMediaElement for audio playback control
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
     Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('should render the story segments and controls', () => {
    render(
      <StoryDisplay
        segments={mockSegments}
        characterPortraits={mockPortraits}
        characters={mockCharacters}
        storyText="Story text"
        sceneAudioUri="test.wav"
        transcript={mockTranscript}
        onBack={() => {}}
      />
    );
    
    expect(screen.getByText('The beginning.')).toBeInTheDocument();
    expect(screen.getByText('Hello there.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rewind/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast forward/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/playback speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/volume control/i)).toBeInTheDocument();
  });

  it('should call onBack when the back button is clicked', async () => {
    const handleBack = vi.fn();
    const user = userEvent.setup();
    render(
      <StoryDisplay
        segments={mockSegments}
        characterPortraits={mockPortraits}
        characters={mockCharacters}
        storyText="Story text"
        sceneAudioUri="test.wav"
        transcript={mockTranscript}
        onBack={handleBack}
      />
    );

    await user.click(screen.getByRole('button', { name: '' })); // The back button has no accessible name
    expect(handleBack).toHaveBeenCalledTimes(1);
  });


  it('should toggle play/pause when the play button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <StoryDisplay
        segments={mockSegments}
        characterPortraits={mockPortraits}
        characters={mockCharacters}
        storyText="Story text"
        sceneAudioUri="test.wav"
        transcript={mockTranscript}
        onBack={() => {}}
      />
    );
    
    const playButton = screen.getByRole('button', { name: /play/i });

    // Initial state: playing
    await user.click(playButton);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    
    // State after click: paused
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    await user.click(pauseButton);
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

   it('should highlight the current segment during playback', () => {
    const { container } = render(
       <StoryDisplay
        segments={mockSegments}
        characterPortraits={mockPortraits}
        characters={mockCharacters}
        storyText="Story text"
        sceneAudioUri="test.wav"
        transcript={mockTranscript}
        onBack={() => {}}
      />
    );

    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();

    // Simulate time update
    if(audio) {
        audio.currentTime = 0.5;
        fireEvent.timeUpdate(audio);
    }
    
    // Segment 0 should be highlighted
    const segment0 = screen.getByText('The beginning.').closest('div.flex.gap-4');
    expect(segment0).toHaveClass('bg-secondary/20 border-secondary');

    // Simulate another time update
     if(audio) {
        audio.currentTime = 1.5;
        fireEvent.timeUpdate(audio);
    }

    // Segment 1 should be highlighted
    const segment1 = screen.getByText('Hello there.').closest('div.flex.gap-4');
    expect(segment1).toHaveClass('bg-secondary/20 border-secondary');
  });

});
