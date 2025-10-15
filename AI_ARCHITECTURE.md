# VividVoice AI Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Technology Stack](#technology-stack)
4. [AI Flow System](#ai-flow-system)
5. [Data Flow & Information Passing](#data-flow--information-passing)
6. [Schema & Type System](#schema--type-system)
7. [AI Tools Reference](#ai-tools-reference)
8. [Orchestration Layer](#orchestration-layer)
9. [Example Workflow](#example-workflow)

---

## Overview

VividVoice is an AI-powered story analysis and performance platform that transforms written stories into immersive audio experiences with multi-character voice acting, comprehensive literary analysis, and creative writing tools. The application uses a sophisticated AI architecture built on Google's Genkit framework to orchestrate multiple specialized AI agents, each designed to perform specific tasks in story analysis and enhancement.

### Key Capabilities
- **Story Parsing & Character Extraction**: Automatically identifies characters, dialogue, and narrative elements
- **Multi-Voice TTS Generation**: Creates distinct voice performances for each character
- **Literary Analysis**: Scans for devices, tropes, pacing, and subtext
- **Writing Enhancement**: Provides suggestions for show-don't-tell, consistency checks, and creative inversions
- **Creative Tools**: Character chat, perspective shifting, and unreliable narrator modes
- **Visual Generation**: AI-generated character portraits

---

## Core Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (React/Next.js)            │
│  - UI Components                                             │
│  - User Interactions                                         │
│  - State Management                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Server Actions ('use server')
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Orchestration Layer (actions.ts)               │
│  - getFullStoryAnalysis()                                    │
│  - getParsedStory()                                          │
│  - getCharacterPortraits()                                   │
│  - generateAudio()                                           │
│  - Tool-specific actions                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Calls AI Flows
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Flow Layer (Genkit Flows)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Parse        │  │ Literary     │  │ Consistency  │      │
│  │ Dialogue     │  │ Devices      │  │ Guardian     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Trope        │  │ Show/Tell    │  │ Subtext      │      │
│  │ Inverter     │  │ Converter    │  │ Analyzer     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ... and 15+ more specialized flows                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Prompts & Schemas
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Google AI (Gemini Models)                       │
│  - gemini-2.5-flash-lite (text generation)                  │
│  - gemini-2.0-flash-preview (image generation)              │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each AI flow handles a single, well-defined task
2. **Type Safety**: Strict TypeScript types with Zod schemas for validation
3. **Server-Side Execution**: All AI operations run server-side (`'use server'`)
4. **Parallel Processing**: Independent analyses run concurrently for performance
5. **Error Resilience**: Individual flow failures don't crash the entire pipeline
6. **Single Source of Truth**: Shared schemas in `schemas.ts` ensure consistency

---

## Technology Stack

### AI Framework
- **Genkit** (v1.13.0): Google's AI application framework
  - Flow orchestration
  - Prompt management
  - Type-safe AI interactions
  - Built-in observability

### AI Models
- **Google AI / Gemini 2.5 Flash Lite**: Primary text generation model
  - Fast inference
  - Cost-effective
  - Structured output support
- **Gemini 2.0 Flash Preview**: Image generation for character portraits

### Supporting Technologies
- **Zod**: Schema validation and type inference
- **TypeScript**: Type safety across the application
- **Next.js Server Actions**: Secure server-side execution
- **Firebase**: Data persistence (optional)
- **LangChain**: Advanced AI patterns (RAG, vector stores, text splitting)
  - Used in Character Chat for semantic search
  - Provides document loaders and text splitters
- **FAISS**: Fast vector similarity search (via LangChain)
  - Enables efficient semantic search in character conversations
- **Google Embeddings**: text-embedding-004 model
  - Creates vector representations of text for semantic search

---

## AI Flow System

### What is a Genkit Flow?

A **flow** in Genkit is a typed, observable AI workflow that:
- Takes structured input (validated by Zod schema)
- Executes AI prompts or other logic
- Returns structured output (validated by Zod schema)
- Can be composed with other flows
- Automatically handles errors and logging

### Flow Anatomy

Every AI flow in VividVoice follows this pattern:

```typescript
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SomeSchema } from '@/ai/schemas';

// 1. Define Input Schema
const InputSchema = z.object({
  storyText: z.string().describe('The story text to analyze'),
});
export type Input = z.infer<typeof InputSchema>;

// 2. Define Output Schema
const OutputSchema = z.object({
  results: z.array(SomeSchema),
});
export type Output = z.infer<typeof OutputSchema>;

// 3. Define the Flow
const myFlow = ai.defineFlow(
  {
    name: 'myFlowName',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    // 4. Define the Prompt
    const prompt = ai.definePrompt({
      name: 'myPromptName',
      input: { schema: InputSchema },
      output: { schema: OutputSchema },
      prompt: `You are an expert. Analyze: {{storyText}}`,
    });
    
    // 5. Execute and Return
    const { output } = await prompt(input);
    return output!;
  }
);

// 6. Export Public Function
export async function myFunction(input: Input): Promise<Output> {
  return myFlow(input);
}
```

---

## Data Flow & Information Passing

### The Story Analysis Pipeline

When a user submits a story, here's how information flows through the system:

#### Step 1: Story Submission
```
User Input (Raw Story Text)
    ↓
UI Component (StoryInput.tsx)
    ↓
Server Action: getFullStoryAnalysis(storyText)
```

#### Step 2: Initial Parsing
```
getFullStoryAnalysis()
    ↓
Calls: getParsedStory(storyText)
    ↓
Flow: parseDialogueFlow
    ↓
Prompt: "Parse this story, identify characters and dialogue..."
    ↓
Returns: {
  segments: DialogueSegment[],  // Each line with character, dialogue, emotion
  characters: Character[]        // Each character with name, description, voiceId
}
```

**What gets extracted:**
- **Characters**: Name, physical/personality description, assigned voice ID
- **Segments**: Character name, dialogue text, inferred emotion for each line
- **Voice Assignment**: AI acts as a "casting director" to assign unique voices

#### Step 3: Emotional Analysis
```
For each segment (in parallel):
    ↓
analyzeEmotionalToneFlow({
  dialogue: segment.dialogue,
  context: surrounding segments  // Provides context for accurate emotion detection
})
    ↓
Returns: { emotion: "Happy" | "Sad" | "Angry" | ... }
    ↓
Segments updated with refined emotions
```

#### Step 4: Parallel Analysis Suite
```
Promise.allSettled([
  getCharacterPortraits(characters),
  analyzeDialogueDynamicsFlow({ storyText }),
  analyzeLiteraryDevicesFlow({ storyText }),
  analyzeStoryPacingFlow({ storyText }),
  invertTropesFlow({ storyText }),
  getShowDontTellSuggestionsFlow({ storyText }),
  findInconsistenciesFlow({ storyText }),
  analyzeSubtextFlow({ storyText }),
])
```

**All analyses receive:**
- **Input**: Original story text (and/or parsed data)
- **Processing**: Independent AI analysis via specialized prompts
- **Output**: Structured results per schema

**Results aggregated:**
```javascript
{
  segments: DialogueSegment[],           // With emotions
  characters: Character[],               // With descriptions and voices
  characterPortraits: CharacterPortrait[], // AI-generated images
  dialogueDynamics: DialogueDynamics,    // Power balance, pacing metrics
  literaryDevices: { devices: LiteraryDevice[] },
  pacing: { segments: PacingSegment[] },
  tropes: { tropes: Trope[] },
  showDontTellSuggestions: { suggestions: ShowDontTellSuggestion[] },
  consistencyIssues: { issues: ConsistencyIssue[] },
  subtextAnalyses: { analyses: SubtextAnalysis[] },
  soundEffects: SoundEffectWithUrl[] | null,
  errors: Record<string, string>        // Tracks which flows failed
}
```

#### Step 5: Return to UI
```
Orchestration Layer (actions.ts)
    ↓
Returns complete analysis object
    ↓
UI Components render results
    ↓
User sees analyzed story with all insights
```

### Information Flow Between Tools

Each AI tool receives and processes information differently:

| Tool | Input | Processing | Output |
|------|-------|------------|--------|
| **Parse Dialogue** | Raw story text | Identifies characters, assigns voices, segments dialogue | Characters + Segments |
| **Emotional Tone** | Single dialogue line + context | Analyzes emotional content | Emotion label |
| **Literary Devices** | Full story text | Scans for metaphors, similes, etc. | Device + Quote + Explanation |
| **Dialogue Dynamics** | Full story text | Counts turns, words, questions; identifies power plays | Power balance metrics |
| **Pacing** | Full story text | Segments into dialogue/narration blocks | Word counts + pacing feel |
| **Trope Inverter** | Full story text | Identifies clichés, suggests subversions | Trope + Quote + Inversion |
| **Show/Tell** | Full story text | Finds "telling" sentences | Original + Showing rewrite |
| **Consistency Guardian** | Full story text | Scans for contradictions | Issue + Quote + Explanation |
| **Subtext Analyzer** | Full story text | Reveals hidden meanings | Dialogue + Literal + Subtext |
| **Character Portraits** | Character descriptions | Generates photorealistic portraits | Image data URIs |
| **Character Chat** | Character data + user message | Roleplays as character | Character response |
| **Unreliable Narrator** | Story + bias parameters | Rewrites narration with bias | Biased story text |
| **Perspective Shift** | Story + character + role | Rewrites from new POV | Rewritten summary |

---

## Schema & Type System

### Shared Schemas (`src/ai/schemas.ts`)

All data structures are defined once in `schemas.ts` and shared across:
- AI flows (for validation)
- Server actions (for type safety)
- UI components (for rendering)

#### Core Schemas

**Character Schema**
```typescript
CharacterSchema = z.object({
  name: z.string(),
  description: z.string(),  // Detailed personality, appearance, speaking style
  voiceId: z.string().optional()  // AI-assigned voice ID
})
```

**Dialogue Segment Schema**
```typescript
DialogueSegmentSchema = z.object({
  character: z.string(),    // Name or "Narrator"
  dialogue: z.string(),     // The actual text
  emotion: z.string()       // e.g., "Happy", "Tense", "Sarcastic"
})
```

**Literary Device Schema**
```typescript
LiteraryDeviceSchema = z.object({
  device: z.string(),       // e.g., "Metaphor", "Foreshadowing"
  quote: z.string(),        // Exact quote from text
  explanation: z.string()   // How the device is used
})
```

**Consistency Issue Schema**
```typescript
ConsistencyIssueSchema = z.object({
  issue: z.string(),        // Description of the problem
  quote: z.string(),        // Where it occurs
  explanation: z.string()   // Why it's inconsistent
})
```

**Subtext Analysis Schema**
```typescript
SubtextAnalysisSchema = z.object({
  dialogue: z.string(),     // The line spoken
  character: z.string(),    // Who said it
  literalMeaning: z.string(),  // Surface meaning
  subtext: z.string(),      // Hidden meaning
  explanation: z.string()   // Contextual clues
})
```

### Type Inference

Schemas automatically generate TypeScript types:

```typescript
export type Character = z.infer<typeof CharacterSchema>;
export type DialogueSegment = z.infer<typeof DialogueSegmentSchema>;
// etc.
```

This ensures:
- **Compile-time safety**: TypeScript catches type errors
- **Runtime validation**: Zod validates AI outputs
- **Single source of truth**: Change schema once, types update everywhere

---

## AI Tools Reference

VividVoice includes 18 specialized AI tools, each designed for a specific aspect of story analysis or enhancement:

### Foundational Tools
1. **Parse Dialogue** - Extracts characters, segments dialogue, assigns voices
2. **Analyze Emotional Tone** - Refines emotional labels for dialogue
3. **Generate Character Portraits** - Creates AI-generated character images

### Literary Analysis Tools
4. **Analyze Literary Devices** - Identifies metaphors, similes, foreshadowing, etc.
5. **Analyze Dialogue Dynamics** - Reveals power balance and conversational patterns
6. **Analyze Pacing** - Visualizes story rhythm (dialogue vs narration)
7. **Analyze Subtext** - Uncovers hidden meanings in dialogue
8. **Analyze Character Archetypes** - Identifies Jungian/Campbell archetypes
9. **Analyze Plot Structure** - Determines narrative framework (3-act, Hero's Journey, etc.)

### Creative Writing Tools
10. **Trope Inverter** - Identifies clichés and suggests subversions
11. **Show, Don't Tell Converter** - Transforms "telling" into "showing"
12. **Consistency Guardian** - Scans for continuity errors
13. **Compare to Classics** - Finds similarities/differences with classic literature
14. **Skeptical Wombat** - Provides witty, honest creative feedback

### Interactive & Experimental Tools
15. **Character Chat** - Interview characters using RAG for context
16. **Unreliable Narrator** - Rewrites story with narrator bias
17. **Perspective Shifter** - Rewrites from different character's viewpoint

### Audio Generation
18. **Multi-Voice TTS** - Generates full audio performance with multiple voices

---

### 1. Parse Dialogue (`parse-dialogue.ts`)

**Purpose**: The foundational tool that transforms raw story text into structured data.

**How it works:**
1. AI reads entire story to understand plot and tone
2. Identifies all unique characters (including Narrator)
3. For each character:
   - Creates detailed description (personality, motivations, speaking style, appearance)
   - Selects appropriate voice from available TTS voices
4. Segments story chronologically into dialogue/narration
5. Infers emotion for each segment based on context

**Input**: Raw story text
**Output**: Characters with descriptions/voices + segmented dialogue with emotions

**Key Prompt Instructions:**
- Act as casting director to assign voices
- Provide rich character descriptions for downstream tools
- Maintain chronological order
- Infer emotions from context, not just literal words

---

### 2. Analyze Emotional Tone (`analyze-emotional-tone.ts`)

**Purpose**: Refines emotional labels for dialogue segments.

**How it works:**
1. Receives single dialogue line
2. Receives context (2 preceding + 2 following segments)
3. Analyzes character personality from description
4. Determines nuanced emotion label

**Input**: Dialogue line + surrounding context
**Output**: Emotion string (e.g., "Anxious", "Relieved", "Sarcastic")

**Used for**: Guiding TTS emotional expression

---

### 3. Generate Character Portraits (`generate-character-portraits.ts`)

**Purpose**: Creates photorealistic character images.

**How it works:**
1. Takes character descriptions from parsing step
2. For each character (except Narrator):
   - Calls Gemini 2.0 image generation model
   - Prompt: "Generate photorealistic, cinematic portrait based on: [description]"
   - Returns data URI of generated image
3. Filters out failures and returns successful portraits

**Input**: Array of characters with descriptions
**Output**: Array of { name, portraitDataUri }

---

### 4. Analyze Literary Devices (`analyze-literary-devices.ts`)

**Purpose**: Scans text for literary/rhetorical devices.

**How it works:**
1. AI reads story as literary expert
2. Identifies instances of devices (metaphor, simile, personification, foreshadowing, irony, alliteration, etc.)
3. For each device found:
   - Names the device
   - Quotes the exact text
   - Explains how it's used and its effect

**Input**: Full story text
**Output**: Array of { device, quote, explanation }

**Example Output:**
```json
{
  "device": "Personification",
  "quote": "The wind whispered warnings",
  "explanation": "The wind is given human ability to 'whisper,' creating foreboding"
}
```

---

### 5. Analyze Dialogue Dynamics (`analyze-dialogue-dynamics.ts`)

**Purpose**: Reveals power dynamics and conversational patterns.

**How it works:**
1. Counts metrics for each character:
   - Dialogue turns (how often they speak)
   - Word count (how much they say)
   - Questions asked
   - Assertions made
2. Identifies "power plays" (tactical conversational moves):
   - Dismissive echoes
   - Leading questions
   - Interruptions
   - Topic changes
3. Calculates pacing (words per turn per character)
4. Generates summary of who drives conversation

**Input**: Full story text
**Output**: Power balance metrics, pacing data, summary

**Used for**: Understanding character relationships and conversation control

---

### 6. Analyze Pacing (`analyze-pacing.ts`)

**Purpose**: Visualizes story rhythm and flow.

**How it works:**
1. Divides text into contiguous blocks of dialogue vs. narration
2. For each block:
   - Classifies as "Dialogue" or "Narration"
   - Counts words
   - Determines "pacing feel": Action, Reflection, Exposition, or Tension
3. Returns ordered segments for visualization

**Input**: Full story text
**Output**: Array of { type, wordCount, pacingFeel }

**Used for**: Identifying pacing issues (too much exposition, rushed action, etc.)

---

### 7. Trope Inverter (`trope-inverter.ts`)

**Purpose**: Identifies clichés and suggests creative subversions.

**How it works:**
1. AI acts as subversive literary critic
2. Scans for common tropes (Chosen One, Damsel in Distress, Mentor, Love Triangle, etc.)
3. For each trope:
   - Names the trope
   - Quotes exemplifying text
   - Suggests creative inversion/deconstruction

**Input**: Full story text
**Output**: Array of { trope, quote, inversionSuggestion }

**Example:**
```json
{
  "trope": "The Chosen One",
  "quote": "You are destined to defeat the Dark Lord",
  "inversionSuggestion": "Reveal the prophecy was fabricated by a manipulative mentor using the hero as a pawn"
}
```

---

### 8. Show, Don't Tell Converter (`show-dont-tell.ts`)

**Purpose**: Identifies "telling" and provides "showing" alternatives.

**How it works:**
1. AI scans narrator text for "telling" sentences (e.g., "She was angry")
2. For each telling sentence:
   - Quotes original
   - Rewrites as full paragraph showing through action, sensory detail, dialogue, or internal thought
3. Optional: Can emulate specific author's style (Hemingway, Austen, etc.)

**Input**: Story text, optional style
**Output**: Array of { tellingSentence, showingSuggestion }

**Example:**
```json
{
  "tellingSentence": "She was very angry.",
  "showingSuggestion": "Her jaw clenched. She slammed the cup down, coffee sloshing onto the counter. 'Get. Out.' Her voice was quiet, controlled, but her hands trembled."
}
```

---

### 9. Consistency Guardian (`consistency-guardian.ts`)

**Purpose**: Scans for continuity errors and contradictions.

**How it works:**
1. AI acts as meticulous continuity editor
2. Reads entire text looking for inconsistencies in:
   - Character details (eye color changes, height, backstory)
   - Plot holes (character knows impossible information, illogical event order)
   - Setting details (weather, time of day, location)
   - Object/magic rules (abilities change without explanation)
3. For each issue:
   - Describes the problem
   - Quotes where it appears
   - Explains why it's inconsistent

**Input**: Full story text
**Output**: Array of { issue, quote, explanation }

---

### 10. Subtext Analyzer (`analyze-subtext.ts`)

**Purpose**: Reveals hidden meanings in dialogue.

**How it works:**
1. AI analyzes dialogue lines for underlying emotion/meaning
2. For interesting lines:
   - States literal meaning
   - Reveals subtext (unspoken emotion/motivation)
   - Explains contextual clues that reveal subtext

**Input**: Full story text
**Output**: Array of { dialogue, character, literalMeaning, subtext, explanation }

**Example:**
```json
{
  "dialogue": "I'm fine.",
  "character": "Sarah",
  "literalMeaning": "Sarah is okay.",
  "subtext": "Sarah is clearly not fine and wants someone to notice.",
  "explanation": "Said after traumatic event, with short clipped response and context of her avoiding eye contact"
}
```

---

### 11. Character Chat (`character-chat.ts`)

**Purpose**: Interactive roleplay as story characters using RAG (Retrieval Augmented Generation).

**How it works:**
1. Receives character description and dialogue history from story
2. Creates vector embeddings of story text (chunked into 1000-char segments)
3. Caches vector store for performance (per character)
4. When user asks question:
   - Performs semantic search to find 3 most relevant story excerpts
   - Provides relevant context to AI along with character description
5. AI adopts character's personality, speaking style, and knowledge
6. Responds in-character based on actual story events
7. Conversation history maintained for context

**Advanced Features:**
- **Vector Search**: Uses Google's text-embedding-004 model with FAISS vector store
- **Context Filtering**: Prioritizes story chunks mentioning the character
- **In-Memory Caching**: Avoids re-embedding same story multiple times
- **RAG Pattern**: Grounds responses in actual story content

**Input**: Character data, conversation history, user message, full story text
**Output**: Character's response (informed by relevant story context)

**Used for**: Character development, exploring motivations, creative brainstorming

---

### 12. Unreliable Narrator (`unreliable-narrator.ts`)

**Purpose**: Rewrites story with narrator bias.

**How it works:**
1. User specifies starting and ending bias (e.g., "Admires hero" → "Jealous of hero")
2. AI rewrites narrator text (NOT dialogue) with evolving bias
3. Early narration reflects start bias
4. Later narration reflects end bias
5. Dialogue remains unchanged

**Input**: Story text + { startBias, endBias }
**Output**: Rewritten story with biased narration

**Bias Options:**
- Neutral
- Jealous of Main Character
- Secretly the Villain
- Admires Main Character
- Completely Unreliable
- Hides a Key Fact

---

### 13. Perspective Shifter (`shift-perspective.ts`)

**Purpose**: Rewrites story from different character's viewpoint in various formats.

**How it works:**
1. User selects character and role (Protagonist or Antagonist)
2. User selects format: summary, diaryEntry, letter, or policeStatement
3. AI reads full story from that character's perspective
4. Rewrites main events casting the character in the new role
5. Character's actions become heroic/justified (if protagonist) or reasonable from their POV
6. Other characters reframed accordingly
7. Output matches selected format (narrative style, diary tone, formal letter, etc.)

**Input**: Story text, character name, role, format
**Output**: Rewritten text from new perspective in specified format

**Example Formats:**
- **Summary**: Third-person narrative summary
- **Diary Entry**: "Dear Diary, today the so-called 'hero' attacked my home..."
- **Letter**: Formal letter explaining events
- **Police Statement**: Official statement format

---

### 14. Compare to Classics (`compare-to-classics.ts`)

**Purpose**: Identifies similarities/differences with classic literature.

**How it works:**
1. AI compares story to classic works
2. For each comparison:
   - Names classic story
   - Lists similarities
   - Lists differences

**Input**: Story text
**Output**: Array of { classicStory, similarities[], differences[] }

---

### 15. Skeptical Wombat (`skeptical-wombat.ts`)

**Purpose**: Provides witty, honest creative feedback.

**How it works:**
1. AI adopts persona of jaded but clever writing partner
2. Reads story
3. Provides dry, witty commentary on strengths/weaknesses
4. Doesn't pull punches but isn't cruel

**Input**: Story text
**Output**: Commentary string

**Used for**: Creative feedback with personality

---

### 16. Multi-Voice TTS (`generate-multi-voice-tts.ts`)

**Purpose**: Generates audio performance with character voices.

**How it works:**
1. Takes segments with character assignments and emotions
2. For each segment:
   - Uses character's assigned voiceId
   - Applies emotional styling
   - Generates audio
3. Concatenates into single audio stream
4. Returns transcript with word-level timing

**Input**: Segments with characters, dialogue, emotions
**Output**: Audio file + word-level transcript with timestamps

**Note**: May use Google TTS or ElevenLabs depending on configuration

---

### 17. Analyze Character Archetypes (`analyze-character-archetypes.ts`)

**Purpose**: Identifies Jungian/Campbell character archetypes in the story.

**How it works:**
1. AI reads story and identifies all characters
2. For each character:
   - Determines their archetype (Hero, Mentor, Trickster, Shadow, Herald, etc.)
   - Provides justification based on their role, actions, and development
3. Returns structured archetype analysis

**Input**: Full story text
**Output**: Array of { characterName, archetype, justification }

**Common Archetypes:**
- Hero: Protagonist on a journey
- Mentor: Wise guide/teacher
- Trickster: Comic relief or chaos agent
- Shadow: Dark reflection of hero
- Herald: Brings call to adventure
- Threshold Guardian: Tests hero's resolve

**Used for**: Understanding story structure and character roles

---

### 18. Analyze Plot Structure (`analyze-plot-structure.ts`)

**Purpose**: Identifies the narrative structure framework used in the story.

**How it works:**
1. AI analyzes story's plot progression
2. Identifies which structure is used:
   - Freytag's Pyramid (Exposition → Rising Action → Climax → Falling Action → Resolution)
   - Three-Act Structure (Setup → Confrontation → Resolution)
   - Hero's Journey
   - Other narrative frameworks
3. Provides analysis of how well the story fits the structure

**Input**: Full story text
**Output**: { plotStructure: string, analysis: string }

**Used for**: Understanding narrative arc and pacing decisions

---

## Orchestration Layer

### The Role of `actions.ts`

The `src/lib/actions.ts` file acts as the **orchestration hub** that:

1. **Exposes Server Actions**: Functions marked with `'use server'` that UI can call
2. **Sequences AI Flows**: Coordinates the order of operations
3. **Manages Dependencies**: Ensures data from one flow feeds into another
4. **Handles Errors**: Uses `Promise.allSettled()` to prevent cascading failures
5. **Aggregates Results**: Combines outputs from multiple flows
6. **Provides Type Safety**: Re-exports types for client components

### Key Orchestration Function: `getFullStoryAnalysis()`

This is the **main entry point** for story processing:

```typescript
export async function getFullStoryAnalysis(storyText: string) {
  // 1. Validation
  if (!storyText.trim()) throw new Error('Story text cannot be empty');
  
  // 2. Parse foundational data (MUST happen first)
  const parsedStory = await getParsedStory(storyText);
  const { segments, characters } = parsedStory;
  
  // 3. Enhance segments with refined emotions (depends on parsing)
  const segmentsWithEmotions = await Promise.all(
    segments.map(async (segment, index) => {
      const context = getContext(segments, index);
      const { emotion } = await analyzeEmotionalToneFlow({ dialogue, context });
      return { ...segment, emotion };
    })
  );
  
  // 4. Run independent analyses in parallel (all receive original storyText)
  const results = await Promise.allSettled([
    getCharacterPortraits(characters),      // Needs: characters
    analyzeDialogueDynamicsFlow({ storyText }), // Needs: storyText
    analyzeLiteraryDevicesFlow({ storyText }),  // Needs: storyText
    analyzeStoryPacingFlow({ storyText }),      // Needs: storyText
    invertTropesFlow({ storyText }),            // Needs: storyText
    // ... more analyses
  ]);
  
  // 5. Aggregate results, track errors
  return {
    segments: segmentsWithEmotions,
    characters,
    characterPortraits: results[0].value || [],
    dialogueDynamics: results[1].value || {},
    // ... etc
    errors: { /* which flows failed */ }
  };
}
```

### Why This Architecture?

**Sequential Dependencies:**
- Parsing MUST happen first (provides characters and segments)
- Emotional analysis depends on parsing (needs segments and context)

**Parallel Execution:**
- Most analyses are independent (all read same storyText)
- Running in parallel speeds up total processing time
- `Promise.allSettled()` means one failure doesn't crash everything

**Error Handling:**
- Individual tool failures tracked in `errors` object
- UI can show partial results if some tools fail
- Graceful degradation instead of complete failure

---

## Example Workflow

### Complete User Journey

Let's trace a story through the entire system:

**User Story:**
```
Narrator: The detective entered the dark room.
Detective Miles: This doesn't look good.
Narrator: The suspect smiled coldly.
Suspect: You'll never prove anything, Detective.
```

---

**Step 1: User submits to UI**
```javascript
// Component calls server action
const results = await getFullStoryAnalysis(storyText);
```

---

**Step 2: Parse Dialogue**
```javascript
// parseDialogueFlow executes
{
  characters: [
    {
      name: "Narrator",
      description: "Neutral third-person narrator",
      voiceId: "en-US-Standard-D"
    },
    {
      name: "Detective Miles",
      description: "A weary, cynical detective. Middle-aged, gravelly voice. Speaks in short, clipped sentences. Seen too much.",
      voiceId: "en-US-Standard-J"
    },
    {
      name: "Suspect",
      description: "Cold, confident, possibly sociopathic. Speaks slowly and deliberately. Enjoys psychological games.",
      voiceId: "en-US-Standard-I"
    }
  ],
  segments: [
    { character: "Narrator", dialogue: "The detective entered the dark room.", emotion: "Tense" },
    { character: "Detective Miles", dialogue: "This doesn't look good.", emotion: "Worried" },
    { character: "Narrator", dialogue: "The suspect smiled coldly.", emotion: "Ominous" },
    { character: "Suspect", dialogue: "You'll never prove anything, Detective.", emotion: "Confident" }
  ]
}
```

---

**Step 3: Emotional Refinement**
```javascript
// For Detective Miles' line:
analyzeEmotionalToneFlow({
  dialogue: "This doesn't look good.",
  context: "Narrator: The detective entered the dark room.\nDetective Miles: This doesn't look good.\nNarrator: The suspect smiled coldly."
})
// Returns: { emotion: "Apprehensive" } (more nuanced than initial "Worried")
```

---

**Step 4: Parallel Analyses**

**Character Portraits:**
```javascript
// For Detective Miles:
generateCharacterPortraits({ characters })
// Generates image of "weary, cynical detective, middle-aged, gravelly voice"
// Returns: { name: "Detective Miles", portraitDataUri: "data:image/png;base64,..." }
```

**Literary Devices:**
```javascript
analyzeLiteraryDevicesFlow({ storyText })
// Returns:
{
  devices: [
    {
      device: "Imagery",
      quote: "The detective entered the dark room",
      explanation: "The darkness creates atmosphere of danger and uncertainty"
    },
    {
      device: "Adverb as Characterization",
      quote: "smiled coldly",
      explanation: "The adverb 'coldly' reveals the suspect's emotionless, calculating nature"
    }
  ]
}
```

**Dialogue Dynamics:**
```javascript
analyzeDialogueDynamicsFlow({ storyText })
// Returns:
{
  powerBalance: [
    {
      character: "Detective Miles",
      metrics: { dialogueTurns: 1, wordCount: 5, questionsAsked: 0, assertionsMade: 1 },
      powerPlays: []
    },
    {
      character: "Suspect",
      metrics: { dialogueTurns: 1, wordCount: 6, questionsAsked: 0, assertionsMade: 1 },
      powerPlays: [
        {
          tactic: "Direct Challenge",
          quote: "You'll never prove anything, Detective."
        }
      ]
    }
  ],
  pacing: { overallWordsPerTurn: 5.5, characterPacing: [...] },
  summary: "The suspect holds conversational power through direct challenge. Detective is reactive."
}
```

**Subtext:**
```javascript
analyzeSubtextFlow({ storyText })
// Returns:
{
  analyses: [
    {
      dialogue: "This doesn't look good.",
      character: "Detective Miles",
      literalMeaning: "The situation is unfavorable.",
      subtext: "The detective is out of his depth and concerned he won't solve the case.",
      explanation: "The understatement and dark setting suggest deeper anxiety about his capabilities."
    }
  ]
}
```

---

**Step 5: Return to UI**
```javascript
// UI receives complete analysis
{
  segments: [...], // with refined emotions
  characters: [...], // with descriptions and voices
  characterPortraits: [...], // with generated images
  dialogueDynamics: {...}, // power balance analysis
  literaryDevices: { devices: [...] },
  pacing: { segments: [...] },
  tropes: { tropes: [] }, // none found in short sample
  showDontTellSuggestions: { suggestions: [...] },
  consistencyIssues: { issues: [] }, // none found
  subtextAnalyses: { analyses: [...] },
  soundEffects: null,
  errors: {} // all succeeded
}
```

---

**Step 6: User Interacts with Tools**

**Generate Audio:**
```javascript
generateMultiVoiceTTS({ segments: segmentsWithEmotions })
// Uses voiceId from each character
// Applies emotion to TTS
// Returns audio file + word-level timing
```

**Chat with Character:**
```javascript
characterChat({
  character: characters.find(c => c.name === "Detective Miles"),
  conversationHistory: [],
  userMessage: "Why don't you trust the suspect?"
})
// AI responds as Detective Miles:
// "Trust? Kid, I stopped trusting people the day I found my partner's body. This one's smile... too calm. Too practiced. Guilty people don't smile like that unless they think they're smarter than you."
```

---

## Summary

The VividVoice AI architecture is a **modular, type-safe, scalable system** that:

1. **Separates concerns**: Each flow has one job
2. **Ensures type safety**: Zod schemas validate all data
3. **Enables parallel processing**: Independent analyses run concurrently
4. **Handles errors gracefully**: Individual failures don't crash the system
5. **Provides rich functionality**: 15+ specialized AI tools
6. **Maintains single source of truth**: Shared schemas across layers

Information flows from **raw text** → **parsed structure** → **parallel analyses** → **aggregated insights** → **UI presentation**, with each layer building on the previous one while maintaining clean separation and type safety.

The result is a powerful, maintainable AI application that transforms stories into rich, multi-dimensional experiences.
