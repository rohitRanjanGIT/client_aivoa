const SENTIMENT_DOT = {
  Positive: "bg-green-500",
  Neutral: "bg-slate-400",
  Negative: "bg-red-500",
};

// Presentational: renders a saved-interactions table for the records passed in.
export default function RecordsList({ records }) {
  if (!records) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Saved Interactions ({records.length})
      </p>
      {records.length === 0 ? (
        <p className="text-sm text-slate-400">No records yet.</p>
      ) : (
        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400">
              <tr>
                <th className="pr-2 font-medium">#</th>
                <th className="pr-2 font-medium">HCP</th>
                <th className="pr-2 font-medium">Date</th>
                <th className="font-medium">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t border-slate-200/70">
                  <td className="py-1 pr-2 font-mono text-slate-500">{r.id}</td>
                  <td className="py-1 pr-2 text-slate-700">{r.hcp_name || "—"}</td>
                  <td className="py-1 pr-2 text-slate-500">{r.date || "—"}</td>
                  <td className="py-1">
                    {r.sentiment ? (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            SENTIMENT_DOT[r.sentiment] || "bg-slate-300"
                          }`}
                        />
                        {r.sentiment}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {records.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Say “open #{records[0]?.id}” to edit or “delete #{records[0]?.id}”.
        </p>
      )}
    </div>
  );
}
