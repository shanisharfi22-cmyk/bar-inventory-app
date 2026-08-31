export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="חיפוש מוצר…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
