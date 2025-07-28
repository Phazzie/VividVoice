# Staging Stories with the Skeptical Wombat

## Your Story Is Written. It's Time for the Staging.

You've poured your soul onto the page. The characters are real to you, their voices clear in your head. But are they clear on paper? Does the dialogue snap? Does the pacing land? Does the story *work*?

It's hard to be your own critic. You need a partner. Someone with an ear for performance, an eye for detail, and the healthy dose of skepticism needed to turn good writing into a great story.

## Meet Your New Director: The Skeptical Wombat

He's a curmudgeon. He's particular. He's seen it all, and he's not easily impressed. But he's also a genius at spotting what makes a story come alive. With **Staging Stories with the Skeptical Wombat**, you get his entire AI-powered toolkit to direct, analyze, and perform your narrative.

This isn't just text-to-speech. It's a full production studio.

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Google AI API key

### Quick Start
1. Clone the repository
```bash
git clone https://github.com/Phazzie/VividVoice.git
cd VividVoice
```

2. Install dependencies
```bash
npm install
```

3. Environment Configuration
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration from your Firebase console
- `GOOGLE_GENAI_API_KEY` - Google AI API key for Genkit
- `ELEVENLABS_API_KEY` (optional) - For advanced TTS features

### Development
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Building
```bash
npm run build
npm start
```

## Core Experience: The Director's Toolkit

Bring your script from page to performance with our foundational features.

*   **Full-Cast Table Read:** Paste your script and our AI Casting Director (the Wombat, of course) assigns unique, high-quality voices to each character. Generate a single, seamless "radio play" of your scene and hear how your dialogue flows in a real performance.
*   **Expressive Emotional Control:** You are the director. For every line of dialogue, tweak the emotional delivery—from "Happy" to "Sarcastic" to "Whispering"—and hear the AI performance change instantly.
*   **Synchronized Script & Audio:** Follow along with a karaoke-style highlight of your text as the audio plays. Pinpoint the exact word or phrase that needs work.
*   **AI-Generated Character Portraits:** Don't just hear your characters, see them. The AI generates photorealistic, cinematic portraits for every character in your story.
*   **Immersive Sound Design:** The AI automatically scans your narrative for sound cues (e.g., "a door creaked open," "the wind howled") and layers in sound effects to create a more immersive audio experience.

### The Director's Room: The Skeptical Wombat's Full Analysis Suite

The Wombat's true genius lies in his critical eye. Go beyond simple playback with a comprehensive suite of one-click analysis tools designed to sharpen your craft.

*   **Literary Device Scanner:** The Wombat's AI will scan your text for metaphors, similes, foreshadowing, and more, providing quotes and explanations to help you understand your own style.
*   **Dialogue Dynamics Analyzer:** Are your characters' conversations balanced? Who really holds the power? Get data-driven charts on word count, dialogue turns, and questions asked to understand the subtext of your scenes.
*   **Pacing Visualizer:** Is your story dragging or rushing? Get an interactive area chart that visualizes the flow between narration and dialogue, helping you spot pacing problems at a glance.
*   **Trope Inverter:** Stuck in a cliché? This tool identifies common tropes in your story (like "The Chosen One" or "Damsel in Distress") and provides clever, insightful suggestions on how to subvert them.
*   **AI Actor's Studio:** Need to flesh out a character? "Interview" them directly. Our AI adopts your character's persona based on their dialogue and actions, allowing you to ask them questions and discover their true voice in a live chat.
*   **Unreliable Narrator Mode:** Explore your story from a new angle. This experimental tool rewrites the narrative portions of your story to reflect a specific bias you choose (e.g., "Jealous of Main Character," "Secretly the Villain").
*   **"Show, Don't Tell" Converter:** Find "telling" sentences in your narration (e.g., "She was angry") and get detailed "showing" paragraphs that convey the same emotion through action and sensory detail.
*   **Consistency Guardian:** The Wombat's ultimate pet peeve is a continuity error. This tool scans your entire story for inconsistencies, like a character's eye color changing or a detail from their backstory being contradicted.
*   **Subtext Analyzer:** Uncover the hidden meaning behind the words. This tool analyzes dialogue to reveal the unspoken emotions and motivations driving your characters.
*   **Perspective Shifter:** How would the story change if your villain was the hero? This tool rewrites a summary of your plot from the perspective of a different character, casting them in a new role.

### Tech Stack
*   **Framework**: Next.js (App Router)
*   **Generative AI**: Google AI & Genkit
*   **UI**: React, TypeScript, ShadCN UI, Tailwind CSS
*   **Charting**: Recharts
*   **State Management**: React Hooks
*   **Authentication & Database**: Firebase
*   **Hosting**: Firebase App Hosting
