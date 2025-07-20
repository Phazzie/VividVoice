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
    *   Edge Cases: 5/5 (explicitly mentions excluding the narrator and handling of zero values)
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 2/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** Excellent conventional prompt. No improvement needed.

### 2. `analyze-emotional-tone.ts`

*   **Conventional:**
    *   Clarity: 4/5
    *   Role-Playing: 4/5
    *   Schema: 5/5
    *   Edge Cases: 2/5 (doesn't specify what to do if no emotion fits)
    *   Examples: 2/5 (no example provided)
*   **Unconventional:**
    *   Subversiveness: 1/5
    *   Creative Freedom: 2/5 (constrained to a list)
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Needs Improvement.** This prompt is a prime candidate for beefing up. The list of emotions is too restrictive. It should be encouraged to be more nuanced and even invent emotions if necessary. A few-shot example would be very beneficial.

### 3. `analyze-literary-devices.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 4/5 (has a high-quality example, but not a few-shot one)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Needs Improvement.** This is a good prompt that could be made great with a proper few-shot example.

### 4. `analyze-pacing.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 4/5
    *   Schema: 5/5
    *   Edge Cases: 5/5 (clear instructions on how to segment)
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 1/5
    *   Creative Freedom: 1/5
    *   Emotional Intelligence: 1/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** Excellent conventional prompt. No improvement needed.

### 5. `analyze-subtext.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 4/5 (has a high-quality example, but not a few-shot one)
*   **Unconventional:**
    *   Subversiveness: 4/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 3/5
*   **Verdict:** **Needs Improvement.** This is a strong candidate for a few-shot example to make it even more powerful. The nature of subtext is subtle, and a good example would dramatically improve performance.

### 6. `character-chat.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5 (the whole point of the prompt)
    *   Schema: 5/5
    *   Edge Cases: 3/5 (doesn't explicitly handle difficult questions)
    *   Examples: 2/5 (no example of a chat interaction)
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 5/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Needs Improvement.** This prompt could be improved by adding an example of a good chat interaction, and by encouraging the AI to be more daring in its responses, perhaps even refusing to answer certain questions if it's in character to do so.

### 7. `consistency-guardian.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 4/5 (has a high-quality example, but not a few-shot one)
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 2/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Needs Improvement.** A good candidate for a few-shot example.

### 8. `generate-character-portraits.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 1/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles narrator and failed generation)
    *   Examples: 1/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** This is more of an API call than a creative prompt. No improvement needed.

### 9. `generate-elevenlabs-tts.ts` & `generate-multi-voice-tts.ts`

*   **Verdict:** These are API calls, not creative prompts. No improvement needed. `generate-emotional-tts.ts` is obsolete.

### 10. `generate-sound-design.ts`

*   **Conventional:**
    *   Clarity: 4/5
    *   Role-Playing: 4/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 1/5
*   **Unconventional:**
    *   Subversiveness: 1/5
    *   Creative Freedom: 3/5
    *   Emotional Intelligence: 2/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 1/5
*   **Verdict:** **Needs Improvement.** This prompt would benefit from a high-quality few-shot example.

### 11. `parse-dialogue.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5
    *   Examples: 1/5
*   **Unconventional:**
    *   Subversiveness: 2/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** **Needs Improvement.** This is a complex prompt that would be greatly improved by a few-shot example.

### 12. `shift-perspective.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 3/5
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 3/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** Excellent unconventional prompt. No improvement needed.

### 13. `show-dont-tell.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 3/5
    *   Creative Freedom: 4/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 1/5
    *   Pushing Boundaries: 2/5
*   **Verdict:** Excellent prompt. No improvement needed.

### 14. `trope-inverter.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 4/5 (handles "not found" case)
    *   Examples: 4/5 (has a high-quality example, but not a few-shot one)
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 3/5
    *   Meta-Cognition: 2/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** **Needs Improvement.** This is a fantastic unconventional prompt, but it needs a proper few-shot example to be truly top-tier.

### 15. `unreliable-narrator.ts`

*   **Conventional:**
    *   Clarity: 5/5
    *   Role-Playing: 5/5
    *   Schema: 5/5
    *   Edge Cases: 5/5 (explicitly states not to change dialogue)
    *   Examples: 5/5 (excellent few-shot example)
*   **Unconventional:**
    *   Subversiveness: 5/5
    *   Creative Freedom: 5/5
    *   Emotional Intelligence: 4/5
    *   Meta-Cognition: 3/5
    *   Pushing Boundaries: 4/5
*   **Verdict:** Excellent unconventional prompt. No improvement needed.
