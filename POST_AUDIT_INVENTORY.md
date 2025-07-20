# Post-Improvement AI Prompt Audit

This document contains a detailed analysis and grading of the improved AI prompts in the `src/ai/flows/` directory. Each prompt is graded on 5 conventional and 5 unconventional criteria, each on a scale of 1-5.

## Grading Criteria

### Conventional Criteria

1.  **Clarity of Instructions:** How clearly are the steps and requirements articulated? (1=Vague, 5=Crystal Clear)
2.  **Role-Playing:** Does the prompt effectively assign a role to the AI? (1=No Role, 5=Expert Persona)
3.  **Output Schema Definition:** Is the expected output format clearly defined and referenced? (1=Undefined, 5=Strictly Enforced Schema)
4.  **Handling of Edge Cases:** Does the prompt guide the AI on what to do with ambiguous or empty input? (1=No Guidance, 5=Robust Guidance)
5.  **Use of Examples:** Does the prompt include examples to illustrate the desired output? (1=No Example, 5=High-Quality, Few-Shot Example)

### Unconventional Criteria

1.  **Subversiveness:** Does the prompt encourage the AI to think in novel or counter-intuitive ways? (1=Standard, 5=Highly Subversive)
2.  **Creative Freedom:** How much room does the prompt give the AI to generate truly creative and unexpected content? (1=Highly Constrained, 5=Total Freedom)
3.  **Emotional Intelligence:** Does the prompt require the AI to understand and reason about subtle human emotions and subtext? (1=Purely Technical, 5=Deep Emotional Analysis)
4.  **Meta-Cognitive Awareness:** Does the prompt ask the AI to reason about its own reasoning process? (1=No, 5=Yes, Deeply)
5.  **Pushing Boundaries:** Does the prompt actively encourage the AI to go beyond its typical "safe" and "helpful" responses? (1=Safe & Predictable, 5=Risky & Boundary-Pushing)

---

## Re-Grading of Improved Prompts

### 1. `analyze-emotional-tone.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles ambiguity by encouraging creativity)
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 5/5 (explicitly encourages inventing emotions)
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Excellent.** The prompt is now much more powerful and encourages creative, nuanced analysis.

### 2. `analyze-literary-devices.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (comprehensive few-shot example)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Excellent.** The few-shot example makes this a top-tier conventional prompt.

### 3. `analyze-subtext.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (powerful few-shot example)
*   **Unconventional:**
    *   Subversiveness: 4/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 3/5
*   **Verdict:** **Excellent.** The new example perfectly illustrates the concept of subtext.

### 4. `character-chat.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5 (explicitly tells the AI how to handle difficult questions)
    *   Examples: 5/5 (example shows a "daring" response)
*   **Unconventional:**
    *   Subversiveness: 4/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 5/5 (explicitly encourages being unhelpful)
*   **Verdict:** **Excellent.** This prompt now actively fights against the AI's helpful nature to produce more authentic character interactions.

### 5. `consistency-guardian.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (covers multiple inconsistency types)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 2/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Excellent.** The comprehensive example makes this a very effective prompt.

### 6. `generate-sound-design.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 4/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (clarifies the `segmentIndex` logic)
*   **Unconventional:**
    *   Subversiveness: 1/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Excellent.** The prompt is now much clearer for the AI.

### 7. `parse-dialogue.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (comprehensive, end-to-end example)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Excellent.** The complex task is now much more clearly defined with the full example.

### 8. `trope-inverter.ts` (Improved)

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5 (shows multiple, creative inversions)
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Excellent.** This is now a top-tier unconventional prompt.
