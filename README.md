# VividVoice: AI-Powered Expressive Storytelling

VividVoice is a sophisticated web application designed to bring written narratives to life. It leverages the power of generative AI to transform a simple story script into a fully-voiced, multi-character audio performance, complete with AI-generated character portraits and a suite of advanced literary analysis tools.

This project was built in Firebase Studio as a demonstration of "seam-driven" architecture and advanced prompt engineering techniques.

https://github.com/user-attachments/assets/19f56e9c-4971-4607-b2e1-8f553ff84c90

## Key Features

### Core Experience
*   **AI Story Parsing**: Ingests raw story text and intelligently separates it into narration and character dialogue.
*   **AI Casting Director**: Analyzes character descriptions and actions within the story to assign them a unique, fitting voice from a library of options.
*   **Character Portrait Generation**: Generates photorealistic, cinematic-style portraits for each character identified in the story.
*   **Multi-Voice Audio Generation**: Creates a single, cohesive "radio play" style audio file for the entire scene, using different voices for each character.
*   **Expressive TTS Performance**: Allows the user to fine-tune the emotion for each line of dialogue (e.g., "Happy," "Anxious," "Sarcastic"), which directly influences the AI's vocal performance.
*   **Synchronized Highlighting**: Provides a karaoke-style reading experience by highlighting the exact words being spoken in the story text as the audio plays.
*   **AI-Powered Sound Design**: Scans the narrative for sound cues (e.g., "a door creaked open") and automatically layers in sound effects to enhance immersion.

### The Director's Room: Advanced Analysis Suite
VividVoice also includes a powerful suite of AI-powered tools to help writers analyze and improve their work:

*   **Literary Device Scanner**: Identifies and explains the use of literary devices like metaphors, similes, and foreshadowing in the text.
*   **Dialogue Dynamics Analyzer**: Generates charts and a summary to visualize the power balance between characters, showing metrics like word count, dialogue turns, and questions asked.
*   **Pacing Visualizer**: Creates an area chart showing the flow of the story between narration and dialogue, helping to identify pacing issues.
*   **Trope Inverter**: Detects common literary tropes and offers creative suggestions on how to subvert or invert them.
*   **AI Actor's Studio**: A chat interface that allows a writer to "interview" the characters from their story. The AI adopts the character's persona, providing a powerful tool for character development.
*   **Unreliable Narrator Mode**: An experimental tool that can rewrite the narrator's parts to reflect a specific bias (e.g., "Secretly the Villain"), offering a new creative lens.
*   **"Show, Don't Tell" Converter**: Finds "telling" sentences (e.g., "She was angry") and suggests more descriptive "showing" alternatives.
*   **Consistency Guardian**: Scans the story for continuity errors, such as a character's eye color changing or plot inconsistencies.
*   **Subtext Analyzer**: Uncovers the unspoken meaning behind lines of dialogue, explaining the hidden emotions and motivations.
*   **Perspective Shifter**: Rewrites a summary of the story from the point of view of a different character, casting them as the protagonist or antagonist.

## Tech Stack
*   **Framework**: Next.js (App Router)
*   **Generative AI**: Google AI & Genkit
*   **UI**: React, TypeScript, ShadCN UI, Tailwind CSS
*   **Charting**: Recharts
*   **State Management**: React Hooks
*   **Hosting**: Firebase App Hosting
