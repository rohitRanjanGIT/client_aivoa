export default function MaterialsList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-400">No materials added.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-100"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
