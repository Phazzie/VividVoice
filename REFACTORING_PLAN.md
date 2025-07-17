
# Architectural Refactoring Plan: From Monolith to Seams

This document outlines the plan to refactor the Staging Stories application to a more efficient, robust, and maintainable "seam-driven" architecture.

## The Core Problem: Redundant Processing

Currently, every analysis tool in the "Director's Room" (e.g., Trope Inverter, Dialogue Dynamics) re-sends the entire story text from the client to its own dedicated server-side AI flow. This is a monolithic and inefficient approach.

**Example of Current Inefficiency:**
1.  User pastes story -> Client sends `storyText` to `getParsedStory`.
2.  User clicks "Analyze Tropes" -> Client sends same `storyText` to `invertTropes`.
3.  User clicks "Analyze Pacing" -> Client sends same `storyText` to `analyzeStoryPacing`.

This results in the same large block of text being sent over the network and processed by the AI repeatedly, which is slow and costly.

---

## The Solution: A Seam-Driven Architecture

We will refactor the application so that data is processed once at the most logical "seam," and the results are orchestrated efficiently.

| Problem | Proposed Solution | Files to Change | Benefit |
| :--- | :--- | :--- | :--- |
| **Monolithic `parseStory` Action** | Decompose the main server-side logic into smaller, single-purpose actions. | `src/lib/actions.ts` | **Decoupling & Clarity:** Each action will have one job (e.g., `getParsedStory`, `getCharacterPortraits`). This makes them easier to understand, test, and maintain. |
| **Inefficient Orchestration** | Move the responsibility of calling these decomposed actions from the server to the client. The client will call `getParsedStory` and `getCharacterPortraits` in parallel using `Promise.all`. | `src/app/page.tsx` | **Performance:** The client can now fetch core data (parsed text and portraits) concurrently, reducing the initial loading time for the user. It also clarifies the separation of concerns. |
| **Redundant `storyText` Prop** | Remove the `storyText` prop from all analysis components in the "Director's Room." The parent `DialogueEditor` already has this information and it does not need to be passed down. | All files in `src/components/vivid-voice/*.tsx` (e.g., `TropeInverter.tsx`, `PacingAnalysis.tsx`, etc.). | **Simplicity & Cleanliness:** Components will have simpler, cleaner props. This removes unnecessary data passing and reduces the chance of state inconsistencies. |
| **Outdated Tests** | Update all relevant tests to reflect the new, decomposed architecture. This includes mocking the new, smaller actions and updating component props. | All `*.test.tsx` files for the main page and analysis components. | **Reliability:** Ensures our test suite accurately reflects the application's architecture, allowing us to refactor with confidence and prevent future regressions. |

This refactoring will result in a faster, more robust, and more professional application architecture.
