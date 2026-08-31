export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'הכל'}
        className={`tab ${active === 'הכל' ? 'tab--active' : ''}`}
        onClick={() => onChange('הכל')}
      >
        הכל
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={active === c}
          className={`tab ${active === c ? 'tab--active' : ''}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
