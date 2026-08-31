export default function Counter({ label, value, onChange }) {
  const dec = () => onChange(Math.max(0, value - 1));
  const inc = () => onChange(value + 1);

  const handleInput = (e) => {
    const n = parseInt(e.target.value, 10);
    onChange(Number.isNaN(n) ? 0 : Math.max(0, n));
  };

  return (
    <div className="counter">
      <span className="counter__label">{label}</span>
      <div className="counter__controls">
        <button type="button" className="counter__btn" onClick={dec} aria-label={`הפחת ${label}`}>
          −
        </button>
        <input
          className="counter__value"
          type="number"
          inputMode="numeric"
          value={value}
          onChange={handleInput}
        />
        <button type="button" className="counter__btn" onClick={inc} aria-label={`הוסף ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}
