# AI-First CRM — Frontend (React + Redux)

Frontend for the HCP "Log Interaction" screen: a three-pane layout — a **sidebar** (model
switcher + feature guide), a **read-only Interaction form**, and an **AI Assistant chat**. The
form never accepts manual input; every change flows through the chat to the backend agent.
Companion backend repo: **server_aivoa**.

## Stack
React + Vite · Redux Toolkit · Tailwind CSS · Google Inter font · axios.

## Setup & run
```bash
npm install
npm run dev          # http://localhost:5173
```
The Vite dev server proxies `/api` to the backend on `http://localhost:8000` (see
`vite.config.js`), so start **server_aivoa** first.

## Features
- **Sidebar** — collapsible; switch the AI model on the fly and browse what you can ask, each
  with a hover **Try** button that drops a sample query into the chat.
- **Interaction form** — fully read-only, rendered from the agent-owned Redux `form` slice.
- **AI Assistant** — chat with the agent; saved-record listings render as an inline table.
  Includes a **Clear chat** button that starts a fresh thread and empties the form.

## Layout
```
src/
  App.jsx            three-pane layout (sidebar · form · chat)
  store.js           Redux store
  features/form/     formSlice (agent-owned form state)
  features/chat/     chatSlice (messages, threadId, model, ...)
  api/client.js      axios calls to /api
  components/        Sidebar, InteractionForm, AiAssistant, RecordsList
```

## Build
```bash
npm run build        # outputs to dist/
```
