# Architectural Refactoring Plan: From Monolith to Seams

This document outlines the plan to refactor the Staging Stories application to a more efficient, robust, and maintainable "seam-driven" architecture.

## The Core Problem: Redundant Processing & Monolithic Actions

Currently, the application architecture suffers from a significant inefficiency: **redundant processing**. Every analysis tool in the "Director's Room" (e.g., Trope Inverter, Dialogue Dynamics, Pacing Visualizer) re-sends the *entire story text* from the client to its own dedicated server-side AI flow.

This is a monolithic and inefficient approach that creates several downstream problems:

1.  **Network Inefficiency:** The same large block of story text is sent over the network from the client to the server multiple times. If a user tries three different analysis tools, the same text is uploaded three times. This is slow for the user and wastes bandwidth.
2.  **Costly AI Operations:** Each time the text is sent, a new AI flow is invoked. This means the AI model must read, parse, and understand the context of the entire story from scratch for every single analysis task. This is computationally expensive, increases latency, and would be costly in a production environment.
3.  **Tight Coupling:** The client-side components are tightly coupled to their specific server-side actions, which are in turn tightly coupled to their specific AI flows. This makes the system rigid and difficult to change.
4.  **Poor Maintainability:** The main `parseStory` server logic is monolithic. It attempts to do too many things at once, making it difficult to debug, test, and maintain. A change to one part of the process risks breaking another.

**Example of Current Inefficiency:**
1.  User pastes a 1,000-word story. The client sends the `storyText` to the server to be parsed.
2.  The user clicks "Analyze Tropes." The client sends the *same 1,000-word story* to the `invertTropes` action.
3.  The user clicks "Analyze Pacing." The client sends the *same 1,000-word story* again to the `analyzeStoryPacing` action.
4.  The user clicks "Check Consistency." The client sends the *same 1,000-word story* a fourth time to the `findInconsistencies` action.

This process is fundamentally flawed. We are paying the price in performance and complexity for work the AI has already done.

---

## The Solution: A Seam-Driven Architecture

We will refactor the application so that data is processed once at the most logical "seam," and the results are orchestrated efficiently. This means the client will be responsible for orchestrating calls to small, single-purpose server actions.

| Problem Area | Proposed Solution | Files to Change | Benefit |
| :--- | :--- | :--- | :--- |
| **Monolithic `parseStory` Action** | Decompose the main server-side logic into smaller, single-purpose actions. | `src/lib/actions.ts` | **Decoupling & Clarity:** Each action will have one job (e.g., `getParsedStory`, `getCharacterPortraits`). This makes them easier to understand, test, and maintain. |
| **Inefficient Orchestration** | Move the responsibility of calling these decomposed actions from the server to the client. The client will call `getParsedStory` and `getCharacterPortraits` in parallel using `Promise.all`. | `src/app/page.tsx` | **Performance:** The client can now fetch core data (parsed text and portraits) concurrently, reducing the initial loading time for the user. It also clarifies the separation of concerns. |
| **Redundant `storyText` Prop** | Remove the `storyText` prop from all analysis components in the "Director's Room." The parent `DialogueEditor` already has this information and it does not need to be passed down. | All files in `src/components/vivid-voice/*.tsx` (e.g., `TropeInverter.tsx`, `PacingAnalysis.tsx`, etc.). | **Simplicity & Cleanliness:** Components will have simpler, cleaner props. This removes unnecessary data passing ("prop drilling") and reduces the chance of state inconsistencies. |
| **Outdated Tests** | Update all relevant tests to reflect the new, decomposed architecture. This includes mocking the new, smaller actions and updating component props. | All `*.test.tsx` files for the main page and analysis components. | **Reliability:** Ensures our test suite accurately reflects the application's architecture, allowing us to refactor with confidence and prevent future regressions. |

This refactoring will result in a faster, more robust, and more professional application architecture.