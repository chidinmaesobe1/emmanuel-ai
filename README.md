# EMMANUEL AI

A starter project for an installable purple-and-black AI assistant website, with a Node.js backend that can use OpenAI and Gemini and fall back to the other provider if the first one fails.

## What is included

- Responsive website UI
- Friendly, Professional, and Genius personalities
- OpenAI/Gemini provider selection and automatic fallback
- Server-side API key handling
- Browser voice input and spoken answers (browser support varies)
- Progressive Web App (PWA) files so the website can be installed on Android
- Demo mode when no API keys are configured

## Requirements

- Node.js 18 or newer
- An API key from OpenAI, Google AI Studio, or both

## Run locally

1. Install Node.js.
2. Extract this project folder.
3. Open a terminal in the project folder.
4. Run `npm install`.
5. Copy `.env.example` to `.env`.
6. Add your API key(s) to `.env`.
7. Run `npm start`.
8. Open `http://localhost:3000`.

You can leave both keys blank to explore the interface in demo mode.

## Important security notes

- Keep `.env` private. It is excluded by `.gitignore`.
- Never put provider API keys in `public/` files or share them in screenshots.
- Use HTTPS when deploying publicly.
- Add rate limiting, abuse protection, and appropriate usage limits before public launch.
- This starter does not yet include Google sign-in. Google authentication requires creating a Firebase project, enabling Google as a sign-in provider, and adding the Firebase web configuration. Do not collect passwords yourself.
- Chat history is currently kept only in the browser session and is not saved to an account.

## Install on Android

Deploy the website over HTTPS, open it in Chrome on Android, then use Chrome's menu and choose **Install app** or **Add to Home screen**. This creates an app-like shortcut. A native Play Store Android package is not included yet.

## Deploy

Deploy the Node.js app to a service that supports persistent Node servers. Set `OPENAI_API_KEY`, `GEMINI_API_KEY`, and optional model variables in the host's environment-variable settings. Do not upload your `.env` file.

## Next development steps

1. Add Firebase Google authentication.
2. Add user-specific cloud chat history and privacy controls.
3. Add rate limiting and usage limits.
4. Build a native Android wrapper or Android Studio project if a Play Store app is needed.
