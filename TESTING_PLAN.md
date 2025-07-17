# Staging Stories - Testing Strategy & Roadmap

This document outlines the testing strategy for the Staging Stories application. The goal is to ensure reliability, prevent regressions, and build a high-quality product.

## Testing Philosophy

Our testing strategy is based on a multi-layered approach to provide confidence at every level of the application:
1.  **Unit Tests:** For pure utility functions (`utils.ts`) to ensure they behave as expected in isolation.
2.  **Server Action / Integration Tests:** To verify the "seams" of our application. We use mocking to test that our server actions call the AI flows correctly and handle both success and error cases, without incurring the cost of real API calls.
3.  **Component Tests:** For all major UI components, ensuring they render correctly, manage state, and respond to user interactions. This includes testing all analysis tools in the "Director's Room".
4.  **End-to-End State Machine Tests:** A dedicated test for the main page (`page.tsx`) that verifies the entire application flow, from story submission to audio generation and playback, simulating a complete user journey.

## Status: Coverage Complete

As of the last development push, the full testing plan outlined below has been **implemented**. Test files exist for all major components, actions, and utilities, providing excellent coverage across the application. This test suite is a critical asset for future development, allowing for confident refactoring and feature additions.

---

## Implemented Test Suite (by ROI)

### Group 1: Core Component & State Management Tests (Highest ROI)

| Rank | Test Description | Component/File | Status |
| :--- | :--- | :--- | :--- |
| **1** | **`StoryForm` Submission & Validation:** Ensures form validation and `onSubmit` handler. | `StoryForm.test.tsx` | ✅ **Done** |
| **2** | **`DialogueEditor` State & Interaction:** Tests editing dialogue, changing emotions, and calling `onGenerateAudio`. | `DialogueEditor.test.tsx` | ✅ **Done** |
| **3** | **`StoryDisplay` Playback Controls & Highlighting:** Simulates clicks, audio events, and verifies segment highlighting. | `StoryDisplay.test.tsx` | ✅ **Done** |
| **4** | **Main Page (`VividVoicePage`) State Machine:** Tests transitions between `initial`, `parsing`, `editing`, and `displaying` states. | `page.test.tsx` | ✅ **Done** |

### Group 2: Server Action & AI Flow Integration Tests (High ROI)

| Rank | Test Description | Component/File | Status |
| :--- | :--- | :--- | :--- |
| **5** | **`getParsedStory` Action:** Tests success, empty input, and AI failure cases. | `actions.test.ts` | ✅ **Done** |
| **6** | **`generateMultiVoiceSceneAudio` Action:** Tests correct data passthrough to the TTS flow. | `actions.test.ts` | ✅ **Done** |
| **7** | **`analyzeDialogueDynamics` Action:** Verifies the action calls the correct flow. | `actions.test.ts` | ✅ **Done** |
| **8** | **`invertTropes` Action:** Verifies the action calls the correct flow. | `actions.test.ts` | ✅ **Done** |
| **9** | **`getCharacterResponse` Action:** Verifies the chat action formats the prompt correctly. | `actions.test.ts` | ✅ **Done** |
| **10**| **`getBiasedStory` Action:** Verifies the unreliable narrator action works. | `actions.test.ts` | ✅ **Done** |

### Group 3: Advanced Analysis Component Tests (Medium ROI)

| Rank | Test Description | Component/File | Status |
| :--- | :--- | :--- | :--- |
| **11**| **`LiteraryAnalysis` Display:** Mocks a response and ensures devices are rendered. | `LiteraryAnalysis.test.tsx` | ✅ **Done** |
| **12**| **`DialogueDynamicsAnalysis` Chart Rendering:** Mocks data and ensures charts are rendered. | `DialogueDynamicsAnalysis.test.tsx` | ✅ **Done** |
| **13**| **`TropeInverter` Display:** Mocks a response and ensures tropes are displayed. | `TropeInverter.test.tsx` | ✅ **Done** |
| **14**| **`ActorStudio` Chat Logic:** Tests sending and receiving messages. | `ActorStudio.test.tsx` | ✅ **Done** |
| **15**| **`UnreliableNarrator` UI:** Tests selecting a bias and clicking generate. | `UnreliableNarrator.test.tsx` | ✅ **Done** |

### Group 4: Polish, Edge Case, and New Feature Tests (Medium ROI)

| Rank | Test Description | Component/File | Status |
| :--- | :--- | :--- | :--- |
| **16**| **`getCharacterColor` Utility:** Tests consistent color generation. | `utils.test.ts` | ✅ **Done** |
| **17**| **Analysis Tools Success/Failure:** A combined test file to verify all analysis tools handle success and error states correctly. | `AnalysisToolSuccess.test.tsx`, `AnalysisToolFailures.test.tsx` | ✅ **Done** |
| **18**| **`PacingAnalysis` Chart Rendering:** Mocks data and ensures the pacing chart renders. | `PacingAnalysis.test.tsx` | ✅ **Done** |
| **19**| **`ShowDontTell` Display & Interaction:** Mocks a response and ensures suggestions are displayed and can be applied. | `ShowDontTell.test.tsx` | ✅ **Done** |
| **20**| **`ConsistencyGuardian` Display:** Mocks a response and ensures issues are rendered. | `ConsistencyGuardian.test.tsx` | ✅ **Done** |
| **21**| **`SubtextAnalyzer` Display:** Mocks a response and ensures analyses are rendered. | `SubtextAnalyzer.test.tsx` | ✅ **Done** |
| **22**| **`PerspectiveShifter` Display & Interaction:** Mocks a response and ensures results are rendered. | `PerspectiveShifter.test.tsx` | ✅ **Done** |
