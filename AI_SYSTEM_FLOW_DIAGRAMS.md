# VividVoice AI System - Visual Flow Diagram

## Complete Story Processing Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SUBMITS STORY                          │
│                    "The detective entered..."                       │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 1: PARSE DIALOGUE FLOW                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ AI Task: Act as Casting Director                            │   │
│  │ • Identify all characters                                   │   │
│  │ • Create detailed descriptions (personality, appearance)    │   │
│  │ • Assign unique voice IDs                                   │   │
│  │ • Segment dialogue chronologically                          │   │
│  │ • Infer initial emotions from context                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Output: {                                                            │
│    characters: [                                                      │
│      { name: "Detective Miles",                                       │
│        description: "Weary, cynical, gravelly voice...",             │
│        voiceId: "en-US-Standard-J" },                                │
│      ...                                                              │
│    ],                                                                 │
│    segments: [                                                        │
│      { character: "Detective Miles",                                 │
│        dialogue: "This doesn't look good.",                          │
│        emotion: "Worried" },                                         │
│      ...                                                              │
│    ]                                                                  │
│  }                                                                    │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│              STEP 2: REFINE EMOTIONAL TONE (Sequential)             │
│  For each dialogue segment:                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ AI Task: Analyze Emotion with Context                       │   │
│  │ Input: Dialogue + 2 preceding + 2 following segments        │   │
│  │ Output: Refined emotion (e.g., "Worried" → "Apprehensive")  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│           STEP 3: PARALLEL ANALYSIS SUITE (All at Once)             │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   Character     │  │    Literary     │  │    Dialogue     │    │
│  │   Portraits     │  │    Devices      │  │    Dynamics     │    │
│  │                 │  │                 │  │                 │    │
│  │ Generate AI     │  │ Find metaphors  │  │ Analyze power   │    │
│  │ images for      │  │ similes, etc.   │  │ balance, word   │    │
│  │ each character  │  │                 │  │ counts, tactics │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │     Pacing      │  │     Tropes      │  │   Show/Tell     │    │
│  │                 │  │                 │  │                 │    │
│  │ Dialogue vs     │  │ Find clichés,   │  │ Find "telling"  │    │
│  │ narration flow  │  │ suggest twists  │  │ suggest showing │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  Consistency    │  │    Subtext      │  │   Archetypes    │    │
│  │                 │  │                 │  │                 │    │
│  │ Scan for errors │  │ Hidden meanings │  │ Hero, Mentor    │    │
│  │ contradictions  │  │ in dialogue     │  │ Shadow, etc.    │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                       │
│  All tools receive: Original story text + character data             │
│  All tools run: Independently, in parallel                           │
│  Error handling: Promise.allSettled() - failures don't cascade      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STEP 4: AGGREGATE RESULTS                         │
│                                                                       │
│  Combine all outputs into single response:                           │
│  {                                                                    │
│    segments: [...], // with refined emotions                         │
│    characters: [...], // with descriptions and voices                │
│    characterPortraits: [...], // AI-generated images                 │
│    literaryDevices: {...}, // devices found                          │
│    dialogueDynamics: {...}, // power balance data                    │
│    pacing: {...}, // rhythm analysis                                 │
│    tropes: {...}, // clichés and inversions                          │
│    showDontTellSuggestions: {...}, // writing improvements           │
│    consistencyIssues: {...}, // errors found                         │
│    subtextAnalyses: {...}, // hidden meanings                        │
│    errors: {...} // which tools failed, if any                       │
│  }                                                                    │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 5: RETURN TO UI                             │
│                                                                       │
│  UI Components render:                                               │
│  • Text viewer with highlighted segments                             │
│  • Character portrait gallery                                        │
│  • Audio player with TTS controls                                    │
│  • Analysis tabs (devices, pacing, tropes, etc.)                     │
│  • Interactive tools (character chat, perspective shift)             │
└─────────────────────────────────────────────────────────────────────┘
```

## Interactive Tools Flow (On-Demand)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHARACTER CHAT (RAG-based)                     │
│                                                                       │
│  User asks: "Why don't you trust the suspect?"                       │
│                          ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Create/retrieve vector store from story text             │   │
│  │    • Chunk text into 1000-char segments                      │   │
│  │    • Generate embeddings (text-embedding-004)                │   │
│  │    • Cache in memory for performance                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 2. Semantic search                                           │   │
│  │    • Embed user question                                     │   │
│  │    • Find 3 most relevant story excerpts                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 3. Generate response as character                           │   │
│  │    • Use character description as "actor's brief"            │   │
│  │    • Provide relevant story context                          │   │
│  │    • Include conversation history                            │   │
│  │    • Respond in-character                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          ▼                                            │
│  Character responds: "Trust? Kid, I stopped trusting people..."      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     UNRELIABLE NARRATOR MODE                        │
│                                                                       │
│  User selects: startBias = "Admires Hero"                            │
│                endBias = "Jealous of Hero"                            │
│                          ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ AI Task: Rewrite narrator text with evolving bias           │   │
│  │ • Early story: "The hero stood tall, courageous..."          │   │
│  │ • Late story: "The hero grabbed the reward greedily..."      │   │
│  │ • Dialogue remains unchanged                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PERSPECTIVE SHIFTER                            │
│                                                                       │
│  User selects: character = "The Dragon"                              │
│                role = "Protagonist"                                   │
│                format = "diaryEntry"                                  │
│                          ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ AI Task: Rewrite from dragon's POV as diary entry           │   │
│  │ Output: "Dear Diary, another human interrupted my nap..."    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Schema Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SHARED SCHEMAS (schemas.ts)                   │
│                                                                       │
│  All data structures defined once with Zod:                          │
│                                                                       │
│  CharacterSchema ──────────┐                                         │
│  DialogueSegmentSchema ────┼──> Used by:                             │
│  LiteraryDeviceSchema ─────┤   • AI flows (validation)               │
│  ConsistencyIssueSchema ───┤   • Server actions (type safety)        │
│  SubtextAnalysisSchema ────┤   • UI components (rendering)           │
│  ... 15+ more schemas ─────┘                                         │
│                                                                       │
│  Benefits:                                                            │
│  ✓ Single source of truth                                            │
│  ✓ Compile-time type checking                                        │
│  ✓ Runtime validation                                                │
│  ✓ Automatic type inference                                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  GRACEFUL DEGRADATION PATTERN                       │
│                                                                       │
│  Promise.allSettled([                                                │
│    tool1(), ✓ SUCCESS                                                │
│    tool2(), ✗ FAILURE (network timeout)                              │
│    tool3(), ✓ SUCCESS                                                │
│    tool4(), ✗ FAILURE (invalid output)                               │
│  ])                                                                   │
│                          ▼                                            │
│  Result handling:                                                     │
│  • Successful tools: Include results in response                     │
│  • Failed tools: Track in errors object                              │
│  • UI: Show partial results, indicate which tools failed             │
│  • User: Still gets value from successful analyses                   │
│                                                                       │
│  errors: {                                                            │
│    dialogueDynamics: "Network timeout",                              │
│    showDontTell: "Invalid output schema"                             │
│  }                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PARALLEL VS SEQUENTIAL                          │
│                                                                       │
│  MUST BE SEQUENTIAL:                                                 │
│  ────────────────────                                                │
│  1. Parse Dialogue      (provides characters & segments)             │
│        ▼                                                              │
│  2. Emotional Analysis  (needs parsed segments)                      │
│                                                                       │
│  CAN BE PARALLEL:                                                    │
│  ────────────────                                                    │
│  All other analyses (all read same story text):                      │
│  • Literary Devices      ┐                                           │
│  • Dialogue Dynamics     │                                           │
│  • Pacing                ├─> Run simultaneously                      │
│  • Tropes                │                                           │
│  • Consistency           │                                           │
│  • Subtext               ┘                                           │
│                                                                       │
│  Time saved: ~70% compared to sequential execution                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHARACTER CHAT CACHING                         │
│                                                                       │
│  First chat with Detective Miles:                                    │
│  1. Create vector store from story text (slow: ~2-3 seconds)         │
│  2. Cache in memory: vectorStoreCache.set(key, vectorStore)          │
│  3. Respond to user                                                  │
│                                                                       │
│  Subsequent chats with Detective Miles:                              │
│  1. Retrieve from cache (fast: <100ms)                               │
│  2. Skip embedding step                                              │
│  3. Respond to user immediately                                      │
│                                                                       │
│  Cache key: `${storyText}-${characterName}`                          │
│  Cache scope: In-memory (per server instance)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

For complete architecture details, see [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md)
