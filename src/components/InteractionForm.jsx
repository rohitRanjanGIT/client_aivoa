import { useSelector } from "react-redux";
import MaterialsList from "./MaterialsList.jsx";

// NOTE: Every field here is read-only. Per the assignment's crucial rule, the form must
// never accept manual typed input — it is populated solely by the AI Assistant. These are
// display fields bound to the Redux `form` slice, not editable controls.

function Label({ children }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-slate-700">{children}</label>
  );
}

function ReadOnlyField({ value, placeholder }) {
  const isEmpty = value === undefined || value === null || value === "";
  return (
    <div
      className={`w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ${
        isEmpty ? "text-slate-400" : "text-slate-800"
      }`}
    >
      {isEmpty ? placeholder : value}
    </div>
  );
}

const SENTIMENT_STYLES = {
  Positive: "bg-green-50 text-green-700 ring-green-100",
  Neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  Negative: "bg-red-50 text-red-700 ring-red-100",
};

function SentimentBadge({ value }) {
  if (!value) return <ReadOnlyField value="" placeholder="Not set" />;
  const style = SENTIMENT_STYLES[value] || SENTIMENT_STYLES.Neutral;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${style}`}
    >
      {value}
    </span>
  );
}

export default function InteractionForm() {
  const form = useSelector((state) => state.form);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Log HCP Interaction</h1>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        Interaction Details
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>HCP Name</Label>
          <ReadOnlyField value={form.hcp_name} placeholder="Search or select HCP..." />
        </div>
        <div>
          <Label>Interaction Type</Label>
          <ReadOnlyField value={form.interaction_type} placeholder="Meeting" />
        </div>
        <div>
          <Label>Date</Label>
          <ReadOnlyField value={form.date} placeholder="Not set" />
        </div>
        <div>
          <Label>Time</Label>
          <ReadOnlyField value={form.time} placeholder="Not set" />
        </div>
      </div>

      <div className="mt-4">
        <Label>Attendees</Label>
        <ReadOnlyField
          value={(form.attendees || []).join(", ")}
          placeholder="Enter names or search..."
        />
      </div>

      <div className="mt-4">
        <Label>Topics Discussed</Label>
        <div className="min-h-[96px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 whitespace-pre-wrap">
          {form.topics_discussed || (
            <span className="text-slate-400">Enter key discussion points...</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Label>Sentiment</Label>
        <div>
          <SentimentBadge value={form.sentiment} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Materials Shared / Samples Distributed
        </h2>
        <MaterialsList items={form.materials_shared} />
      </div>
    </div>
  );
}
