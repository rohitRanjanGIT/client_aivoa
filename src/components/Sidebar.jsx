import { useSelector, useDispatch } from "react-redux";
import { setModel, setPendingInput } from "../features/chat/chatSlice.js";

// The 8 LangGraph tools, as a concise list of what the assistant can do. Each has a
// sample query surfaced by the hover "Try" button (drops it into the chat box).
const FEATURES = [
  {
    icon: "📝",
    title: "Log an interaction",
    sample:
      "Today I met Dr. Smith, discussed Prodo-X efficacy, positive sentiment, shared brochures.",
  },
  {
    icon: "✏️",
    title: "Edit / correct details",
    sample: "Actually the name was Dr. John and the sentiment was negative.",
  },
  { icon: "💾", title: "Save the interaction", sample: "Save this interaction." },
  { icon: "📋", title: "Show saved records", sample: "Show my saved interactions." },
  { icon: "📂", title: "Open a record to edit", sample: "Open interaction #1 for editing." },
  {
    icon: "🔄",
    title: "Update the open record",
    sample: "Change the sentiment to positive and update it.",
  },
  { icon: "🗑️", title: "Delete a record", sample: "Delete interaction #1." },
  { icon: "🧹", title: "Clear the form", sample: "Clear the form." },
];

export default function Sidebar({ collapsed = false, onToggle }) {
  const dispatch = useDispatch();
  const { models, model } = useSelector((s) => s.chat);

  // Collapsed rail: just an expand button plus a couple of vertical hints.
  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          aria-expanded="false"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700"
        >
          »
        </button>
        <div
          className="mt-2 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-slate-400"
          style={{ writingMode: "vertical-rl" }}
        >
          Assistant Settings
        </div>
        <span className="mt-auto text-lg" title="Model &amp; feature guide">
          ⚙️
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-600">Assistant Settings</h2>
          <p className="text-sm text-slate-400">Pick a model and see what you can ask.</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
          aria-expanded="true"
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700"
        >
          «
        </button>
      </div>

      {/* Model switcher */}
      <div>
        <label
          htmlFor="model-select"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          AI Model
        </label>
        <select
          id="model-select"
          value={model || ""}
          onChange={(e) => dispatch(setModel(e.target.value))}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {models.length === 0 && <option value="">Loading…</option>}
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
              {m.recommended ? " ★" : ""}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-400">
          {models.find((m) => m.id === model)?.note ||
            "Switch models any time — your form and history are preserved."}
        </p>
      </div>

      {/* Feature guide */}
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          What you can ask
        </h3>
        <p className="mb-3 text-xs text-slate-400">
          The form is <span className="font-medium">read-only</span> — everything is driven
          by chat.
        </p>
        <ul className="space-y-1">
          {FEATURES.map((f) => (
            <li
              key={f.title}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <span>{f.icon}</span>
              <span>{f.title}</span>
              <button
                type="button"
                onClick={() => dispatch(setPendingInput(f.sample))}
                title={`Try: "${f.sample}"`}
                className="ml-auto rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 opacity-0 ring-1 ring-blue-100 transition hover:bg-blue-100 focus:opacity-100 group-hover:opacity-100"
              >
                Try
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
