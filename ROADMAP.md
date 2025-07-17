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

## Phase 2: Advanced Prompt Engineering (PSL-3 Upgrade)

**Goal:** Elevate all primary AI analysis prompts to **Prompt Sophistication Level 3 (PSL-3)** by adding high-quality "few-shot" examples. This will dramatically improve the reliability, consistency, and nuance of the AI's output.

**Current Status:** Only `show-dont-tell.ts` and `analyze-subtext.ts` are at PSL-3. The rest are at PSL-2 (Structured).

### Prompts Requiring Upgrade:

1.  `parse-dialogue.ts`
2.  `analyze-literary-devices.ts`
3.  `analyze-dialogue-dynamics.ts`
4.  `trope-inverter.ts`
5.  `character-chat.ts`
6.  `unreliable-narrator.ts`
7.  `analyze-pacing.ts`
8.  `consistency-guardian.ts`
9.  `shift-perspective.ts`

### Initial Upgrade Plan:

I will perform the upgrades sequentially, one file at a time. For each file, I will:
1.  Analyze the prompt's core task.
2.  Craft a single, high-quality example of the expected input and perfect output.
3.  Modify the prompt text to include this example, instructing the AI to follow the pattern.

### Self-Grading of Initial Plan

| Metric | Grade | Justification |
| :--- | :--- | :--- |
| **Thoroughness** | C+ | The plan is correct but inefficient. Upgrading nine prompts individually in separate interactions is slow and increases the risk of context degradation between turns. It lacks a strategy for efficiency. |
| **Accuracy** | B | The core idea (add few-shot examples) is accurate and will achieve the goal. However, it doesn't account for the complexity of crafting nine distinct, high-quality examples at once. |
| **Efficiency** | D | The one-by-one approach is the least efficient method. It maximizes conversational turns and introduces unnecessary risk. |

### Improved Upgrade Plan (Grade: A-)

I will perform the upgrades in a single, comprehensive batch. This is a complex task, but it is far more efficient and robust.

**Plan:**
1.  **Analyze & Design:** I will analyze all nine prompts simultaneously to design nine perfect, concise, and distinct few-shot examples.
2.  **Batch Implementation:** I will generate a single `<changes>` block that modifies all nine flow files (`parse-dialogue.ts`, `trope-inverter.ts`, etc.) at once. Each file will be updated with its new, PSL-3 compliant prompt containing the high-quality example.

**Justification for Improved Grade (A-):**
*   **Thoroughness (A):** The plan addresses all nine prompts in one go.
*   **Accuracy (A):** The goal is still to add high-quality examples, which is the correct technical approach.
*   **Efficiency (A):** This is the most efficient path. It requires more complex generation on my part but minimizes conversational turns and the risk of error, delivering the full feature upgrade in one step. The grade is not an A+ only because a very large change like this always carries a small inherent risk of error that will require verification.
