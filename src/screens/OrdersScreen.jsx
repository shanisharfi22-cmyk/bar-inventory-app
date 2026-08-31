import { useMemo, useState } from 'react';
import { getStatus, getTotal, needed, neededBoxes } from '../utils/inventory';
import { buildOrderMessage, buildWhatsappLink } from '../utils/whatsapp';

export default function OrdersScreen({ products, suppliers, onSetSupplierPhone }) {
  const [roundToBoxes, setRoundToBoxes] = useState(false);

  const grouped = useMemo(() => {
    const lacking = products.filter((p) => getStatus(p) === 'danger');
    const map = {};
    for (const p of lacking) {
      if (!map[p.supplier]) map[p.supplier] = [];
      map[p.supplier].push(p);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b, 'he'));
  }, [products]);

  const sendWhatsapp = (supplierName, items) => {
    const phone = suppliers[supplierName];
    if (!phone) {
      alert('נא להזין מספר טלפון לספק לפני שליחה.');
      return;
    }
    const message = buildOrderMessage(supplierName, items, roundToBoxes);
    window.open(buildWhatsappLink(phone, message), '_blank', 'noopener');
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>הזמנות</h1>
        <label className="toggle">
          <input
            type="checkbox"
            checked={roundToBoxes}
            onChange={(e) => setRoundToBoxes(e.target.checked)}
          />
          <span>עיגול לארגזים שלמים</span>
        </label>
      </header>

      {grouped.length === 0 && (
        <p className="empty-state">אין כרגע מוצרים מתחת למינימום. 🎉</p>
      )}

      <div className="orders-list">
        {grouped.map(([supplierName, items]) => (
          <section key={supplierName} className="order-group">
            <div className="order-group__header">
              <h2>{supplierName}</h2>
              <input
                className="order-group__phone"
                type="tel"
                placeholder="מספר טלפון (וואטסאפ)"
                value={suppliers[supplierName] || ''}
                onChange={(e) => onSetSupplierPhone(supplierName, e.target.value)}
              />
            </div>

            <ul className="order-group__items">
              {items.map((p) => (
                <li key={p.id}>
                  <span className="order-item__name">{p.name}</span>
                  <span className="order-item__qty">
                    {roundToBoxes ? neededBoxes(p) : needed(p)} {roundToBoxes ? 'ארגזים' : 'יח׳'}
                  </span>
                  <span className="order-item__detail">
                    (יש {getTotal(p)}, מינימום {p.min_limit})
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn--primary"
              onClick={() => sendWhatsapp(supplierName, items)}
            >
              שלח הזמנה בוואטסאפ
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
