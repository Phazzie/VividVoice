/**
 * Real Story Service Implementation
 * Wraps existing AI flows for production use
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
  Perspective,
} from '../contracts';

import { parseDialogue as parseDialogueFlow } from '@/ai/flows/parse-dialogue';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';
import { invertTropes as invertTropesFlow } from '@/ai/flows/trope-inverter';
import { analyzeStoryPacing as analyzeStoryPacingFlow } from '@/ai/flows/analyze-pacing';
import { getShowDontTellSuggestions as getShowDontTellSuggestionsFlow } from '@/ai/flows/show-dont-tell';
import { findInconsistencies as findInconsistenciesFlow } from '@/ai/flows/consistency-guardian';
import { analyzeSubtext as analyzeSubtextFlow } from '@/ai/flows/analyze-subtext';
import { analyzeEmotionalTone as analyzeEmotionalToneFlow } from '@/ai/flows/analyze-emotional-tone';
import { shiftPerspective as shiftPerspectiveFlow } from '@/ai/flows/shift-perspective';
import { applyNarratorBias as applyNarratorBiasFlow } from '@/ai/flows/unreliable-narrator';

export class RealStoryService implements IStoryService {
  async parseStory(storyText: string): Promise<ParsedStory> {
    console.log('RealStoryService: Parsing story...');

    if (!storyText.trim()) {
      throw new Error('Story text cannot be empty');
    }

    try {
      const parsedResult = await parseDialogueFlow({ storyText });

      if (
        !parsedResult ||
        !parsedResult.segments ||
        parsedResult.segments.length === 0
      ) {
        throw new Error(
          'Could not parse dialogue. Please ensure it has standard dialogue formatting.'
        );
      }

      console.log('RealStoryService: Story parsing successful.');
      return parsedResult;
    } catch (error) {
      console.error('RealStoryService: Error during parseStory:', error);
      throw new Error('Failed to parse the story.');
    }
  }

  async analyzeStory(storyText: string): Promise<StoryAnalysis> {
    console.log('RealStoryService: Starting full story analysis...');

    if (!storyText.trim()) {
      throw new Error('Story text cannot be empty');
    }

    try {
      // 1. Parse the story
      const parsedStory = await this.parseStory(storyText);
      const { segments, characters } = parsedStory;

      // 2. Analyze emotional tone for each segment
      const segmentsWithEmotions = await Promise.all(
        segments.map(async (segment, index) => {
          if (segment.character === 'Narrator') {
            return segment;
          }
          const context = segments
            .slice(Math.max(0, index - 2), Math.min(segments.length, index + 3))
            .map((s) => `${s.character}: ${s.dialogue}`)
            .join('\n');
          const { emotion } = await this.analyzeEmotionalTone(
            segment.dialogue,
            context
          );
          return { ...segment, emotion };
        })
      );

      // 3. Run all other analyses in parallel
      const results = await Promise.allSettled([
        this.analyzeDialogueDynamics(storyText),
        this.analyzeLiteraryDevices(storyText),
        this.analyzePacing(storyText),
        this.invertTropes(storyText),
        this.getShowDontTellSuggestions(storyText),
        this.findInconsistencies(storyText),
        this.analyzeSubtext(storyText),
      ]);

      const [
        dialogueDynamicsResult,
        literaryDevicesResult,
        pacingResult,
        tropesResult,
        showDontTellSuggestionsResult,
        consistencyIssuesResult,
        subtextAnalysesResult,
      ] = results.map((r) => (r.status === 'fulfilled' ? r.value : null));

      // Track errors
      const errors: Record<string, string> = {};
      if (results[0].status === 'rejected')
        errors.dialogueDynamics = results[0].reason.message;
      if (results[1].status === 'rejected')
        errors.literaryDevices = results[1].reason.message;
      if (results[2].status === 'rejected')
        errors.pacing = results[2].reason.message;
      if (results[3].status === 'rejected')
        errors.tropes = results[3].reason.message;
      if (results[4].status === 'rejected')
        errors.showDontTell = results[4].reason.message;
      if (results[5].status === 'rejected')
        errors.consistency = results[5].reason.message;
      if (results[6].status === 'rejected')
        errors.subtext = results[6].reason.message;

      console.log('RealStoryService: Full story analysis successful.');

      return {
        segments: segmentsWithEmotions,
        characters,
        dialogueDynamics:
          (dialogueDynamicsResult as DialogueDynamics) ||
          ({
            summary: '',
            powerBalance: [],
            pacing: { overallWordsPerTurn: 0, characterPacing: [] },
          } as DialogueDynamics),
        literaryDevices: (literaryDevicesResult as any) || { devices: [] },
        pacing: (pacingResult as any) || { segments: [] },
        tropes: (tropesResult as any) || { tropes: [] },
        showDontTellSuggestions: (showDontTellSuggestionsResult as any) || {
          suggestions: [],
        },
        consistencyIssues: (consistencyIssuesResult as any) || { issues: [] },
        subtextAnalyses: (subtextAnalysesResult as any) || { analyses: [] },
        errors,
      };
    } catch (error) {
      console.error('RealStoryService: Error during analyzeStory:', error);
      throw new Error('Failed to analyze the story.');
    }
  }

  async analyzeEmotionalTone(
    dialogue: string,
    context: string
  ): Promise<{ emotion: string }> {
    try {
      const result = await analyzeEmotionalToneFlow({ dialogue, context });
      return result;
    } catch (error) {
      console.error(
        'RealStoryService: Error during analyzeEmotionalTone:',
        error
      );
      return { emotion: 'neutral' };
    }
  }

  async analyzeDialogueDynamics(
    storyText: string
  ): Promise<DialogueDynamics> {
    return await analyzeDialogueDynamicsFlow({ storyText });
  }

  async analyzeLiteraryDevices(
    storyText: string
  ): Promise<{ devices: LiteraryDevice[] }> {
    return await analyzeLiteraryDevicesFlow({ storyText });
  }

  async analyzePacing(
    storyText: string
  ): Promise<{ segments: PacingSegment[] }> {
    return await analyzeStoryPacingFlow({ storyText });
  }

  async invertTropes(storyText: string): Promise<{ tropes: Trope[] }> {
    return await invertTropesFlow({ storyText });
  }

  async getShowDontTellSuggestions(
    storyText: string
  ): Promise<{ suggestions: ShowDontTellSuggestion[] }> {
    return await getShowDontTellSuggestionsFlow({ storyText });
  }

  async findInconsistencies(
    storyText: string
  ): Promise<{ issues: ConsistencyIssue[] }> {
    return await findInconsistenciesFlow({ storyText });
  }

  async analyzeSubtext(
    storyText: string
  ): Promise<{ analyses: SubtextAnalysis[] }> {
    return await analyzeSubtextFlow({ storyText });
  }

  async shiftPerspective(
    storyText: string,
    characterName: string,
    role: 'Protagonist' | 'Antagonist',
    format: 'summary' | 'diaryEntry' | 'letter' | 'policeStatement' = 'summary'
  ): Promise<Perspective> {
    console.log('RealStoryService: Shifting perspective...');
    try {
      return await shiftPerspectiveFlow({ storyText, characterName, role, format });
    } catch (error) {
      console.error('RealStoryService: Error during shiftPerspective:', error);
      throw new Error('Failed to shift perspective.');
    }
  }

  async applyNarratorBias(
    storyText: string,
    bias: { startBias: string; endBias: string }
  ): Promise<string> {
    console.log('RealStoryService: Applying narrator bias...');
    try {
      const result = await applyNarratorBiasFlow({ storyText, bias: bias as any });
      return result.biasedStoryText;
    } catch (error) {
      console.error('RealStoryService: Error during applyNarratorBias:', error);
      throw new Error('Failed to apply narrator bias.');
    }
  }
}
