import { createSlice } from "@reduxjs/toolkit";

const GREETING = {
  role: "assistant",
  content:
    'Log interaction details here (e.g., "Met Dr. Smith, discussed Prodo-X efficacy, positive sentiment, shared brochure"). You can also say "save it", "show my records", "open #3", or "delete #3".',
};

const initialState = {
  // thread_id is generated once per browser session and sent with every request.
  threadId: crypto.randomUUID(),
  messages: [GREETING],
  status: "idle", // idle | loading | error
  error: null,
  notification: null, // transient toast text from the last tool
  records: null, // last list_interactions result, for the records table
  models: [], // model catalog from /api/models
  model: null, // selected model id (null = server default)
  pendingInput: null, // text pushed from the sidebar into the chat box
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "error";
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setRecords: (state, action) => {
      // Only replace when a response actually carried records; keep the last list otherwise.
      if (action.payload) state.records = action.payload;
    },
    setModels: (state, action) => {
      state.models = action.payload.models || [];
      // Default the selection to the server default (or the first model) on first load.
      if (!state.model) state.model = action.payload.default || state.models[0]?.id || null;
    },
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setPendingInput: (state, action) => {
      state.pendingInput = action.payload;
    },
    clearPendingInput: (state) => {
      state.pendingInput = null;
    },
    clearChat: (state) => {
      // Start a fresh conversation: new thread id gives the agent a clean form/history
      // on the backend too. Keep the model selection and the loaded model catalog.
      state.threadId = crypto.randomUUID();
      state.messages = [GREETING];
      state.status = "idle";
      state.error = null;
      state.notification = null;
      state.records = null;
      state.pendingInput = null;
    },
  },
});

export const {
  addMessage,
  setStatus,
  setError,
  setNotification,
  clearNotification,
  setRecords,
  setModels,
  setModel,
  setPendingInput,
  clearPendingInput,
  clearChat,
} = chatSlice.actions;
export default chatSlice.reducer;
