# Parallel GitHub Copilot Agent Prompts for VividVoice

**Created**: October 16, 2025  
**Purpose**: Divide work across multiple agents to complete comprehensive codebase improvements  
**Strategy**: Non-overlapping file assignments to prevent merge conflicts

---

## 🎯 WORK DIVISION STRATEGY

### Agent A: Testing & Type Safety (Files: `tests/`, `src/ai/flows/*.test.ts`)
**Focus**: Test infrastructure and type safety improvements  
**No conflicts with**: Agent B (works on different files)

### Agent B: Firebase Removal & Backend (Files: `src/lib/firebase.ts`, `src/contexts/`, `src/lib/data.ts`)
**Focus**: Backend architecture and auth system  
**No conflicts with**: Agent A (works on different files)

---

## 📝 AGENT A: TESTING & TYPE SAFETY WORKSTREAM

### Session 1: Core AI Flow Tests (Part 1)

```markdown
# Task: Write Comprehensive Tests for VividVoice AI Flows (Part 1 of 3)

## Context
VividVoice is a Next.js 15 + React 19 + TypeScript creative writing tool that uses Google Genkit AI flows for story analysis. Currently only 17 test files exist, but we need 50+ tests for proper coverage.

## Your Mission
Write robust, production-ready tests for the first 6 AI flows. Each test file should:
- Use Vitest + React Testing Library
- Mock Genkit AI responses
- Test success cases, error handling, and edge cases
- Achieve 80%+ coverage per file
- Include clear documentation

## Files to Create

### 1. `src/ai/flows/parse-dialogue.test.ts`
**Test File for**: `src/ai/flows/parse-dialogue.ts`

**What this flow does**: Parses story text into dialogue segments with character names

**Test Cases to Write**:
- ✅ Successfully parses simple dialogue
- ✅ Handles dialogue with multiple characters
- ✅ Handles narration (no character name)
- ✅ Handles empty/whitespace input
- ✅ Handles malformed dialogue
- ✅ Returns proper DialogueSegment array structure
- ✅ Preserves emotion fields in output
- ❌ Handles Genkit flow errors gracefully

**Mock Strategy**:
```typescript
import { vi } from 'vitest';

// Mock the Genkit flow
vi.mock('@/ai/flows/parse-dialogue', () => ({
  parseDialogueFlow: vi.fn(),
  parseDialogue: vi.fn()
}));
```

**Example Test Structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseDialogue } from './parse-dialogue';

describe('parseDialogue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse simple dialogue correctly', async () => {
    const input = 'Alice: Hello!\nBob: Hi there!';
    const result = await parseDialogue({ text: input });
    
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]).toMatchObject({
      character: 'Alice',
      dialogue: 'Hello!',
      emotion: expect.any(String)
    });
  });

  // Add 7+ more test cases...
});
```

### 2. `src/ai/flows/analyze-emotional-tone.test.ts`
**Test File for**: `src/ai/flows/analyze-emotional-tone.ts`

**What this flow does**: Analyzes emotional tone of dialogue based on context

**Test Cases to Write**:
- ✅ Correctly identifies happy emotion
- ✅ Correctly identifies sad emotion
- ✅ Correctly identifies angry emotion
- ✅ Correctly identifies neutral emotion
- ✅ Handles context-dependent emotion analysis
- ✅ Returns emotion from valid emotion list
- ✅ Handles empty dialogue input
- ❌ Handles invalid emotion responses from AI

**Available Emotions**: Neutral, Happy, Sad, Angry, Fearful, Disgusted, Surprised, Excited, Confident, Nervous, Sarcastic, Whispering, Shouting, Pleading

**Mock Response Example**:
```typescript
const mockEmotionResponse = {
  emotion: 'Happy',
  confidence: 0.95
};
```

### 3. `src/ai/flows/analyze-dialogue-dynamics.test.ts`
**Test File for**: `src/ai/flows/analyze-dialogue-dynamics.ts`

**What this flow does**: Analyzes character relationships and dialogue patterns

**Test Cases to Write**:
- ✅ Analyzes relationship between two characters
- ✅ Identifies power dynamics
- ✅ Detects emotional undertones
- ✅ Calculates dialogue pacing metrics
- ✅ Handles single character dialogue
- ✅ Handles multiple character scenes
- ✅ Returns structured DialogueDynamics object
- ❌ Handles empty segment array

### 4. `src/ai/flows/analyze-literary-devices.test.ts`
**Test File for**: `src/ai/flows/analyze-literary-devices.ts`

**What this flow does**: Identifies literary devices (metaphors, similes, etc.) in text

**Test Cases to Write**:
- ✅ Identifies metaphors
- ✅ Identifies similes
- ✅ Identifies alliteration
- ✅ Identifies foreshadowing
- ✅ Handles text with no literary devices
- ✅ Returns array of LiteraryDevice objects
- ✅ Includes line numbers and explanations
- ❌ Handles very long text input

### 5. `src/ai/flows/analyze-pacing.test.ts`
**Test File for**: `src/ai/flows/analyze-pacing.ts`

**What this flow does**: Analyzes story pacing and identifies rushed/slow sections

**Test Cases to Write**:
- ✅ Identifies fast-paced sections
- ✅ Identifies slow-paced sections
- ✅ Provides pacing improvement suggestions
- ✅ Calculates overall pacing score
- ✅ Handles short text snippets
- ✅ Handles chapter-length text
- ✅ Returns PacingAnalysis structure
- ❌ Handles empty text input

### 6. `src/ai/flows/character-chat.test.ts`
**Test File for**: `src/ai/flows/character-chat.ts`

**What this flow does**: Enables chat with story characters using RAG (Retrieval-Augmented Generation)

**Test Cases to Write**:
- ✅ Generates character response in character's voice
- ✅ References story context correctly
- ✅ Handles multi-turn conversations
- ✅ Maintains character personality
- ✅ Handles unknown character gracefully
- ✅ Uses vector store for context retrieval
- ❌ Handles empty message input
- ❌ Handles missing character data

**Note**: This uses LangChain FAISS, so mock both Genkit and LangChain:
```typescript
vi.mock('@langchain/community/vectorstores/faiss');
vi.mock('@langchain/google-genai');
```

## Quality Standards
- **Coverage Target**: 80%+ per file
- **Assertion Count**: 3-5 assertions per test minimum
- **Error Cases**: At least 20% of tests should cover error scenarios
- **Documentation**: Each test should have a clear description

## Checklist for Session 1
- [ ] Create `parse-dialogue.test.ts` with 8+ test cases
- [ ] Create `analyze-emotional-tone.test.ts` with 8+ test cases
- [ ] Create `analyze-dialogue-dynamics.test.ts` with 8+ test cases
- [ ] Create `analyze-literary-devices.test.ts` with 8+ test cases
- [ ] Create `analyze-pacing.test.ts` with 8+ test cases
- [ ] Create `character-chat.test.ts` with 8+ test cases
- [ ] Run `npm test` to verify all tests pass
- [ ] Run `npm run typecheck` to ensure no TypeScript errors
- [ ] Commit with message: "Add comprehensive tests for 6 core AI flows (Part 1)"

## Merge Conflict Prevention
✅ **Safe**: You're creating NEW test files only  
✅ **Safe**: No modifications to existing source files  
✅ **Safe**: Agent B works on completely different files (src/lib/firebase.ts, src/contexts/*, src/lib/data.ts)

## Success Criteria
- All 6 test files created
- Each file has 8+ test cases
- All tests pass (`npm test`)
- No TypeScript errors
- Total: 48+ new test cases
```

---

### Session 2: Core AI Flow Tests (Part 2)

```markdown
# Task: Write Comprehensive Tests for VividVoice AI Flows (Part 2 of 3)

## Context
Continuing the test suite from Part 1. You're now writing tests for the next 6 AI flows.

## Your Mission
Write robust tests for flows 7-12, following the same quality standards as Part 1.

## Files to Create

### 7. `src/ai/flows/generate-multi-voice-tts.test.ts`
**Test File for**: `src/ai/flows/generate-multi-voice-tts.ts`

**What this flow does**: Generates audio for each dialogue segment using Google TTS

**Test Cases**:
- ✅ Generates audio for single segment
- ✅ Generates audio for multiple segments
- ✅ Handles different voices per character
- ✅ Returns base64 audio data URIs
- ✅ Handles empty segments array
- ❌ Handles TTS API failures gracefully
- ❌ Handles network errors
- ✅ Properly formats audio/mpeg data URIs

### 8. `src/ai/flows/shift-perspective.test.ts`
**Test File for**: `src/ai/flows/shift-perspective.ts`

**What this flow does**: Rewrites story from a different character's perspective

**Test Cases**:
- ✅ Shifts from 3rd person to 1st person
- ✅ Shifts from one character POV to another
- ✅ Maintains story events while changing perspective
- ✅ Adapts narrative voice appropriately
- ✅ Handles dialogue attribution changes
- ❌ Handles unknown target perspective
- ✅ Returns complete rewritten text

### 9. `src/ai/flows/trope-inverter.test.ts`
**Test File for**: `src/ai/flows/trope-inverter.ts`

**What this flow does**: Identifies story tropes and suggests inversions

**Test Cases**:
- ✅ Identifies common tropes (hero's journey, love triangle, etc.)
- ✅ Suggests creative trope inversions
- ✅ Maintains story coherence in suggestions
- ✅ Handles stories with no obvious tropes
- ✅ Returns array of Trope objects with inversions
- ✅ Includes reasoning for each suggestion
- ❌ Handles very short text input

### 10. `src/ai/flows/unreliable-narrator.test.ts`
**Test File for**: `src/ai/flows/unreliable-narrator.ts`

**What this flow does**: Rewrites story with unreliable narrator perspective

**Test Cases**:
- ✅ Adds narrative bias and distortions
- ✅ Maintains plot while altering perception
- ✅ Includes subtle contradictions
- ✅ Preserves original events (accessible to reader)
- ✅ Returns biased version of text
- ✅ Provides reliability score
- ❌ Handles neutral/factual text

### 11. `src/ai/flows/show-dont-tell.test.ts`
**Test File for**: `src/ai/flows/show-dont-tell.ts`

**What this flow does**: Identifies "telling" in writing and suggests "showing" alternatives

**Test Cases**:
- ✅ Identifies direct emotional statements ("She was sad")
- ✅ Suggests action-based alternatives
- ✅ Identifies explanatory exposition
- ✅ Suggests sensory details
- ✅ Returns ShowDontTellSuggestion array
- ✅ Includes original text and suggestions
- ✅ Handles well-written "showing" text (no suggestions)
- ❌ Handles empty input

### 12. `src/ai/flows/consistency-guardian.test.ts`
**Test File for**: `src/ai/flows/consistency-guardian.ts`

**What this flow does**: Finds plot holes and continuity errors

**Test Cases**:
- ✅ Detects timeline inconsistencies
- ✅ Detects character behavior inconsistencies
- ✅ Detects plot contradictions
- ✅ Detects world-building violations
- ✅ Returns ConsistencyIssue array
- ✅ Includes severity ratings
- ✅ Suggests fixes for each issue
- ❌ Handles short snippets (too little context)

## Checklist for Session 2
- [ ] Create `generate-multi-voice-tts.test.ts` with 8+ test cases
- [ ] Create `shift-perspective.test.ts` with 7+ test cases
- [ ] Create `trope-inverter.test.ts` with 7+ test cases
- [ ] Create `unreliable-narrator.test.ts` with 7+ test cases
- [ ] Create `show-dont-tell.test.ts` with 8+ test cases
- [ ] Create `consistency-guardian.test.ts` with 8+ test cases
- [ ] Run `npm test` to verify all tests pass
- [ ] Run `npm run typecheck` to ensure no TypeScript errors
- [ ] Commit with message: "Add comprehensive tests for 6 more AI flows (Part 2)"

## Merge Conflict Prevention
✅ **Safe**: Creating NEW test files only  
✅ **Safe**: No overlap with Agent B's work

## Success Criteria
- All 6 test files created
- Each file has 7-8+ test cases
- All tests pass
- Total: 45+ new test cases (cumulative: 93+)
```

---

### Session 3: Final AI Flow Tests & Type Fixes

```markdown
# Task: Complete AI Flow Tests & Fix TypeScript Errors (Part 3 of 3)

## Context
Final session for Agent A. Complete remaining AI flow tests and fix TypeScript errors in test files.

## Your Mission - Part A: Remaining AI Flow Tests

### Files to Create

### 13. `src/ai/flows/analyze-subtext.test.ts`
**Test Cases**: 8+ covering subtext detection, hidden meanings, character motivations

### 14. `src/ai/flows/skeptical-wombat.test.ts`
**Test Cases**: 8+ covering critical story analysis, plot hole detection, improvement suggestions

### 15. `src/ai/flows/analyze-character-archetypes.test.ts`
**Test Cases**: 8+ covering archetype identification (hero, mentor, shadow, etc.), character development

### 16. `src/ai/flows/analyze-plot-structure.test.ts`
**Test Cases**: 8+ covering story structure (setup, conflict, climax, resolution), pacing analysis

### 17. `src/ai/flows/compare-to-classics.test.ts`
**Test Cases**: 8+ covering comparison to classic literature, identifying influences, thematic parallels

### 18. `src/ai/flows/generate-character-portraits.test.ts`
**Test Cases**: 8+ covering portrait generation, character description extraction, image prompt creation

## Your Mission - Part B: Fix TypeScript Errors in Tests

**Current Issues**: 92 TypeScript errors, many in test files with `vi` namespace errors

### Fix Pattern for All Test Files:
```typescript
// Add to top of each test file
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Change this:
vi.mock(...)  // ❌ Error: Cannot find namespace 'vi'

// To this:
import { vi } from 'vitest';  // ✅ Explicit import
vi.mock(...)
```

### Files to Fix:
1. `src/app/page.test.tsx` - Add `vi` import
2. `src/components/vivid-voice/ActorStudio.test.tsx` - Add `vi` import + fix missing props
3. `src/components/vivid-voice/AnalysisToolFailures.test.tsx` - Add `vi` import + fix action name types
4. `src/components/vivid-voice/AnalysisToolSuccess.test.tsx` - Same as above
5. `src/components/vivid-voice/DialogueEditor.test.tsx` - Add `vi` import
6. All other test files with `vi` errors

### Action Name Type Fixes:
The error shows action names like `"analyzeLiteraryDevices"` aren't in the ActionName type. Check `src/lib/actions.ts` and ensure all action functions are properly exported and typed.

## Checklist for Session 3
- [ ] Create `analyze-subtext.test.ts` with 8+ test cases
- [ ] Create `skeptical-wombat.test.ts` with 8+ test cases
- [ ] Create `analyze-character-archetypes.test.ts` with 8+ test cases
- [ ] Create `analyze-plot-structure.test.ts` with 8+ test cases
- [ ] Create `compare-to-classics.test.ts` with 8+ test cases
- [ ] Create `generate-character-portraits.test.ts` with 8+ test cases
- [ ] Fix all `vi` namespace errors in existing test files
- [ ] Fix ActionName type errors in AnalysisToolFailures/Success tests
- [ ] Run `npm run typecheck` - should show significant error reduction
- [ ] Run `npm test` - all tests should pass
- [ ] Commit with message: "Complete AI flow tests and fix TypeScript errors in test files"

## Expected Results
- **Tests Created**: 18 AI flow test files (108+ test cases total)
- **TypeScript Errors**: Reduced from 92 to ~20 (only production code issues remain)
- **Test Coverage**: 80%+ for all AI flows
- **All Tests**: Passing ✅

## Merge Conflict Prevention
✅ **Safe**: Only modifying test files  
✅ **Safe**: No overlap with Agent B

## Success Criteria
- All 18 AI flow tests complete
- TypeScript errors in tests fixed
- 100+ total test cases written
- All tests passing
```

---

## 📝 AGENT B: FIREBASE REMOVAL & BACKEND WORKSTREAM

### Session 1: Firebase Removal & Local State Setup

```markdown
# Task: Remove Firebase Dependencies and Implement Local State (Part 1 of 3)

## Context
VividVoice currently uses Firebase for authentication and data storage, but access has been lost. We need to remove Firebase completely and prepare for deployment on Vercel or Digital Ocean with a new backend.

## Your Mission
Remove all Firebase dependencies and implement local state management with preparation for future API integration.

## Background Information

### Current Firebase Usage:
1. **Authentication**: Firebase Auth with Google Sign-In (`src/contexts/AuthContext.tsx`)
2. **Database**: Firestore for storing user stories (`src/lib/data.ts`)
3. **Configuration**: Firebase initialization (`src/lib/firebase.ts`)

### Files Using Firebase:
- `src/lib/firebase.ts` - Firebase SDK initialization
- `src/contexts/AuthContext.tsx` - Firebase Auth integration
- `src/lib/data.ts` - Firestore database operations
- `.env.example` - Firebase environment variables

### Replacement Strategy:
- **Auth**: Temporary localStorage-based auth (user provides backend later)
- **Data**: localStorage for story persistence (temporary)
- **Future**: API-ready structure for Vercel/Digital Ocean backend

## Files to Modify

### 1. Replace `src/lib/firebase.ts`

**Current**: Firebase initialization  
**New**: Empty placeholder with comments

```typescript
// src/lib/firebase.ts
/**
 * Firebase has been removed from this project.
 * 
 * This file is kept as a placeholder for future backend integration.
 * 
 * For authentication and data storage, the app now uses:
 * - localStorage for temporary local storage
 * - API endpoints (to be implemented) for production
 * 
 * See BACKEND_INTEGRATION_GUIDE.md for instructions on adding a backend.
 */

// Placeholder exports to prevent import errors
export const app = null;
export const auth = null;
export const db = null;
```

### 2. Replace `src/contexts/AuthContext.tsx`

**New Implementation**: Simple localStorage-based auth

```typescript
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Simple User type (no Firebase dependency)
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vividvoice_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('vividvoice_user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    
    // Temporary: Create mock user for development
    // TODO: Replace with actual OAuth flow when backend is ready
    const mockUser: User = {
      uid: `user-${Date.now()}`,
      email: 'user@example.com',
      displayName: 'Demo User',
      photoURL: null
    };
    
    setUser(mockUser);
    localStorage.setItem('vividvoice_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('vividvoice_user');
    router.push('/');
    setLoading(false);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Replace `src/lib/data.ts`

**New Implementation**: localStorage-based data storage

```typescript
import { User } from '@/contexts/AuthContext';

export interface Story {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORIES_KEY = 'vividvoice_stories';

/**
 * Get all stories for the current user from localStorage
 * TODO: Replace with API call when backend is implemented
 */
export async function getUserStories(userId: string): Promise<Story[]> {
  try {
    const storiesJson = localStorage.getItem(STORIES_KEY);
    if (!storiesJson) return [];
    
    const allStories: Story[] = JSON.parse(storiesJson);
    return allStories
      .filter(story => story.userId === userId)
      .map(story => ({
        ...story,
        createdAt: new Date(story.createdAt),
        updatedAt: new Date(story.updatedAt)
      }));
  } catch (error) {
    console.error('Error loading stories:', error);
    return [];
  }
}

/**
 * Save a story to localStorage
 * TODO: Replace with API call when backend is implemented
 */
export async function saveStory(
  userId: string,
  title: string,
  content: string,
  storyId?: string
): Promise<Story> {
  try {
    const storiesJson = localStorage.getItem(STORIES_KEY);
    const allStories: Story[] = storiesJson ? JSON.parse(storiesJson) : [];
    
    const now = new Date();
    
    if (storyId) {
      // Update existing story
      const index = allStories.findIndex(s => s.id === storyId && s.userId === userId);
      if (index >= 0) {
        allStories[index] = {
          ...allStories[index],
          title,
          content,
          updatedAt: now
        };
        localStorage.setItem(STORIES_KEY, JSON.stringify(allStories));
        return allStories[index];
      }
    }
    
    // Create new story
    const newStory: Story = {
      id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      userId,
      createdAt: now,
      updatedAt: now
    };
    
    allStories.push(newStory);
    localStorage.setItem(STORIES_KEY, JSON.stringify(allStories));
    return newStory;
  } catch (error) {
    console.error('Error saving story:', error);
    throw new Error('Failed to save story');
  }
}

/**
 * Delete a story from localStorage
 * TODO: Replace with API call when backend is implemented
 */
export async function deleteStory(userId: string, storyId: string): Promise<void> {
  try {
    const storiesJson = localStorage.getItem(STORIES_KEY);
    if (!storiesJson) return;
    
    const allStories: Story[] = JSON.parse(storiesJson);
    const filteredStories = allStories.filter(
      story => !(story.id === storyId && story.userId === userId)
    );
    
    localStorage.setItem(STORIES_KEY, JSON.stringify(filteredStories));
  } catch (error) {
    console.error('Error deleting story:', error);
    throw new Error('Failed to delete story');
  }
}
```

### 4. Update `.env.example`

Remove Firebase variables, add placeholders for future backend:

```bash
# Google AI API (Required for AI features)
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# ElevenLabs API (Optional - for advanced TTS)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Future Backend API Configuration
# Uncomment and configure when backend is deployed
# NEXT_PUBLIC_API_URL=https://your-api.example.com
# NEXT_PUBLIC_API_KEY=your_api_key_here
```

### 5. Remove Firebase from `package.json`

Remove these dependencies:
```json
"firebase": "^11.1.0",
```

Run after changes:
```bash
npm uninstall firebase
npm install
```

## Checklist for Session 1
- [ ] Replace `src/lib/firebase.ts` with placeholder
- [ ] Replace `src/contexts/AuthContext.tsx` with localStorage auth
- [ ] Replace `src/lib/data.ts` with localStorage storage
- [ ] Update `.env.example` to remove Firebase vars
- [ ] Remove `firebase` from package.json
- [ ] Run `npm install` to update dependencies
- [ ] Test login/logout functionality
- [ ] Test story save/load functionality
- [ ] Run `npm run typecheck` - should have no Firebase errors
- [ ] Run `npm run build` - should build successfully
- [ ] Commit with message: "Remove Firebase dependencies and implement local state storage"

## Merge Conflict Prevention
✅ **Safe**: Agent A works only on test files  
✅ **Safe**: You work only on src/lib/firebase.ts, src/contexts/AuthContext.tsx, src/lib/data.ts  
✅ **Safe**: Different file sets = zero conflicts

## Success Criteria
- Firebase completely removed
- App works with local storage
- No Firebase imports anywhere
- Build succeeds
- Auth flow works (mock login)
- Stories can be saved/loaded
```

---

### Session 2: Backend API Structure & Documentation

```markdown
# Task: Create Backend API Structure Documentation (Part 2 of 3)

## Context
Now that Firebase is removed, create comprehensive documentation for backend integration and prepare API endpoint structure.

## Your Mission
Create documentation and prepare the app for easy backend integration on Vercel or Digital Ocean.

## Files to Create

### 1. `BACKEND_INTEGRATION_GUIDE.md`

```markdown
# VividVoice Backend Integration Guide

## Overview
VividVoice currently uses localStorage for authentication and data storage. This guide explains how to integrate a production backend.

## Backend Options

### Option A: Vercel + Supabase (Recommended)
**Pros**: Easy setup, free tier, PostgreSQL database, built-in auth  
**Cons**: Vendor lock-in to Supabase

**Setup Steps**:
1. Create Supabase project at https://supabase.com
2. Enable Email/Password and OAuth providers
3. Create `stories` table with schema below
4. Install Supabase client: `npm install @supabase/supabase-js`
5. Update authentication to use Supabase Auth
6. Update data layer to use Supabase Database

### Option B: Digital Ocean + Custom Backend
**Pros**: Full control, predictable pricing  
**Cons**: More setup, need to manage server

**Stack Recommendation**:
- Node.js + Express for API
- PostgreSQL for database
- JWT for authentication
- Deploy on Digital Ocean App Platform or Droplet

### Option C: Vercel Serverless + External DB
**Pros**: Serverless benefits, flexibility  
**Cons**: Need to manage database separately

**Setup**:
- Use Vercel Serverless Functions for API
- Connect to PlanetScale (MySQL) or MongoDB Atlas
- Use NextAuth.js for authentication

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Stories Table
\`\`\`sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
\`\`\`

## API Endpoints to Implement

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Stories
- GET /api/stories - Get all stories for current user
- GET /api/stories/:id - Get specific story
- POST /api/stories - Create new story
- PUT /api/stories/:id - Update story
- DELETE /api/stories/:id - Delete story

## Integration Steps

### 1. Update AuthContext
Replace localStorage auth with API calls:

\`\`\`typescript
const signInWithGoogle = async () => {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
  });
  const data = await response.json();
  setUser(data.user);
};
\`\`\`

### 2. Update Data Layer
Replace localStorage with API calls:

\`\`\`typescript
export async function getUserStories(userId: string): Promise<Story[]> {
  const response = await fetch('/api/stories');
  return response.json();
}
\`\`\`

### 3. Add Environment Variables
\`\`\`bash
NEXT_PUBLIC_API_URL=https://your-api.example.com
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_jwt_secret_here
\`\`\`

## Testing Backend Integration
1. Test authentication flow
2. Test story CRUD operations
3. Test error handling
4. Test unauthorized access

See code examples in \`docs/backend-examples/\`
\`\`\`

### 2. `src/app/api/README.md`

Create API route structure documentation:

```markdown
# VividVoice API Routes

This directory will contain Next.js API routes when backend is implemented.

## Current Status
🚧 Using localStorage for data storage  
✅ Ready for API integration

## Planned Routes

### Authentication Routes
- \`/api/auth/login/route.ts\` - Handle login
- \`/api/auth/logout/route.ts\` - Handle logout
- \`/api/auth/register/route.ts\` - Handle registration

### Story Routes
- \`/api/stories/route.ts\` - GET all stories, POST new story
- \`/api/stories/[id]/route.ts\` - GET/PUT/DELETE specific story

## Example Implementation

See \`docs/backend-examples/\` for full examples of API routes.
```

### 3. `docs/backend-examples/stories-route.ts`

Create example API route:

```typescript
// Example: src/app/api/stories/route.ts
// This shows how to implement the stories endpoint

import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with actual database
const db = {
  stories: [] as any[]
};

// GET /api/stories - Get all stories for user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from session/JWT
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Query database
    // const stories = await db.story.findMany({ where: { userId } });
    const stories = db.stories.filter(s => s.userId === userId);

    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/stories - Create new story
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content required' },
        { status: 400 }
      );
    }

    // TODO: Insert into database
    // const story = await db.story.create({ data: { userId, title, content } });
    const story = {
      id: Date.now().toString(),
      userId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.stories.push(story);

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Checklist for Session 2
- [ ] Create `BACKEND_INTEGRATION_GUIDE.md` with complete setup instructions
- [ ] Create `src/app/api/README.md` documenting API structure
- [ ] Create `docs/backend-examples/` directory
- [ ] Create example API route files (stories, auth)
- [ ] Document all three backend options (Supabase, DO, Vercel)
- [ ] Include database schema SQL
- [ ] Include migration guide from localStorage
- [ ] Commit with message: "Add comprehensive backend integration documentation and examples"

## Merge Conflict Prevention
✅ **Safe**: Creating new documentation files only  
✅ **Safe**: No overlap with Agent A's test files

## Success Criteria
- Complete backend integration guide
- Clear migration path from localStorage
- Example API implementations
- Database schema documented
- Ready for user to implement backend
```

---

### Session 3: Fix Remaining TypeScript/Lint Errors & Cleanup

```markdown
# Task: Fix Production Code TypeScript Errors & Final Cleanup (Part 3 of 3)

## Context
Agent A has fixed test file errors. Now fix remaining TypeScript errors in production code and clean up lint issues.

## Your Mission
Fix all remaining TypeScript errors in `src/` (excluding tests) and address ESLint warnings.

## TypeScript Errors to Fix

### 1. Fix Implicit `any` Types in AI Flows

**Files with `Parameter 'input' implicitly has an 'any' type` errors**:
- `src/ai/flows/analyze-character-archetypes.ts`
- `src/ai/flows/analyze-dialogue-dynamics.ts`
- `src/ai/flows/analyze-emotional-tone.ts`
- `src/ai/flows/analyze-literary-devices.ts`
- `src/ai/flows/analyze-pacing.ts`
- `src/ai/flows/analyze-plot-structure.ts`
- `src/ai/flows/analyze-subtext.ts`
- `src/ai/flows/character-chat.ts`
- (and 10+ more)

**Fix Pattern**:
```typescript
// Before:
const analyzeFlow = ai.defineFlow(
  {
    name: 'analyzeFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {  // ❌ implicit any
    // ...
  }
);

// After:
const analyzeFlow = ai.defineFlow(
  {
    name: 'analyzeFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input: z.infer<typeof InputSchema>) => {  // ✅ explicit type
    // ...
  }
);
```

### 2. Fix `process` Not Found Errors

**Files**: `src/ai/flows/character-chat.ts`, `src/ai/flows/generate-elevenlabs-tts.ts`

**Error**: `Cannot find name 'process'. Do you need to install type definitions for node?`

**Fix**: Ensure `@types/node` is in devDependencies and TypeScript config includes node types:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

Or add explicit import:
```typescript
/// <reference types="node" />
```

### 3. Fix Dashboard Page JSX Errors

**File**: `src/app/dashboard/page.tsx`

**Error**: `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists`

This usually means React types aren't properly imported. Ensure:
```typescript
import React from 'react';
// or make sure tsx config is correct
```

### 4. Fix Missing Property Errors

**File**: `src/components/vivid-voice/ActorStudio.test.tsx`

**Error**: `Property 'storyText' is missing in type`

Add missing required props to test mocks.

## ESLint Fixes

### Auto-fixable Issues
Run: `npm run lint:fix` to auto-fix formatting issues

### Manual Fixes Needed
1. **Unused imports** - Remove unused variables
2. **Console statements** - Add `eslint-disable-next-line` for legitimate console.logs or remove
3. **Any types** - Replace with proper types

## Code Quality Improvements

### 1. Add Proper Error Boundaries
Create `src/components/ErrorBoundary.tsx` if missing:

```typescript
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-600">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Update Type Declarations

If any `.d.ts` files have issues, fix them:

**File**: `src/types/wav.d.ts`

Ensure proper type declarations:
```typescript
declare module '*.wav' {
  const content: string;
  export default content;
}
```

## Checklist for Session 3
- [ ] Fix all implicit `any` types in AI flows (add explicit type parameters)
- [ ] Fix `process` not found errors (ensure @types/node is configured)
- [ ] Fix dashboard JSX type errors
- [ ] Fix missing property errors in test mocks
- [ ] Run `npm run lint:fix` to auto-fix ESLint issues
- [ ] Manually fix remaining ESLint errors
- [ ] Add/update ErrorBoundary component if needed
- [ ] Run `npm run typecheck` - should show 0 errors
- [ ] Run `npm run lint` - should show minimal warnings
- [ ] Run `npm run build` - should build successfully
- [ ] Commit with message: "Fix all TypeScript and ESLint errors in production code"

## Expected Results
- **TypeScript Errors**: 0 (down from 92)
- **ESLint Errors**: 0-10 (down from 527)
- **Build Status**: ✅ Success
- **Type Safety**: Fully typed codebase

## Merge Conflict Prevention
✅ **Safe**: Fixing type annotations in AI flows  
✅ **Safe**: Agent A already finished with tests  
✅ **Safe**: No file overlap

## Success Criteria
- Zero TypeScript errors
- All builds pass
- Type safety throughout codebase
- Ready for production deployment
```

---

## 🎯 EXECUTION PLAN

### Recommended Sequence

1. **Start Both Agents Simultaneously**:
   - Agent A Session 1 (AI flow tests part 1)
   - Agent B Session 1 (Firebase removal)

2. **After Session 1 Completes**:
   - Agent A Session 2 (AI flow tests part 2)
   - Agent B Session 2 (Backend docs)

3. **Final Session**:
   - Agent A Session 3 (Remaining tests + test file TS fixes)
   - Agent B Session 3 (Production code TS/lint fixes)

### Total Estimated Time
- **Agent A**: 6-8 hours (all 3 sessions)
- **Agent B**: 4-6 hours (all 3 sessions)
- **Total**: Can complete in parallel = 6-8 hours wall-clock time

### Success Metrics
- ✅ 18 AI flow test files created (100+ test cases)
- ✅ Firebase completely removed
- ✅ Backend integration documented
- ✅ 0 TypeScript errors
- ✅ <10 ESLint warnings
- ✅ All tests passing
- ✅ Production build succeeds

---

## 📋 MASTER COORDINATION CHECKLIST

### Pre-Flight
- [ ] Both agents have reviewed their session prompts
- [ ] Work division confirmed (no file overlaps)
- [ ] Base branch is up to date

### Agent A Progress
- [ ] Session 1: 6 AI flow tests created ✅
- [ ] Session 2: 6 more AI flow tests created ✅
- [ ] Session 3: Final 6 tests + TS fixes in tests ✅

### Agent B Progress
- [ ] Session 1: Firebase removed, localStorage implemented ✅
- [ ] Session 2: Backend documentation created ✅
- [ ] Session 3: Production TS/lint errors fixed ✅

### Integration
- [ ] Agent A commits merged
- [ ] Agent B commits merged
- [ ] Final verification build
- [ ] All tests pass
- [ ] TypeScript clean
- [ ] ESLint clean

### Deployment Ready
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Types check: `npm run typecheck`
- [ ] Lint clean: `npm run lint`
- [ ] Documentation complete
- [ ] Ready for Vercel/Digital Ocean deployment

---

**Created by**: GitHub Copilot Agent (Coordinator)  
**For**: Parallel execution by 2 GitHub Copilot Agents  
**Estimated Completion**: 6-8 hours (wall-clock time with parallel execution)
