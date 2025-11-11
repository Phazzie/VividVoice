/**
 * Mock Story Service Implementation
 * Used for testing and development
 */

import type {
  IStoryService,
  ParsedStory,
  StoryAnalysis,
  DialogueDynamics,
  LiteraryDevice,
  PacingSegment,
  Trope,
  ShowDontTellSuggestion,
  ConsistencyIssue,
  SubtextAnalysis,
} from '../contracts';

export class MockStoryService implements IStoryService {
  async parseStory(storyText: string): Promise<ParsedStory> {
    if (!storyText.trim()) {
      throw new Error('Story text cannot be empty');
    }

    // Mock parsed story with sample data
    return {
      segments: [
        {
          character: 'Narrator',
          dialogue: 'Once upon a time...',
          emotion: 'neutral',
        },
        {
          character: 'Hero',
          dialogue: 'I will save the day!',
          emotion: 'determined',
        },
      ],
      characters: [
        {
          name: 'Narrator',
          description: 'The storyteller',
          voiceId: 'narrator-voice',
        },
        {
          name: 'Hero',
          description: 'The brave protagonist',
          voiceId: 'hero-voice',
        },
      ],
    };
  }

  async analyzeStory(storyText: string): Promise<StoryAnalysis> {
    if (!storyText.trim()) {
      throw new Error('Story text cannot be empty');
    }

    const parsedStory = await this.parseStory(storyText);

    return {
      segments: parsedStory.segments,
      characters: parsedStory.characters,
      dialogueDynamics: {
        summary: 'Mock dialogue dynamics analysis',
        powerBalance: [],
        pacing: {
          overallWordsPerTurn: 10,
          characterPacing: [],
        },
      },
      literaryDevices: {
        devices: [
          {
            type: 'metaphor',
            quote: 'Time is money',
            explanation: 'A common metaphor',
          },
        ],
      },
      pacing: {
        segments: [
          {
            start: 0,
            end: 100,
            type: 'dialogue',
            intensity: 5,
          },
        ],
      },
      tropes: {
        tropes: [
          {
            name: 'Hero\'s Journey',
            description: 'Classic hero narrative arc',
            suggestion: 'Consider subverting expectations',
          },
        ],
      },
      showDontTellSuggestions: {
        suggestions: [
          {
            original: 'He was angry',
            suggestion: 'His fists clenched as his face turned red',
            explanation: 'Show the emotion through actions',
          },
        ],
      },
      consistencyIssues: {
        issues: [],
      },
      subtextAnalyses: {
        analyses: [
          {
            dialogue: 'I will save the day!',
            character: 'Hero',
            subtext: 'Displays confidence and determination',
          },
        ],
      },
      errors: {},
    };
  }

  async analyzeEmotionalTone(
    dialogue: string,
    context: string
  ): Promise<{ emotion: string }> {
    // Simple mock emotion detection
    const emotions = ['happy', 'sad', 'angry', 'neutral', 'determined'];
    return {
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
    };
  }

  async analyzeDialogueDynamics(
    storyText: string
  ): Promise<DialogueDynamics> {
    return {
      summary: 'Mock dialogue dynamics',
      powerBalance: [],
      pacing: {
        overallWordsPerTurn: 10,
        characterPacing: [],
      },
    };
  }

  async analyzeLiteraryDevices(
    storyText: string
  ): Promise<{ devices: LiteraryDevice[] }> {
    return {
      devices: [
        {
          type: 'metaphor',
          quote: 'Mock quote',
          explanation: 'Mock explanation',
        },
      ],
    };
  }

  async analyzePacing(
    storyText: string
  ): Promise<{ segments: PacingSegment[] }> {
    return {
      segments: [
        {
          start: 0,
          end: 100,
          type: 'dialogue',
          intensity: 5,
        },
      ],
    };
  }

  async invertTropes(storyText: string): Promise<{ tropes: Trope[] }> {
    return {
      tropes: [
        {
          name: 'Mock Trope',
          description: 'A common narrative pattern',
          suggestion: 'Try inverting it',
        },
      ],
    };
  }

  async getShowDontTellSuggestions(
    storyText: string
  ): Promise<{ suggestions: ShowDontTellSuggestion[] }> {
    return {
      suggestions: [
        {
          original: 'She was happy',
          suggestion: 'She smiled brightly',
          explanation: 'Show the emotion',
        },
      ],
    };
  }

  async findInconsistencies(
    storyText: string
  ): Promise<{ issues: ConsistencyIssue[] }> {
    return {
      issues: [],
    };
  }

  async analyzeSubtext(
    storyText: string
  ): Promise<{ analyses: SubtextAnalysis[] }> {
    return {
      analyses: [
        {
          dialogue: 'Mock dialogue',
          character: 'Mock Character',
          subtext: 'Mock subtext analysis',
        },
      ],
    };
  }
}
