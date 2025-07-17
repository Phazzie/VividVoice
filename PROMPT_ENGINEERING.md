# Staging Stories - Prompt Engineering Guide

This document tracks the evolution of the AI prompts used in the Staging Stories application and outlines strategies for future improvements.

## Philosophy

The quality of the output from a Generative AI model is directly proportional to the quality of the prompt. Our goal is to use detailed, structured prompts that provide context, explicit instructions, and clear output formatting requirements. This reduces ambiguity and leads to more reliable, professional-grade results.

---

## Prompt Evolution

### Initial State: Sparse Prompts

The initial prompts in the application were effective but sparse. They typically consisted of a single paragraph describing the task.

**Example (Old `parseDialogue` prompt - conceptual):**

> "Parse the following story. Identify the characters and break the text into dialogue segments. Guess the emotion for each line."

While functional, this approach left much to the AI's interpretation, which could lead to inconsistent results, especially with complex or non-standard story formats.

---

### Current State: Detailed, Structured Prompts with Few-Shot Examples

All AI prompts in the application have been upgraded to a robust, structured format. One key flow (`show-dont-tell.ts`) has been further upgraded to use **Few-Shot Prompting**.

**Key Improvements:**
1.  **Role-Playing:** Prompts now begin by assigning a specific role to the AI (e.g., "You are an expert script analyst," "You are a meticulous continuity editor"). This grounds the AI in a specific context.
2.  **Explicit Instructions:** Tasks are broken down into numbered or bulleted steps, leaving no room for ambiguity.
3.  **Critical Formatting Rules:** Prompts now include a **"CRITICAL INSTRUCTIONS"** section for non-negotiable rules, such as output schema compliance or specific exclusions (e.g., "You MUST exclude the 'Narrator' from all character-specific metrics").
4.  **Schema-Driven Output:** All prompts reference a Zod schema for their output, ensuring the AI returns a predictable, well-structured JSON object.
5.  **Clear Data Delimitation:** Input data, like the story text, is clearly demarcated within the prompt using markdown code fences to prevent confusion.
6.  **Few-Shot Prompting (Implemented for `show-dont-tell`):** Providing the AI with one or more high-quality examples of the task being completed. This gives the model a concrete example to follow, dramatically improving the accuracy and consistency of its output.

**Example (New `show-dont-tell` prompt with few-shot example):**

> You are a creative writing instructor specializing in the "Show, Don't Tell" principle...
>
> **High-Quality Example:**
> - **Input "tellingSentence":** "She was very angry."
> - **Your "showingSuggestion" Output:** "Her knuckles turned white as she gripped the porcelain mug. She stared at the wall, her jaw a tight line of steel. 'Fine,' she clipped, the single word sharp enough to cut glass."
>
> Now, analyze the following story text using the same process.
>
> **Story Text to Analyze:**
> ```
> {{{storyText}}}
> ```

---

## Future Improvements

The next evolution in prompt engineering is to apply **"Few-Shot" Prompting** to all other relevant analysis tools. This will involve:
1.  Identifying the most nuanced AI flows (e.g., `analyzeSubtext`, `invertTropes`).
2.  Crafting a perfect input/output example for each one.
3.  Updating the prompt text to include the example, instructing the AI to follow the pattern.

This will be the next major step in maturing our AI capabilities and ensuring the highest quality results for our users.
