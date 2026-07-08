import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postChat } from "../api/client.js";
import { setForm, resetForm } from "../features/form/formSlice.js";
import {
  addMessage,
  setStatus,
  setError,
  setNotification,
  clearNotification,
  clearPendingInput,
  clearChat,
} from "../features/chat/chatSlice.js";
import RecordsList from "./RecordsList.jsx";
import MarkdownText from "./MarkdownText.jsx";

export default function AiAssistant() {
  const dispatch = useDispatch();
  const { threadId, messages, status, error, notification, model, pendingInput } =
    useSelector((s) => s.chat);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  // A sample query clicked in the sidebar lands here: drop it in the box and focus.
  useEffect(() => {
    if (pendingInput == null) return;
    setInput(pendingInput);
    dispatch(clearPendingInput());
    textareaRef.current?.focus();
  }, [pendingInput, dispatch]);

  // Auto-dismiss the toast after a few seconds.
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => dispatch(clearNotification()), 4000);
    return () => clearTimeout(t);
  }, [notification, dispatch]);

  const loading = status === "loading";

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    dispatch(addMessage({ role: "user", content: text }));
    setInput("");
    dispatch(setStatus("loading"));

    try {
      const { reply, form, notification: note, records } = await postChat({
        threadId,
        message: text,
        model,
      });
      dispatch(setForm(form));
      // When a turn returns records (list_interactions), show the table inline in the
      // chat instead of the model's verbose text list.
      const assistantMsg = records
        ? { role: "assistant", content: "Here are your saved interactions:", records }
        : { role: "assistant", content: reply || "Done." };
      dispatch(addMessage(assistantMsg));
      if (note) dispatch(setNotification(note));
      dispatch(setStatus("idle"));
    } catch (err) {
      const detail =
        err?.response?.data?.detail || "Something went wrong. Is the server running?";
      dispatch(addMessage({ role: "assistant", content: `⚠️ ${detail}` }));
      dispatch(setError(detail));
    }
  }

  function handleClear() {
    if (loading) return;
    dispatch(clearChat());
    dispatch(resetForm());
  }

  return (
    <>
      <div className="mb-3 border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h2 className="text-lg font-bold text-blue-600">AI Assistant</h2>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            title="Start a new conversation and clear the form"
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            🗑 Clear chat
          </button>
        </div>
        <p className="text-sm text-slate-400">Log interaction details here via chat</p>
      </div>

      {notification && (
        <div className="mb-3 flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 ring-1 ring-green-200">
          <span>✓ {notification}</span>
          <button
            type="button"
            onClick={() => dispatch(clearNotification())}
            className="ml-2 text-green-600/70 hover:text-green-800"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) =>
          m.records ? (
            // A records turn: show a short header + the interactions table inline.
            <div key={i} className="flex justify-start">
              <div className="w-full max-w-[95%] rounded-lg bg-cyan-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-cyan-100">
                {m.content && <p className="mb-2">{m.content}</p>}
                <RecordsList records={m.records} />
              </div>
            </div>
          ) : (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "space-y-1 bg-cyan-50 text-slate-700 ring-1 ring-cyan-100"
                }`}
              >
                {m.role === "user" ? m.content : <MarkdownText text={m.content} />}
              </div>
            </div>
          )
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-3 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder="Describe Interaction..."
          className="flex-1 resize-none rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          ▲<span>Log</span>
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  );
}
