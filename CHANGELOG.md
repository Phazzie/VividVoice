# VividVoice Application Changelog

This document tracks the major features and enhancements implemented in the VividVoice application.

## Version 1.3.0 - Advanced Audio & Architectural Polish

### Major Features

*   **Multi-Voice TTS Engine**: A new, advanced TTS flow (`generate-multi-voice-tts`) was created to support multi-cast audio. The system can now assign unique voices to different characters and generate a single, cohesive audio file for an entire scene using SSML, creating a more immersive "radio play" experience.

### Architectural Improvements
*   **Seam-Driven Architecture Refactor**: The entire application was audited and refactored to be fully "seam-driven." The monolithic `parseStory` server action was decomposed into smaller, single-purpose actions (`getParsedStory` and `getCharacterPortraits`). This significantly improves decoupling, making the architecture more robust, maintainable, and easier to test. Orchestration logic (like `Promise.all`) was moved from the backend actions to the client-side `handleParseStory` function, clarifying the separation of concerns.

## Version 1.2.0 - The Advanced Analysis Suite & Core Experience Upgrade

### Major Features

*   **Literary Analysis Suite**: A new tabbed interface was added to the editor to house multiple AI-powered analysis tools. This includes:
    *   **Literary Device Scanner**: Analyzes the story text to identify literary devices like metaphors and similes, providing the quote and an explanation for each.
    *   **Dialogue Power & Pacing Analyzer**: Generates a detailed report on character interactions, including:
        *   **Power Balance**: Visualizes dialogue turns, word count, questions asked, and assertions made per character using a stacked bar chart.
        *   **Pacing**: Visualizes the average words per turn for each character in a bar chart.
        *   **AI Summary**: Provides a natural language summary of the dialogue dynamics.
    *   **Trope Inverter**: An AI-powered tool that identifies common literary tropes and provides creative, insightful suggestions for how to subvert or invert them to make the story more original.
    *   **Unreliable Narrator Mode**: An experimental tool that rewrites the narrative portions of the story to reflect a chosen bias (e.g., "Jealous of Main Character"), providing a new creative lens on the text.

*   **AI Actor's Studio**: An interactive chat interface allowing writers to "interview" characters from their story. The AI adopts the character's persona based on their existing dialogue and description, a powerful tool for character development.

*   **Parallelized AI Processing**: The initial story processing was significantly optimized by running dialogue parsing and character portrait generation concurrently, reducing user wait time.

### Core Experience Enhancements

*   **Segment-by-Segment Audio Generation**: The initial audio playback system generated a unique audio clip for each dialogue segment.
*   **Synchronized Highlighting**: The story display highlighted the text of the currently playing audio segment, providing a karaoke-style reading experience.
*   **Advanced Emotion Controls**: Replaced the free-text emotion input with a curated dropdown of specific emotional tones for more predictable TTS performance.

*   **Seam-Driven Architecture**: Implemented placeholder "seams" for future features, allowing for rapid prototyping and ensuring a robust, scalable architecture.

## Version 1.0.0 - Foundational Features

*   **Initial Application Setup**: Created the core Next.js application structure with VividVoice branding, including the main page layout, story submission form, and dialogue editor.
*   **AI Emotion Inference**: Implemented the initial AI flow to parse story text, separate it into dialogue segments, and infer the emotion for each line based on the full context of the story.
*   **Character Portrait Generation**: Implemented an AI flow to generate unique, artistic portraits for each character identified in the story.
*   **Structured Error Logging**: Enhanced server actions to provide detailed, structured error logging to the console.
*   **In-Code Documentation**: Added comprehensive JSDoc-style comments to all core AI flows and actions to improve maintainability.
