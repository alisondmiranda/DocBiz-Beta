# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploying to GitHub Pages

This section provides instructions for deploying the application to GitHub Pages.

### 1. Build Step

Before deploying, you need to build the application:

*   **Install Dependencies:** If you haven't already, open your terminal in the project root and run:
    ```bash
    npm install
    ```
*   **Build the Application:** After installing dependencies, run the build script:
    ```bash
    npm run build
    ```
    This command will compile the application and generate static files in a `dist` folder in your project root.

### 2. GitHub Pages Configuration

Once the application is built, you need to configure your GitHub repository to serve from the `dist` folder:

*   Go to your repository settings on GitHub.
*   Navigate to the "Pages" section.
*   **Source:**
    *   **Option 1 (Recommended for simplicity):** Choose to deploy from your `main` (or `master`) branch. Then, select the `/dist` folder as the source for GitHub Pages.
    *   **Option 2 (Alternative):** If you prefer, you can push the *contents* of the `dist` folder to a separate branch (commonly named `gh-pages`). Then, select the `gh-pages` branch (and its root `/`) as the source.

GitHub Pages will then publish your site, and you should see a URL where it's accessible.

### 3. API Key Requirement

**Important:** This application requires a Google Gemini API Key to function correctly and make requests to the AI model.

*   **Obtain Your Own Key:** You must obtain your own API key from Google AI Studio (or your relevant Google Cloud project).
*   **Entering the API Key:** After deploying the application and opening it in your browser, you will find an input field specifically for your Gemini API Key. Paste your key into this field.
*   **Storage and Security:**
    *   The API key you provide is stored in your browser's `localStorage`. This is done for your convenience so you don't have to re-enter it every time you visit the page.
    *   The API key is **only** sent from your browser directly to Google's AI services when you make a request to process a document. It is **not** sent to or stored on any other server.
    *   Be mindful of who has access to your browser if you are on a shared computer.

Without a valid Gemini API Key entered in the application, the document processing features will not work.
