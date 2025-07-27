# 🔄 STRATEGY CHANGE: Merge Current Branch First

## 📋 EXECUTIVE SUMMARY - UPDATED STRATEGY

**Mission CHANGED:** Instead of adding features to current branch, we're now:

1. ✅ **FIRST**: Merge current branch (`feature/prompt-audit-and-improvements`) to main
2. 🚀 **THEN**: Use AI agent to add PR #10 and PR #11 features to new branch from main
3. ✨ **FINALLY**: Single clean merge of enhanced features

**Reason:** Current branch is WAY AHEAD with modern CI/CD, infrastructure, and documentation. Other PRs are based on outdated code. Better to establish this as the new baseline first.

---

## 🎯 NEW PLAN: Foundation First, Features Second

### Phase 1: Establish Modern Foundation ✅
- **Current Status**: This branch has comprehensive CI/CD, testing, documentation
- **Action**: Merge this branch to main to establish modern baseline
- **Result**: Main branch becomes the source of truth with latest infrastructure

### Phase 2: Add Features to Modern Base 🚀  
- **Source**: Fresh branch from updated main
- **Add**: Skeptical Wombat theme system (PR #10)
- **Add**: Emotional tone analysis feature (PR #11)
- **Tool**: AI coding agent with clean, modern codebase

---

## 📚 ARCHIVED: Original Implementation Guide

**Note**: The detailed implementation tasks below are now ARCHIVED. They were designed to add features to the current branch, but we're now taking the "foundation first" approach.

**New Implementation**: Will be handled by AI agent working from the modern main branch after this branch is merged.

---

## Overview
This file contains all the conflicting code from 3 pull requests that need to be merged:
- **PR #6**: `feature/prompt-audit-and-improvements` (CURRENT BRANCH)
- **PR #10**: `feat/skeptical-wombat-theme` 
- **PR #11**: `ui-audit-with-auto-emotion` (emotion assignment restoration)

## 🎯 Mission for AI Coding Agent
You need to resolve conflicts and merge features from all 3 PRs into the current branch (`feature/prompt-audit-and-improvements`).

**CRITICAL UNDERSTANDING:**
- The current branch already has MOST of the infrastructure needed
- You only need to ADD specific new features from the other PRs
- DO NOT modify existing working code unless specifically instructed
- Focus on adding the Emotional Tone analysis feature that was in PR #11

**WHAT'S ALREADY WORKING:**
- DialogueEditor component with 11 existing tabs
- Complete AI flow system with 12+ flows 
- Actions system with proper error handling
- Schema system with 15+ schemas
- All CI/CD, testing, and build infrastructure

---

## 📋 PHASE 1: Package.json Dependency Merge

### Current package.json (PR #6 - Base)
```json
{
  "name": "vivid-voice",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "typecheck": "tsc --noEmit",
    "prepare": "husky install"
  },
  "dependencies": {
    "@google-ai/genkit": "^1.13.0",
    "@google-ai/genkit-model-googleai": "^1.13.0",
    "@google-ai/genkit-model-vertexai": "^1.13.0",
    "@headlessui/react": "^2.2.0",
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.3",
    "@radix-ui/react-dropdown-menu": "^2.1.3",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.3",
    "@radix-ui/react-popover": "^1.1.3",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "@radix-ui/react-select": "^2.1.3",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-sheet": "^1.1.2",
    "@radix-ui/react-sidebar": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.3",
    "@radix-ui/react-tooltip": "^1.1.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "date-fns": "^4.1.0",
    "elevenlabs": "^0.35.0",
    "embla-carousel-react": "^8.4.1",
    "firebase": "^11.1.0",
    "genkit": "^1.13.0",
    "lucide-react": "^0.462.0",
    "next": "15.1.6",
    "react": "19.0.0",
    "react-day-picker": "^9.4.4",
    "react-dom": "19.0.0",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.0",
    "sonner": "^1.7.3",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.3",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.3",
    "genkit-cli": "^1.13.0",
    "husky": "^9.1.4",
    "jsdom": "^24.1.1",
    "lint-staged": "^15.2.7",
    "postcss": "^8",
    "prettier": "^3.6.2",
    "tailwindcss": "^3.4.1",
    "typescript": "^5",
    "vitest": "^2.1.9"
  }
}
```

### 🎯 TASK 1: Merge Dependencies
**Action Required**: Check the other PR branches for any additional dependencies and merge them into the current package.json. The current branch should remain the source of truth for versions.

---

## 📋 PHASE 2: DialogueEditor.tsx Integration

### Current DialogueEditor.tsx State (PR #6 - Base)
*Location: `/workspaces/VividVoice/src/components/vivid-voice/DialogueEditor.tsx`*

**Current tabs in the TabsList:**
- "dialogue" - Dialogue Editor
- "literaryAnalysis" - Literary Devices  
- "dialogueDynamics" - Dialogue Dynamics
- "pacing" - Pacing
- "tropeInverter" - Trope Inverter
- "actorStudio" - Actor's Studio
- "unreliableNarrator" - Unreliable Narrator
- "showDontTell" - Show, Don't Tell
- "consistency" - Consistency
- "subtext" - Subtext
- "perspective" - Perspective

### 🎯 TASK 2: Add Emotional Tone Analysis Tab
**Action Required**: 
1. Add import for `EmotionalToneAnalysis` component at top of file
2. Add new tab trigger in TabsList after "perspective" tab
3. Add new TabsContent after "perspective" TabsContent
4. Import Heart icon from lucide-react for the tab

**Exact code to add to imports:**
```tsx
import { Heart } from 'lucide-react';
import { EmotionalToneAnalysis } from '@/components/vivid-voice/EmotionalToneAnalysis';
```

**Exact TabsTrigger to add in TabsList (after the perspective tab):**
```tsx
<TabsTrigger value="emotional-tone" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Heart className="mr-2"/>Emotional Tone</TabsTrigger>
```

**Exact TabsContent to add after perspective TabsContent:**
```tsx
<TabsContent value="emotional-tone" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
  <EmotionalToneAnalysis storyText={storyText} />
</TabsContent>
```

---

## 📋 PHASE 3: New Components from PR #11

### 🎯 TASK 3: Create EmotionalToneAnalysis Component
**Action Required**: Create `/workspaces/VividVoice/src/components/vivid-voice/EmotionalToneAnalysis.tsx`

**Complete component code:**
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEmotionalToneAnalysis, type EmotionalTone } from '@/lib/actions';
import { Loader2, Heart, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmotionalToneAnalysisProps {
  storyText: string;
}

export function EmotionalToneAnalysis({ storyText }: EmotionalToneAnalysisProps) {
  const [analysis, setAnalysis] = useState<EmotionalTone | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!storyText.trim()) {
      setError('Please provide a story to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await getEmotionalToneAnalysis(storyText);
      setAnalysis(result);
    } catch (error) {
      console.error('Emotional tone analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'bg-red-500';
    if (intensity >= 6) return 'bg-orange-500';
    if (intensity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Emotional Tone Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !storyText.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Emotional Journey...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyze Emotional Tone
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-6 space-y-6">
              {/* Overall Tone */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Emotional Tone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {analysis.overallTone}
                  </Badge>
                </CardContent>
              </Card>

              {/* Emotional Segments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emotional Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {analysis.segments.map((segment, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                              "{segment.text}"
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary">{segment.emotion}</Badge>
                              <div className="flex items-center gap-1">
                                <div 
                                  className={`w-3 h-3 rounded-full ${getIntensityColor(segment.intensity)}`}
                                  title={`Intensity: ${segment.intensity}/10`}
                                />
                                <span className="text-xs font-mono">{segment.intensity}/10</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emotional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.summary}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📋 PHASE 4: Schema Extensions

### Current schemas.ts State
*Location: `/workspaces/VividVoice/src/ai/schemas.ts`*

**Current schemas:** CharacterSchema, DialogueSegmentSchema, LiteraryDeviceSchema, DialogueDynamicsSchema, TropeSchema, ChatMessageSchema, NarratorBiasSchema, PacingSegmentSchema, ShowDontTellSuggestionSchema, ConsistencyIssueSchema, SubtextAnalysisSchema, PerspectiveSchema, SoundEffectSchema, TranscriptWordSchema, TranscriptSegmentSchema

### 🎯 TASK 4: Add EmotionalToneSchema to schemas.ts
**Action Required**: Add the EmotionalToneSchema to the end of the file before the final export line

**Exact schema to add at the end of the file:**
```typescript
/**
 * Defines the schema for emotional tone analysis of a story.
 */
export const EmotionalToneSchema = z.object({
  overallTone: z.string().describe('The overall emotional tone of the story'),
  segments: z.array(z.object({
    text: z.string().describe('The text segment'),
    emotion: z.string().describe('The detected emotion'),
    intensity: z.number().min(1).max(10).describe('Emotional intensity (1-10)')
  })).describe('Emotional analysis of story segments'),
  summary: z.string().describe('Summary of emotional journey')
});
export type EmotionalTone = z.infer<typeof EmotionalToneSchema>;
```

---

## 📋 PHASE 5: Actions Integration

### Current actions.ts State
*Location: `/workspaces/VividVoice/src/lib/actions.ts`*

**Current imports:** Already has analyzeEmotionalTone import from '@/ai/flows/analyze-emotional-tone'
**Current exports:** Has all the required action functions

### 🎯 TASK 5: Add getEmotionalToneAnalysis to actions.ts
**Action Required**: 
1. Add import for EmotionalTone type from schemas
2. Add import for analyzeEmotionalStoryTone flow (this is the NEW flow we're creating)
3. Add the getEmotionalToneAnalysis function to the file

**Exact import to add after the EmotionalTone import:**
```typescript
import { analyzeEmotionalStoryTone as analyzeEmotionalStoryToneFlow } from '@/ai/flows/analyze-emotional-story-tone';
```

**Exact import to add to the type imports section:**
```typescript
type EmotionalTone as ImportedEmotionalTone,
```

**Add to the re-export section:**
```typescript
export type EmotionalTone = ImportedEmotionalTone;
```

**Exact function to add at the end of the file:**
```typescript
/**
 * Analyzes the emotional tone of an entire story.
 * @param storyText The full text of the story to analyze.
 * @returns A promise resolving to the emotional tone analysis.
 */
export async function getEmotionalToneAnalysis(storyText: string): Promise<EmotionalTone> {
  console.log('Calling getEmotionalToneAnalysis action...');
  try {
    const result = await analyzeEmotionalStoryToneFlow({ storyText });
    return result;
  } catch (e: any) {
    console.error('Error in getEmotionalToneAnalysis action:', { error: e });
    throw new Error('Failed to analyze emotional tone.');
  }
}
```

---

## 📋 PHASE 6: AI Flow Creation

### 🎯 TASK 6: Create analyze-emotional-story-tone.ts Flow
**Action Required**: Create `/workspaces/VividVoice/src/ai/flows/analyze-emotional-story-tone.ts`

**IMPORTANT:** This flow is DIFFERENT from the existing `analyze-emotional-tone.ts` flow. The existing flow analyzes individual dialogue segments. This new flow analyzes the emotional journey of an entire story.

**Complete file content:**
```typescript
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { EmotionalToneSchema } from '@/ai/schemas';

const AnalyzeEmotionalStoryToneInputSchema = z.object({
  storyText: z.string().describe('The full text of the story to analyze for emotional tone.'),
});

export type AnalyzeEmotionalStoryToneInput = z.infer<typeof AnalyzeEmotionalStoryToneInputSchema>;

export async function analyzeEmotionalStoryTone(input: AnalyzeEmotionalStoryToneInput) {
  return analyzeEmotionalStoryToneFlow(input);
}

const analyzeEmotionalStoryToneFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionalStoryTone',
    inputSchema: AnalyzeEmotionalStoryToneInputSchema,
    outputSchema: EmotionalToneSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'emotionalStoryTonePrompt',
      input: { schema: AnalyzeEmotionalStoryToneInputSchema },
      output: { schema: EmotionalToneSchema },
      prompt: `You are Dr. Elena Vasquez, a world-renowned literary psychologist and narrative therapy expert with 25 years of experience analyzing the emotional architecture of stories. You specialize in mapping the psychological journey that readers experience through narrative.

**YOUR EXPERTISE:**
- PhD in Literary Psychology from Stanford University
- Author of "The Emotional Genome of Stories" 
- Consultant for major publishing houses on emotional impact assessment
- Pioneer of "Narrative Emotional Mapping" methodology

**CRITICAL INSTRUCTIONS:**
- Analyze the emotional journey throughout the entire story from beginning to end
- Identify key emotional turning points and transitions that shape the reader's experience
- Provide both segment-level granular analysis and overall emotional assessment
- Use nuanced, sophisticated emotional vocabulary that captures subtle psychological states
- Focus on the reader's emotional experience, not just character emotions
- Consider pacing, tension, relief, and catharsis in your analysis

**METHODOLOGY:**
1. Read the entire story and identify natural emotional segments
2. For each segment, determine the dominant emotion and its intensity (1-10 scale)
3. Analyze transitions between emotional states
4. Synthesize the overall emotional tone and journey arc
5. Provide a sophisticated summary of the psychological experience

**High-Quality Example Analysis:**
- **Input Story Text:**
  \`\`\`
  Sarah stared at the letter, her hands trembling. The words blurred as tears filled her eyes. "Acceptance," it read. After years of rejection, her novel would finally be published. She called her mother immediately. "Mom, I did it. They said yes." Her mother's sobs of joy echoed through the phone.
  \`\`\`
- **Your Expert Analysis Output:**
  \`\`\`json
  {
    "overallTone": "Transformative Cathartic Joy",
    "segments": [
      {
        "text": "Sarah stared at the letter, her hands trembling.",
        "emotion": "Paralyzing Anticipatory Anxiety",
        "intensity": 9
      },
      {
        "text": "The words blurred as tears filled her eyes. 'Acceptance,' it read.",
        "emotion": "Overwhelming Revelatory Relief",
        "intensity": 10
      },
      {
        "text": "After years of rejection, her novel would finally be published.",
        "emotion": "Profound Vindication and Triumph",
        "intensity": 10
      },
      {
        "text": "She called her mother immediately. 'Mom, I did it. They said yes.'",
        "emotion": "Euphoric Connection and Sharing",
        "intensity": 9
      },
      {
        "text": "Her mother's sobs of joy echoed through the phone.",
        "emotion": "Transcendent Communal Joy",
        "intensity": 10
      }
    ],
    "summary": "This narrative orchestrates a masterful emotional catharsis, beginning with excruciating suspense that creates almost unbearable tension, then releasing it through layers of relief, vindication, and shared joy. The emotional architecture follows a classic 'pressure-release-transcendence' pattern that generates profound reader satisfaction. The progression from solitary anxiety to communal celebration amplifies the emotional impact through the universal human need for both achievement and connection. The story's psychological power lies in its ability to transform prolonged suffering into transcendent joy within moments."
  }
  \`\`\`

**Story Text to Analyze:**
{{{storyText}}}

Provide your expert psychological analysis of this story's emotional journey:`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
```

---

## 📋 PHASE 7: Import Registration

### Current dev.ts State
*Location: `/workspaces/VividVoice/src/ai/dev.ts`*

**Current imports:** Already has imports for all existing flows including `analyze-emotional-tone.ts`

### 🎯 TASK 7: Register New Flow in dev.ts
**Action Required**: Add import for the NEW emotional story tone flow

**Exact import to add after the existing emotional tone import:**
```typescript
import '@/ai/flows/analyze-emotional-story-tone.ts';
```

---

## 📋 PHASE 8: Final Verification

### 🎯 TASK 8: No Additional Changes Needed
**Status**: The main page.tsx already has all the necessary infrastructure. The EmotionalToneAnalysis component is self-contained and gets the storyText prop from DialogueEditor.

**No changes required to page.tsx** - the existing architecture supports the new emotional tone feature without modifications.

---

## ✅ VERIFICATION CHECKLIST

After completing all tasks, verify:

1. **Build Success**: `npm run build` completes without errors
2. **Type Check**: `npm run typecheck` passes
3. **Lint Check**: `npm run lint` passes  
4. **Test Success**: `npm run test` passes
5. **Functionality**: 
   - Story can be submitted
   - DialogueEditor shows all tabs including "Emotional Tone"
   - Emotional Tone analysis works
   - UI displays correctly with current theme

---

## 🚨 CRITICAL NOTES

1. **Follow PR #6 Standards**: All new AI flows must include detailed role-playing personas, explicit instructions, schema references, and high-quality few-shot examples
2. **Theme Compatibility**: Ensure all new components work with existing themes (especially Skeptical Wombat)
3. **Error Handling**: All new actions must include robust try/catch error handling
4. **TypeScript**: Maintain strict type safety throughout

---

**🎯 FINAL GOAL**: Merge all 3 PR features into the current branch so it can be safely merged to master with full functionality from all PRs.
