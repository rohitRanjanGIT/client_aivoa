// Minimal inline markdown for chat bubbles: **bold** and *italic*. Line breaks are handled
// by the caller's `whitespace-pre-wrap`, so we only need to parse inline emphasis.
function renderInline(text, keyBase) {
  const nodes = [];
  // Match **bold** first, then *italic*.
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{m[1]}</strong>);
    } else {
      nodes.push(<em key={`${keyBase}-i${i}`}>{m[2]}</em>);
    }
    last = regex.lastIndex;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function MarkdownText({ text }) {
  if (!text) return null;
  // Split into lines so we can turn "- " into real bullets while keeping spacing tidy.
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, idx) => {
        const bullet = /^\s*-\s+/.test(line);
        const content = bullet ? line.replace(/^\s*-\s+/, "") : line;
        return (
          <div key={idx} className={bullet ? "flex gap-1.5" : undefined}>
            {bullet && <span className="select-none">•</span>}
            <span>{renderInline(content, idx)}</span>
          </div>
        );
      })}
    </>
  );
}
