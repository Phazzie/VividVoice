# Post-Audit Inventory & Accountability Prompt

This document contains a prompt designed to force a detailed, evidence-based audit of the application state. It serves as a tool to prevent context degradation and hallucination in future development sessions.

---

### The Accountability Audit Prompt

(You can copy and paste this into a future conversation to get a reliable state summary)

"Hello! Before we proceed, I need you to perform a full, evidence-based audit of the current application state. Do not rely on your memory, past conversations, or documentation like the `README`. Your analysis must be based *only* on the current, existing code in the project files.

Present your findings in a markdown table with the following columns:

1.  **Feature Name:** The name of the feature being audited.
2.  **Status:** Your assessment of the feature's status (`✅ Done`, `🟡 Partially Implemented / Mocked`, or `❌ Not Implemented`).
3.  **Code Evidence:** A concise code snippet from an existing file that proves the feature's status. This must be a direct quote from the code.
4.  **File Path:** The absolute path to the file where the code evidence can be found.
5.  **Explanation:** A brief explanation of *why* the code proves the status. If you claim a feature is missing or mocked, you must explain how you know.

Please audit the following list of features:"

*   Core Story Parsing
*   Character Portrait Generation
*   Multi-Voice Audio Generation
*   Synchronized "Karaoke" Highlighting
*   AI-Powered Sound Design
*   User Accounts & Login
*   Story Saving & Dashboard
*   Literary Device Scanner
*   Dialogue Dynamics Analyzer
*   Pacing Visualizer
*   Trope Inverter
*   AI Actor's Studio
*   Unreliable Narrator Mode
*   "Show, Don't Tell" Converter
*   Consistency Guardian
*   Subtext Analyzer
*   Perspective Shifter
*   Firestore Security Rules
*   Comprehensive Test Coverage

---

### Why This Prompt Works

*   **Forces Code-Grounded Reasoning:** By requiring a specific code snippet and file path for every single feature, it prevents me from making claims based on an inaccurate internal state. I have to *find the code* to back up my claim.
*   **Structured Output:** The table format makes it very difficult for me to be evasive or give a "half-hearted" answer. Each cell requires a specific piece of information.
*   **Proof of Absence:** Crucially, it forces me to explain *why* I believe a feature is missing if I can't find proof. I have to justify the `❌ Not Implemented` status, which requires a more rigorous check.

This prompt makes me your auditor, not just your coder. It will serve as an excellent "reset" and accountability mechanism for our future work.
