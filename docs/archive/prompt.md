### UI Building AI Prompt

**Objective:** Create a visually stunning and highly usable web application interface for "Vivid Voice," a tool that transforms written stories into multi-voice audio scenes.

**Core Functionality to Implement:**

The application has two main pages: a **Dashboard** and a **Story Creation Page**.

**1. Dashboard Page (`/dashboard`)**

*   **Purpose:** Displays a user's saved stories and allows them to create new ones.
*   **Authentication:** The page should handle user authentication. If the user is not logged in, they should be redirected to a login page.
*   **Loading State:** While stories are being fetched, a loading indicator should be displayed.
*   **Header:**
    *   A prominent "Your Stories" heading.
    *   A "New Story" button that navigates to the story creation page.
*   **Empty State:**
    *   If the user has no saved stories, display a message like "No Stories Found" with an icon (e.g., an open book).
    *   Include a "Create Your First Story" button.
*   **Story List:**
    *   Display stories in a grid or list format.
    *   Each story should be represented by a card that includes:
        *   The story's title.
        *   The last updated time (e.g., "updated 2 days ago").
        *   A snippet of the story text.
    *   Clicking on a story card should navigate the user to the story creation page with that story's data loaded.

**2. Story Creation Page (`/`)**

*   **Purpose:** Allows users to create new stories or edit existing ones.
*   **Layout:**
    *   **Story Input Area:** A large text area where the user can write or paste their story.
    *   **Analysis/Generation Button:** A button to trigger the story analysis and audio generation process.
    *   **Character Display:** A section to display the characters identified in the story, along with their generated portraits.
    *   **Dialogue Editor:** A component to edit the dialogue, assign voices, and adjust emotions.
    *   **Audio Player:** A player to listen to the generated audio.
*   **Workflow:**
    1.  The user enters a story and clicks "Generate."
    2.  The app shows a loading state while the story is parsed, and characters are identified.
    3.  The UI updates to show the dialogue editor and character portraits.
    4.  The user can make adjustments and then click "Generate Audio."
    5.  The app shows a loading state while the audio is generated.
    6.  The final audio is presented in the audio player.

**Styling and Design:**

*   **Open Interpretation:** You have complete creative freedom on the visual styling. Feel free to explore any aesthetic you think would be compelling and user-friendly.
*   **Key Considerations:**
    *   **Clarity and Readability:** The text should be easy to read.
    *   **Visual Hierarchy:** Important elements should stand out.
    *   **Feedback:** The UI should provide clear feedback to the user (e.g., loading states, success messages, error messages).
    *   **Branding:** The design should feel cohesive and professional.

**Technical Details:**

*   The application is built with Next.js and Tailwind CSS.
*   You will be provided with the necessary components and data structures.
*   Your primary focus is on the UI/UX design and implementation.

This prompt provides all the necessary functional requirements while leaving the aesthetic and stylistic choices to the AI, allowing for a wide range of creative and unique UI designs.
