import axios from "axios";

// In dev, VITE_API_BASE_URL is empty so requests go to "/api" and Vite proxies them to the
// FastAPI server (see vite.config.js). In production (e.g. Vercel) set VITE_API_BASE_URL to the
// deployed backend origin, e.g. https://server-aivoa.vercel.app — there is no dev proxy there.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const api = axios.create({ baseURL: `${API_BASE}/api` });

export async function postChat({ threadId, message, model }) {
  const { data } = await api.post("/chat", {
    thread_id: threadId,
    message,
    model,
  });
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
