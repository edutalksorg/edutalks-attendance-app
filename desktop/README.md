# Desktop wrapper (Electron)

This folder contains a minimal Electron `main.js` that will load the web app. To use:

1. Build the web app (`web-app`) and serve it (or set `ELECTRON_START_URL` to `http://localhost:3000` while developing).
2. Install Electron in this folder or run from workspace root: `npm i -D electron`.
3. Start Electron with: `ELECTRON_START_URL=http://localhost:3000 npx electron .`

This is intentionally minimal — the UI is provided by the web app build.
