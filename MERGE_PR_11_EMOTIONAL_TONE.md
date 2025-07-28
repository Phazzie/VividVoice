# 🎯 AI Agent: Merge PR #11 - Emotional Tone Analysis Feature

## Mission
Add the complete "Emotional Tone Analysis" feature from PR #11 (`ui-audit-with-auto-emotion`) to the current branch (`feature/prompt-audit-and-improvements`).

## What This PR Adds
A new tab in DialogueEditor that analyzes the emotional journey of an entire story, providing:
- Overall emotional tone assessment
- Segment-by-segment emotional breakdown with intensity scoring
- Visual emotional journey with color-coded intensity indicators
- Sophisticated psychological analysis summary

---

## 📋 IMPLEMENTATION TASKS

### Task 1: Add EmotionalToneSchema
**File:** `/workspaces/VividVoice/src/ai/schemas.ts`
**Action:** Add schema at the end of the file

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

### Task 2: Create AI Flow for Story-Level Emotional Analysis
**File:** `/workspaces/VividVoice/src/ai/flows/analyze-emotional-story-tone.ts` (NEW FILE)
**Action:** Create complete AI flow with PSL-4 standards

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

### Task 3: Register New Flow
**File:** `/workspaces/VividVoice/src/ai/dev.ts`
**Action:** Add import after existing emotional tone import

```typescript
import '@/ai/flows/analyze-emotional-story-tone.ts';
```

### Task 4: Add Action Function
**File:** `/workspaces/VividVoice/src/lib/actions.ts`
**Action:** Add imports and function

**Add to imports:**
```typescript
import { analyzeEmotionalStoryTone as analyzeEmotionalStoryToneFlow } from '@/ai/flows/analyze-emotional-story-tone';
```

**Add to type imports section:**
```typescript
type EmotionalTone as ImportedEmotionalTone,
```

**Add to re-export section:**
```typescript
export type EmotionalTone = ImportedEmotionalTone;
```

**Add function at end of file:**
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

### Task 5: Create EmotionalToneAnalysis Component
**File:** `/workspaces/VividVoice/src/components/vivid-voice/EmotionalToneAnalysis.tsx` (NEW FILE)
**Action:** Create complete component

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

### Task 6: Add Tab to DialogueEditor
**File:** `/workspaces/VividVoice/src/components/vivid-voice/DialogueEditor.tsx`
**Action:** Add imports and new tab

**Add to imports at top:**
```tsx
import { Heart } from 'lucide-react';
import { EmotionalToneAnalysis } from '@/components/vivid-voice/EmotionalToneAnalysis';
```

**Add TabsTrigger after "perspective" tab:**
```tsx
<TabsTrigger value="emotional-tone" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Heart className="mr-2"/>Emotional Tone</TabsTrigger>
```

**Add TabsContent after "perspective" TabsContent:**
```tsx
<TabsContent value="emotional-tone" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
  <EmotionalToneAnalysis storyText={storyText} />
</TabsContent>
```

---

## ✅ VERIFICATION

After implementation, verify:
1. `npm run typecheck` passes
2. `npm run lint` passes  
3. `npm run build` succeeds
4. New "Emotional Tone" tab appears in DialogueEditor
5. Emotional analysis works and displays results properly
6. UI matches existing theme and design patterns

## 🎯 Expected Result
Users will have a new "Emotional Tone" tab in the DialogueEditor that provides sophisticated psychological analysis of their story's emotional journey, complete with visual intensity indicators and expert-level insights.