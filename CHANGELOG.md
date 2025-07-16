# VividVoice Application Changelog

This document tracks the major features and enhancements implemented in the VividVoice application.

## Version 1.2.0 - Architecture & Stability

### Major Features

*   **Seam-Driven Architecture Refactor**: The entire application was audited and refactored to be fully "seam-driven." The monolithic `parseStory` server action was decomposed into smaller, single-purpose actions (`getParsedStory` and `getCharacterPortraits`). This significantly improves decoupling, making the architecture more robust, maintainable, and easier to test. Orchestration logic (like `Promise.all`) was moved from the backend actions to the client-side `handleParseStory` function, clarifying the separation of concerns.

## Version 1.1.0 - The Advanced Analysis Suite & Core Experience Upgrade

### Major Features

*   **Literary Analysis Suite**: A new tabbed interface was added to the editor to house multiple AI-powered analysis tools. This includes:
    *   **Literary Device Scanner**: Analyzes the story text to identify literary devices like metaphors and similes, providing the quote and an explanation for each.
    *   **Dialogue Power & Pacing Analyzer**: Generates a detailed report on character interactions, including:
        *   **Power Balance**: Visualizes dialogue turns, word count, questions asked, and assertions made per character using a stacked bar chart.
        *   **Pacing**: Visualizes the average words per turn for each character in a bar chart.
        *   **AI Summary**: Provides a natural language summary of the dialogue dynamics.
    *   **Trope Inverter**: An AI-powered tool that identifies common literary tropes and provides creative, insightful suggestions for how to subvert or invert them to make the story more original.
    *   **Unreliable Narrator Mode**: An experimental tool that rewrites the narrative portions of the story to reflect a chosen bias (e.g., "Jealous of Main Character"), providing a new creative lens on the text.

*   **AI Actor's Studio**: An interactive chat interface allowing writers to "interview" characters from their story. The AI adopts the character's persona based on their existing dialogue and description, providing a powerful tool for character development.

*   **Parallelized AI Processing**: The initial story processing was significantly optimized. The app now runs dialogue parsing, character portrait generation, and literary analysis concurrently, reducing the user's waiting time.

### Core Experience Enhancements

*   **Segment-by-Segment Audio Generation**: The audio playback system was completely overhauled. The app now generates a unique audio clip for each dialogue segment.
*   **Synchronized Highlighting**: The story display now highlights the text of the currently playing audio segment, providing a polished, karaoke-style reading experience that is perfectly synchronized with the audio.
*   **Advanced Emotion Controls**: The free-text emotion input in the dialogue editor was replaced with a curated dropdown of specific emotional tones (e.g., Happy, Sad, Anxious, Whispering), giving the user more direct and predictable control over the TTS performance.

*   **Seam-Driven Architecture**: Implemented placeholder "seams" for future features like the AI Actor's Studio and Unreliable Narrator mode. This allowed for rapid prototyping and ensures a robust, scalable architecture.

## Version 1.0.0 - Foundational Features

*   **Initial Application Setup**: Created the core Next.js application structure with VividVoice branding, including the main page layout, story submission form, and dialogue editor.
*   **AI Emotion Inference**: Implemented the initial AI flow to parse story text, separate it into dialogue segments, and infer the emotion for each line based on the full context of the story.
*   **Character Portrait Generation**: Implemented an AI flow to generate unique, artistic portraits for each character identified in the story, which are displayed in the editor and final story view.
*   **Structured Error Logging**: Enhanced the server actions to provide more detailed and structured error logging to the console, improving debuggability.
*   **In-Code Documentation**: Added comprehensive JSDoc-style comments to all core AI flows and actions to improve maintainability.
