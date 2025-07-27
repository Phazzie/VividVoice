# AI Prompt Audit

This document contains a detailed analysis and grading of every AI prompt in the `src/ai/flows/` directory. Each prompt is graded on 5 conventional and 5 unconventional criteria, each on a scale of 1-5.

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

## Prompt Analysis

### 1. `analyze-dialogue-dynamics.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Excellent.** The addition of `powerPlays` pushes this prompt into a more analytical and psychological dimension.

### 2. `analyze-emotional-tone.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Excellent.** The prompt is now much more powerful and encourages creative, nuanced analysis.

### 3. `analyze-literary-devices.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Excellent.** The few-shot example makes this a top-tier conventional prompt.

### 4. `analyze-pacing.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 2/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Excellent.** The `pacingFeel` property adds a much-needed layer of qualitative analysis.

### 5. `analyze-subtext.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 4/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 3/5
*   **Verdict:** **Excellent.** The new example perfectly illustrates the concept of subtext.

### 6. `character-chat.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 4/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 5/5
*   **Verdict:** **Excellent.** This prompt now actively fights against the AI's helpful nature to produce more authentic character interactions.

### 7. `consistency-guardian.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 2/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Excellent.** The comprehensive example makes this a very effective prompt.

### 8. `generate-character-portraits.ts`

*   **Verdict:** This is more of an API call than a creative prompt. No improvement needed.

### 9. `generate-elevenlabs-tts.ts` & `generate-multi-voice-tts.ts`

*   **Verdict:** These are API calls, not creative prompts. No improvement needed.

### 10. `generate-sound-design.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 4/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 1/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Excellent.** The prompt is now much clearer for the AI.

### 11. `parse-dialogue.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Excellent.** The complex task is now much more clearly defined with the full example.

### 12. `shift-perspective.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 3/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Excellent.** The addition of the `format` input makes this an even more powerful and creative tool.

### 13. `show-dont-tell.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 3/5
*   **Verdict:** **Excellent.** The optional `style` parameter is a great feature for creative writers.

### 14. `trope-inverter.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Excellent.** This is now a top-tier unconventional prompt.

### 15. `unreliable-narrator.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5
    *   Examples: 5/5
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 4/5
    *   Pushing Boundaries: 5/5
*   **Verdict:** **Excellent.** The evolving bias is a master-level feature.
