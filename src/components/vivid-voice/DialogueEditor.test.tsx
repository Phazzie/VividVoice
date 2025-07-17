
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialogueEditor, emotionOptions } from './DialogueEditor';
import { userEvent } from '@testing-library/user-event';
import { Character } from '@/lib/actions';

// Mock child components that are complex and not relevant to this test
vi.mock('@/components/vivid-voice/LiteraryAnalysis', () => ({
  LiteraryAnalysisTab: () => <div>LiteraryAnalysisTab</div>,
}));
vi.mock('@/components/vivid-voice/DialogueDynamicsAnalysis', () => ({
  DialogueDynamicsAnalysis: () => <div>DialogueDynamicsAnalysis</div>,
}));
vi.mock('@/components/vivid-voice/TropeInverter', () => ({
  TropeInverter: () => <div>TropeInverter</div>,
}));
vi.mock('@/components/vivid-voice/ActorStudio', () => ({
    ActorStudio: () => <div>ActorStudio</div>
}));
vi.mock('@/components/vivid-voice/UnreliableNarrator', () => ({
    UnreliableNarrator: () => <div>UnreliableNarrator</div>
}));
vi.mock('@/components/vivid-voice/PacingAnalysis', () => ({
    PacingAnalysis: () => <div>PacingAnalysis</div>
}));
vi.mock('@/components/vivid-voice/ShowDontTell', () => ({
    ShowDontTell: () => <div>ShowDontTell</div>
}));
vi.mock('@/components/vivid-voice/ConsistencyGuardian', () => ({
    ConsistencyGuardian: () => <div>ConsistencyGuardian</div>
}));
vi.mock('@/components/vivid-voice/SubtextAnalyzer', () => ({
    SubtextAnalyzer: () => <div>SubtextAnalyzer</div>
}));
vi.mock('@/components/vivid-voice/PerspectiveShifter', () => ({
    PerspectiveShifter: () => <div>PerspectiveShifter</div>
}));


const mockSegments = [
  { character: 'Narrator', dialogue: 'The beginning.', emotion: 'Neutral' },
  { character: 'Alice', dialogue: 'Hello there.', emotion: 'Happy' },
];

const mockCharacters: Character[] = [
    { name: 'Narrator', description: 'Narrator desc', voiceId: 'v-narr' },
    { name: 'Alice', description: 'Alice desc', voiceId: 'v-alice' },
]

const mockPortraits = [
    { name: 'Alice', portraitDataUri: 'data:image/png;base64,alice' }
]

const mockDialogueDynamics = {
    powerBalance: [],
    pacing: { overallWordsPerTurn: 0, characterPacing: [] },
    summary: 'A summary'
};
const mockLiteraryDevices = [];
const mockPacing = { segments: [] };
const mockTropes = [];
const mockShowDontTell = [];
const mockConsistency = [];
const mockSubtext = [];
const mockSoundEffects = [];


describe('DialogueEditor', () => {
  const defaultProps = {
    storyId: "1",
    storyText: "Story text",
    initialSegments: mockSegments,
    characters: mockCharacters,
    characterPortraits: mockPortraits,
    dialogueDynamics: mockDialogueDynamics,
    literaryDevices: mockLiteraryDevices,
    pacing: mockPacing,
    tropes: mockTropes,
    showDontTellSuggestions: mockShowDontTell,
    consistencyIssues: mockConsistency,
    subtextAnalyses: mockSubtext,
    soundEffects: mockSoundEffects,
    onGenerateAudio: () => {},
    isLoading: false,
    onStorySave: () => {},
  };

  it('should render initial segments correctly', () => {
    render(<DialogueEditor {...defaultProps} />);

    expect(screen.getByText('Narrator')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('The beginning.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello there.')).toBeInTheDocument();
  });

  it('should allow editing dialogue text', async () => {
    const user = userEvent.setup();
    render(<DialogueEditor {...defaultProps} />);

    const firstTextarea = screen.getByDisplayValue('The beginning.');
    await user.clear(firstTextarea);
    await user.type(firstTextarea, 'A new beginning.');
    expect(firstTextarea).toHaveValue('A new beginning.');
  });

  it('should allow changing an emotion', async () => {
    const user = userEvent.setup();
    render(<DialogueEditor {...defaultProps} />);

    // There will be multiple emotion dropdowns, we target the second one (for Alice)
    const emotionSelects = screen.getAllByRole('combobox');
    const alicesEmotionSelect = emotionSelects[1];

    expect(alicesEmotionSelect).toHaveTextContent('Happy');
    
    await user.click(alicesEmotionSelect);
    const sadOption = await screen.findByText('Sad');
    await user.click(sadOption);

    // After selection, the trigger should show the new value
    expect(alicesEmotionSelect).toHaveTextContent('Sad');
  });

  it('should call onGenerateAudio with the updated segments when button is clicked', async () => {
    const user = userEvent.setup();
    const handleGenerateAudio = vi.fn();
    render(<DialogueEditor {...defaultProps} onGenerateAudio={handleGenerateAudio} />);

    const firstTextarea = screen.getByDisplayValue('The beginning.');
    await user.clear(firstTextarea);
    await user.type(firstTextarea, 'A new beginning.');

    const generateButton = screen.getByRole('button', { name: /Generate Expressive Narration/i });
    await user.click(generateButton);

    const expectedSegments = [
        { character: 'Narrator', dialogue: 'A new beginning.', emotion: 'Neutral' },
        { character: 'Alice', dialogue: 'Hello there.', emotion: 'Happy' },
    ];

    expect(handleGenerateAudio).toHaveBeenCalledWith(expectedSegments);
  });

  it('should disable the generate button when isLoading is true', () => {
    render(<DialogueEditor {...defaultProps} isLoading={true} />);
    const generateButton = screen.getByRole('button', { name: /Generating Audio.../i });
    expect(generateButton).toBeDisabled();
  });
});
