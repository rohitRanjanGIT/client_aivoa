import axios from "axios";

// Requests go to /api and are proxied to the FastAPI server by Vite (see vite.config.js).
const api = axios.create({ baseURL: "/api" });

export async function postChat({ threadId, message, model }) {
  const { data } = await api.post("/chat", { thread_id: threadId, message, model });
  return data; // { reply, form, notification, records }
}

export async function getForm(threadId) {
  const { data } = await api.get(`/session/${threadId}/form`);
  return data;
}

export async function getModels() {
  const { data } = await api.get("/models");
  return data; // { models: [{ id, label, note, recommended }], default }
}
