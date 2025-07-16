# VividVoice - Testing Strategy & Roadmap

This document outlines the testing strategy for the VividVoice application. The goal is to ensure reliability, prevent regressions, and build a high-quality product. Tests are ranked by Return on Investment (ROI) and grouped for efficient implementation.

## Group 1: Core Component & State Management Tests (Highest ROI)

These tests ensure the main user interface components render correctly and manage their state as expected. A failure here breaks the entire user experience.

| Rank | Test Description                                                                                              | Component/File       | Justification                                                 |
| :--- | :------------------------------------------------------------------------------------------------------------ | :------------------- | :------------------------------------------------------------ |
| **1**  | **`StoryForm` Submission:** Ensures the form validates input and the `onSubmit` handler is called correctly with the story text. | `StoryForm.tsx`      | The entry point for the entire app. Critical path.            |
| **2**  | **`DialogueEditor` State Management:** Tests that changing dialogue text and emotions updates the component's internal state. | `DialogueEditor.tsx` | Core interactive component. Complex state is managed here.    |
| **3**  | **`StoryDisplay` Playback Controls:** Simulates clicks on play/pause/volume and ensures the audio element's state changes. | `StoryDisplay.tsx`   | The "payoff" component. Ensures the final product works.      |
| **4**  | **Main Page (`VividVoicePage`) State Machine:** Tests that the app correctly transitions between states (`initial`, `parsing`, `editing`, `displaying`). | `page.tsx`           | Highest-level component. Ensures the entire app flow is coherent. |

---

## Group 2: Server Action & AI Flow Integration Tests (High ROI)

These tests verify the "seams" of our application. They ensure that server actions correctly handle inputs, call the AI flows, and manage errors gracefully. We will use mocking to test the actions without actually calling the AI APIs, making them fast and cheap to run.

| Rank | Test Description                                                                               | Component/File | Justification                                                 |
| :--- | :--------------------------------------------------------------------------------------------- | :------------- | :------------------------------------------------------------ |
| **5**  | **`getParsedStory` Action:** Tests success and error cases (e.g., empty input, AI failure).      | `actions.ts`   | The first and most critical server action.                    |
| **6**  | **`generateMultiVoiceSceneAudio` Action:** Tests that it correctly calls the TTS flow with the right data. | `actions.ts`   | Core audio generation logic.                                  |
| **7**  | **`analyzeDialogueDynamics` Action:** Verifies the action returns the expected data structure.   | `actions.ts`   | Tests a key analysis feature seam.                            |
| **8**  | **`invertTropes` Action:** Tests the success path for the trope inverter.                        | `actions.ts`   | Tests a key analysis feature seam.                            |
| **9**  | **`getCharacterResponse` Action:** Verifies the chat action formats the prompt correctly.        | `actions.ts`   | Tests the interactive "Actor's Studio" feature.               |
| **10** | **`getBiasedStory` Action:** Verifies the unreliable narrator action works as expected.          | `actions.ts`   | Tests a key analysis feature seam.                            |

---

## Group 3: Advanced Analysis Component Tests (Medium ROI)

These tests ensure that the UI components for our analysis suite correctly display data returned from the server actions.

| Rank | Test Description                                                                                     | Component/File                   | Justification                                |
| :--- | :--------------------------------------------------------------------------------------------------- | :------------------------------- | :------------------------------------------- |
| **11** | **`LiteraryAnalysisTab` Display:** Mocks a response from the action and ensures devices are rendered correctly. | `LiteraryAnalysis.tsx`           | Validates a user-facing feature.             |
| **12** | **`DialogueDynamicsAnalysis` Chart Rendering:** Mocks data and ensures charts are rendered.            | `DialogueDynamicsAnalysis.tsx`   | Validates a complex data visualization.      |
| **13** | **`TropeInverter` Display:** Mocks a response and ensures tropes are displayed.                        | `TropeInverter.tsx`              | Validates a user-facing feature.             |
| **14** | **`ActorStudio` Chat Logic:** Tests sending and receiving messages and updating the chat history.      | `ActorStudio.tsx`                | Validates a highly interactive feature.      |
| **15** | **`UnreliableNarrator` UI:** Tests that selecting a bias and clicking generate works.                | `UnreliableNarrator.tsx`         | Validates a user-facing feature.             |

---

## Group 4: Polish & Edge Case Tests (Medium ROI)

These tests cover more specific functionality and edge cases, rounding out the application's reliability.

| Rank | Test Description                                                                                             | Component/File     | Justification                                                 |
| :--- | :----------------------------------------------------------------------------------------------------------- | :----------------- | :------------------------------------------------------------ |
| **16** | **`getCharacterColor` Utility:** Tests that it returns consistent colors and handles the "Narrator" case.    | `utils.ts`         | *Already implemented, but included for completeness.*         |
| **17** | **`useToast` Hook:** Tests that calling `toast()` correctly updates the application state.                   | `use-toast.ts`     | Ensures our notification system is reliable.                  |
| **18** | **`StoryDisplay` Transcript Highlighting:** Mocks a transcript and audio time updates to ensure the correct segment is highlighted. | `StoryDisplay.tsx` | Tests a key UX feature for polish.                            |
| **19** | **`PacingAnalysis` Chart Rendering:** Mocks data and ensures the pacing area chart renders.                  | `PacingAnalysis.tsx` | Validates a complex data visualization.      |
| **20** | **`ShowDontTell` Display:** Mocks a response and ensures suggestions are displayed.                          | `ShowDontTell.tsx` | Validates a user-facing feature.             |
