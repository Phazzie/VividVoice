# Staging Stories - Roadmap to Production Polish

This document outlines the final, high-impact tasks required to transition the Staging Stories application from "feature-complete" to "production-ready."

## Phase 1: Generative Sound Design

**Goal:** Replace the placeholder sound effect system with a fully generative AI solution.

**Current Status:** The `getSoundDesign` action correctly identifies *what* sound to play but uses a small, hardcoded library of placeholder URLs. We do not have access to a licensed sound effects API.

**Action Plan:**

| # | Task | Description | Status |
| :-- | :--- | :--- | :--- |
| 1 | **Create `generate-sound-effect.ts`** | Implement a new Genkit flow that takes a text description (e.g., "a heavy oak door creaks open") and uses a text-to-audio model to generate a WAV audio file as a data URI. | ❌ To Do |
| 2 | **Refactor `getSoundDesign` action** | Update the action in `src/lib/actions.ts`. Instead of looking up a URL, it will call the new `generateSoundEffect` flow for each identified sound cue and return the generated audio data URI. | ❌ To Do |
| 3 | **Update `dev.ts`** | Remove the old `generate-sound-design.ts` import and add the new `generate-sound-effect.ts` flow to the Genkit dev server. | ❌ To Do |

---

## Phase 2: Advanced Prompt Engineering (PSL-4 Upgrade)

**Goal:** Elevate all primary AI analysis prompts to **Prompt Sophistication Level 4 (PSL-4)** by adding high-quality "few-shot" examples and advanced creative features.

**Current Status:** ✅ **Done**. All prompts have been audited and upgraded to a "beefed up" PSL-4 standard. This involved adding high-quality, few-shot examples to all prompts, encouraging more nuanced and creative outputs, and adding new features like conversational power play analysis, evolving narrator bias, and authorial style emulation.
