import { useState } from 'react';
import Counter from './Counter';
import StatusBadge from './StatusBadge';
import BottleGauge from './BottleGauge';
import EditProductModal from './EditProductModal';
import { getCategoryIcon, getStatus, getTotal } from '../utils/inventory';

export default function ProductCard({ product, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const status = getStatus(product);
  const total = getTotal(product);

  return (
    <div className={`card card--${status}`}>
      <div className="card__top">
        <div className="card__media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span className="card__icon">{getCategoryIcon(product.category)}</span>
          )}
        </div>

        <div className="card__info">
          <h3 className="card__name">{product.name}</h3>
          <p className="card__meta">
            {product.category} · {product.supplier}
          </p>
          <div className="card__badges">
            <StatusBadge status={status} />
            <span className="card__total">סה"כ: {total}</span>
          </div>
        </div>

        <div className="card__gauge">
          <BottleGauge product={product} />
        </div>
      </div>

      <div className="card__counters">
        <Counter
          label="בר"
          value={product.bar_stock}
          onChange={(v) => onUpdate(product.id, { bar_stock: v })}
        />
        <Counter
          label="ארגזים"
          value={product.storage_boxes}
          onChange={(v) => onUpdate(product.id, { storage_boxes: v })}
        />
        <Counter
          label="בודדים"
          value={product.storage_singles}
          onChange={(v) => onUpdate(product.id, { storage_singles: v })}
        />
      </div>

      <button type="button" className="card__edit-link" onClick={() => setEditing(true)}>
        עריכת מינימום / יח׳ בארגז / תמונה
      </button>

      {editing && (
        <EditProductModal
          product={product}
          onSave={(patch) => onUpdate(product.id, patch)}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
