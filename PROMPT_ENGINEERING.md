# VividVoice - Prompt Engineering Guide

This document tracks the evolution of the AI prompts used in the VividVoice application and outlines strategies for future improvements.

## Philosophy

The quality of the output from a Generative AI model is directly proportional to the quality of the prompt. Our goal is to move from simple, "sparse" prompts to detailed, structured prompts that provide context, explicit instructions, and clear output formatting requirements. This reduces ambiguity and leads to more reliable, professional-grade results.

---

## Prompt Evolution

### Initial State: Sparse Prompts

The initial prompts in the application were effective but sparse. They typically consisted of a single paragraph describing the task.

**Example (Old `parseDialogue` prompt - conceptual):**

> "Parse the following story. Identify the characters and break the text into dialogue segments. Guess the emotion for each line."

While functional, this approach left much to the AI's interpretation, which could lead to inconsistent results, especially with complex or non-standard story formats.

---

### Current State: Detailed, Structured Prompts

All AI prompts in the application have been upgraded to a more robust, structured format.

**Key Improvements:**
1.  **Role-Playing:** Prompts now begin by assigning a specific role to the AI (e.g., "You are an expert script analyst," "You are a meticulous continuity editor"). This grounds the AI in a specific context.
2.  **Explicit Instructions:** Tasks are broken down into numbered or bulleted steps, leaving no room for ambiguity.
3.  **Critical Formatting Rules:** Prompts now include a **"CRITICAL INSTRUCTIONS"** section for non-negotiable rules, such as output schema compliance or specific exclusions (e.g., "You MUST exclude the 'Narrator' from all character-specific metrics").
4.  **Schema-Driven Output:** All prompts reference a Zod schema for their output, ensuring the AI returns a predictable, well-structured JSON object.
5.  **Clear Data Delimitation:** Input data, like the story text, is clearly demarcated within the prompt using markdown code fences to prevent confusion.

**Example (New `parseDialogue` prompt):**

> You are an expert in literary analysis and a casting director for a major film studio. Your task is to process a story script, identify all characters, create casting profiles for them, and then break the script into a clean, ordered list of dialogue and narration segments.
>
> **PART 1: CHARACTER ANALYSIS & CASTING**
>
> First, read the entire story text to understand the plot, characters, and overall tone. Based on this holistic understanding, compile a list of all unique characters mentioned.
> For each character (including the 'Narrator'), provide:
> 1. A detailed physical 'description' based on any details mentioned or implied in the text. If no description is available, infer a plausible one based on their personality.
> 2. A 'voiceId' selected from the list of available voices below...
>
> **PART 2: SCRIPT SEGMENTATION**
>
> Second, break down the entire story chronologically into an array of dialogue or narrative segments.
> For each segment, provide:
> 1. The 'character' speaking...
> 2. The 'dialogue' or narrative text itself.
> 3. The inferred 'emotion' for that line...
>
> **CRITICAL INSTRUCTIONS:**
> - Return a single JSON object with two keys: 'characters' and 'segments'.
> - The 'segments' array must be in the exact chronological order of the story.
>
> **Available Voices for Casting:**
> en-US-Standard-A, en-US-Standard-B...
>
> **Story Script to Process:**
> \`\`\`
> {{{storyText}}}
> \`\`\`

This new format is used across all AI flows in the application.

---

## Future Improvements

While the current prompts are robust, they can be improved further. The next evolution in prompt engineering is **"Few-Shot" Prompting**.

**Few-Shot Prompting** involves providing the AI with one or more high-quality examples of the task being completed. This gives the model a concrete example to follow, dramatically improving the accuracy and consistency of its output.

**Example (Conceptual `show-dont-tell` few-shot prompt):**

> You are a creative writing instructor...
>
> **EXAMPLE 1:**
> - **Input Text:** "She was very angry."
> - **Your Output:** { "tellingSentence": "She was very angry.", "showingSuggestion": "Her knuckles turned white as she gripped the porcelain mug. She stared at the wall, her jaw a tight line of steel. 'Fine,' she clipped, the single word sharp enough to cut glass." }
>
> **EXAMPLE 2:**
> ...
>
> Now, analyze the following story text using the same process.
>
> **Story Text to Analyze:**
> \`\`\`
> {{{storyText}}}
> \`\`\`

Implementing few-shot prompting across our key analysis tools would be the next major step in maturing our AI capabilities.
