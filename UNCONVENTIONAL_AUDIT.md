# Unconventional Codebase Audit

This audit evaluates the application's quality using unconventional but effective metrics. It goes beyond checking for feature completeness and instead analyzes architectural robustness, AI sophistication, and modularity.

---

### Metric 1: Seam Integrity Score (SIS)

*This metric rates the quality of the connection points ("seams") between different parts of the system (e.g., UI -> Action -> AI Flow) on a scale of 1-5. High scores indicate well-defined, decoupled, and robust connections.*

**File Under Review:** `src/lib/actions.ts`

**Code Evidence:**
```typescript
// The seam between the UI and the AI flows for parsing.
export async function getParsedStory(storyText: string): Promise<{...}> {
    // ... input validation ...
    try {
        const parsedResult = await parseDialogueFlow({ storyText });
        // ... output validation ...
        return parsedResult;
    } catch (error) {
        console.error('Fatal Error during getParsedStory action:', { error });
        throw new Error('Failed to process the story.');
    }
}
```

**Analysis:**
*   **SIS: 5/5 (Excellent).** This file is a perfect example of a high-integrity seam. It serves as the single gateway between the client-side components and all server-side AI logic.
    *   **Decoupling:** The UI (`page.tsx`) calls `getParsedStory`, but it has no knowledge of the underlying `parseDialogueFlow`. The AI flow can be completely replaced without the UI needing to change.
    *   **Error Handling:** Each action wraps its AI flow call in a `try/catch` block, providing structured error logging and throwing a user-friendly error message.
    *   **Type Safety:** It uses the shared Zod schemas from `src/ai/schemas.ts`, ensuring data consistency across the seam.

---

### Metric 2: Prompt Sophistication Level (PSL)

*This metric rates the maturity of each Genkit AI prompt. PSL-1 is basic, PSL-2 is structured with role-playing, and PSL-3 is advanced with few-shot examples.*

**File Under Review:** `src/ai/flows/trope-inverter.ts`

**Code Evidence:**
```typescript
const prompt = ai.definePrompt({
  //...
  prompt: `You are a brilliant and subversive literary critic...
For each trope you identify, you must provide:
1.  The 'trope' name...
2.  A direct 'quote'...
3.  A creative and insightful 'inversionSuggestion'...

Return your findings as a JSON object with a 'tropes' array...

**Story Text to Analyze:**
\`\`\`
{{{storyText}}}
\`\`\`
`,
});
```

**Analysis:**
*   **PSL: 2 (Structured).** This prompt is a strong example of a structured prompt.
    *   It uses clear role-playing ("You are a brilliant and subversive literary critic...").
    *   It provides explicit, numbered instructions on what to provide.
    *   It references a Zod schema for its output.
*   **Path to PSL-3:** This prompt could be upgraded to PSL-3 by adding a high-quality "few-shot" example. For instance, providing a classic trope like "Damsel in Distress" and a perfect example of an inversion suggestion would significantly improve the AI's consistency and creativity. The `show-dont-tell.ts` and `analyze-subtext.ts` flows are currently the only ones at PSL-3.

---

### Metric 3: Blast Radius Quotient (BRQ)

*This metric estimates how many other files would likely need changes if this file's core logic were significantly altered. A low BRQ indicates a well-encapsulated, modular file.*

**File Under Review:** `src/app/globals.css`

**Code Evidence:**
```css
@layer base {
  :root {
    /* Wombat's Workshop - Light Mode (Conceptual - not in use) */
    --background: 35 78% 96%;
    --foreground: 25 25% 20%;
    --primary: 18 88% 55%;
    /* ... more color variables ... */
  }

  .dark {
    /* Wombat's Workshop - Dark Mode */
    --background: 25 35% 12%;
    /* ... more color variables ... */
  }
}
```

**Analysis:**
*   **BRQ: 0 (Excellent).** This file has an exceptionally low blast radius. The entire application's color scheme is defined here using CSS variables. A designer could completely change the look and feel of the app by modifying *only this file*.
*   **Proof:** Components like `src/components/ui/button.tsx` use classes like `bg-primary` and `text-primary-foreground`. They don't contain hard-coded colors. They reference the variables defined in `globals.css`, so they will automatically adapt to any theme changes made here. This is a prime example of well-architected, low-BRQ styling.
