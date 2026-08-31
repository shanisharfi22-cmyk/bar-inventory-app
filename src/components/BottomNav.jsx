export default function BottomNav({ screen, onChange, ordersCount }) {
  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={`bottom-nav__item ${screen === 'count' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onChange('count')}
      >
        <span className="bottom-nav__icon">📋</span>
        <span>ספירה</span>
      </button>
      <button
        type="button"
        className={`bottom-nav__item ${screen === 'orders' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onChange('orders')}
      >
        <span className="bottom-nav__icon">
          🛒
          {ordersCount > 0 && <span className="bottom-nav__badge">{ordersCount}</span>}
        </span>
        <span>הזמנות</span>
      </button>
    </nav>
  );
}
