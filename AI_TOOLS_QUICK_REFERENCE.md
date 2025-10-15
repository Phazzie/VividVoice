# VividVoice AI Tools - Quick Reference Guide

This is a quick reference for all AI tools available in VividVoice. For detailed architecture documentation, see [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md).

## 🎭 Foundational Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Parse Dialogue** | Extracts characters & dialogue, assigns voices | Raw story text | Characters + segmented dialogue |
| **Analyze Emotional Tone** | Refines emotion labels for dialogue | Dialogue + context | Emotion label |
| **Generate Character Portraits** | Creates photorealistic character images | Character descriptions | Portrait images |

## 📚 Literary Analysis Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Analyze Literary Devices** | Finds metaphors, similes, foreshadowing | Full story | Devices + quotes + explanations |
| **Analyze Dialogue Dynamics** | Power balance & conversation patterns | Full story | Metrics + power plays |
| **Analyze Pacing** | Visualizes story rhythm | Full story | Segments with pacing feel |
| **Analyze Subtext** | Reveals hidden meanings | Full story | Literal + subtext meanings |
| **Analyze Character Archetypes** | Identifies Hero, Mentor, Trickster, etc. | Full story | Character + archetype + justification |
| **Analyze Plot Structure** | Determines 3-act, Hero's Journey, etc. | Full story | Structure + analysis |

## ✍️ Creative Writing Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Trope Inverter** | Identifies clichés, suggests subversions | Full story | Trope + quote + inversion |
| **Show, Don't Tell** | Transforms telling into showing | Full story + optional style | Original + rewritten paragraphs |
| **Consistency Guardian** | Scans for continuity errors | Full story | Issue + quote + explanation |
| **Compare to Classics** | Similarities with classic literature | Full story | Classic + similarities + differences |
| **Skeptical Wombat** | Witty, honest creative feedback | Full story | Commentary |

## 🎪 Interactive & Experimental Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Character Chat** | Interview characters (uses RAG) | Character + message + history | Character response |
| **Unreliable Narrator** | Rewrites with narrator bias | Story + bias range | Biased narration |
| **Perspective Shifter** | Rewrites from different POV | Story + character + role + format | Rewritten text |

## 🎵 Audio Generation

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Multi-Voice TTS** | Generates full audio performance | Segments + emotions | Audio + transcript |

---

## How Information Flows

```
1. User submits story
   ↓
2. Parse Dialogue extracts characters & segments
   ↓
3. Emotional Tone refines emotions
   ↓
4. All other tools analyze in parallel:
   - Character Portraits (needs: character descriptions)
   - Literary Devices (needs: full text)
   - Dialogue Dynamics (needs: full text)
   - Pacing (needs: full text)
   - Tropes (needs: full text)
   - Show/Tell (needs: full text)
   - Consistency (needs: full text)
   - Subtext (needs: full text)
   ↓
5. Results aggregated and returned to UI
```

## Common Use Cases

### 📖 For Writers
- **Check consistency**: Use Consistency Guardian to catch errors
- **Improve prose**: Use Show, Don't Tell Converter
- **Avoid clichés**: Use Trope Inverter
- **Understand subtext**: Use Subtext Analyzer
- **Get feedback**: Use Skeptical Wombat

### 🎬 For Storytelling
- **Hear your story**: Use Multi-Voice TTS
- **Visualize characters**: Use Character Portraits
- **Understand power dynamics**: Use Dialogue Dynamics

### 🧪 For Experimentation
- **Interview characters**: Use Character Chat
- **Rewrite perspectives**: Use Perspective Shifter
- **Add narrator bias**: Use Unreliable Narrator

### 📊 For Analysis
- **Find literary devices**: Use Literary Device Scanner
- **Analyze structure**: Use Plot Structure + Pacing
- **Identify archetypes**: Use Character Archetypes
- **Compare to classics**: Use Compare to Classics

## Technical Details

### Technology Stack
- **Framework**: Google Genkit
- **Model**: Gemini 2.5 Flash Lite (text) + Gemini 2.0 Flash Preview (images)
- **Vector Search**: FAISS + Google text-embedding-004 (for Character Chat)
- **Validation**: Zod schemas
- **Execution**: Next.js Server Actions

### File Locations
- **AI Flows**: `/src/ai/flows/*.ts`
- **Orchestration**: `/src/lib/actions.ts`
- **Schemas**: `/src/ai/schemas.ts`
- **Genkit Config**: `/src/ai/genkit.ts`

### Adding New Tools

To add a new AI tool:

1. Create flow file: `/src/ai/flows/my-new-tool.ts`
2. Define input/output schemas with Zod
3. Add schema to `/src/ai/schemas.ts` if reusable
4. Create prompt with `ai.definePrompt()`
5. Create flow with `ai.defineFlow()`
6. Export public function
7. Import and call in `/src/lib/actions.ts`
8. Add to UI component

Example minimal flow:
```typescript
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InputSchema = z.object({
  storyText: z.string(),
});

const OutputSchema = z.object({
  result: z.string(),
});

const myFlow = ai.defineFlow(
  {
    name: 'myFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'myPrompt',
      input: { schema: InputSchema },
      output: { schema: OutputSchema },
      prompt: `Analyze: {{storyText}}`,
    });
    const { output } = await prompt(input);
    return output!;
  }
);

export async function myTool(input: z.infer<typeof InputSchema>) {
  return myFlow(input);
}
```

---

## Performance Considerations

- **Parallel Processing**: Independent tools run concurrently
- **Caching**: Character Chat caches vector stores
- **Error Handling**: Individual tool failures don't crash entire pipeline
- **Graceful Degradation**: UI shows partial results if some tools fail

## Costs & Rate Limits

- Each AI call consumes API tokens
- Image generation (portraits) is more expensive than text
- Character Chat with RAG adds embedding costs
- Consider implementing request throttling for production

---

For complete architecture details, diagrams, and examples, see [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md).
