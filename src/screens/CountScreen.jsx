import { useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import SupplierFilter from '../components/SupplierFilter';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { exportProductsToCsv } from '../utils/inventory';

export default function CountScreen({ products, onUpdate, onResetCounts }) {
  const [category, setCategory] = useState('הכל');
  const [supplier, setSupplier] = useState('הכל');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const suppliers = useMemo(
    () => [...new Set(products.map((p) => p.supplier))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    return products.filter((p) => {
      if (category !== 'הכל' && p.category !== category) return false;
      if (supplier !== 'הכל' && p.supplier !== supplier) return false;
      if (q && !p.name.includes(q)) return false;
      return true;
    });
  }, [products, category, supplier, query]);

  const handleReset = () => {
    if (confirm('לאפס את כל כמויות הספירה (בר, ארגזים, בודדים) לכל המוצרים?')) {
      onResetCounts();
    }
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>ספירת מלאי</h1>
        <div className="screen__actions">
          <button type="button" className="btn btn--ghost" onClick={() => exportProductsToCsv(products)}>
            ייצוא ל-CSV
          </button>
          <button type="button" className="btn btn--danger-ghost" onClick={handleReset}>
            איפוס ספירה
          </button>
        </div>
      </header>

      <div className="screen__filters">
        <SearchBar value={query} onChange={setQuery} />
        <SupplierFilter suppliers={suppliers} value={supplier} onChange={setSupplier} />
      </div>

      <CategoryTabs categories={categories} active={category} onChange={setCategory} />

      <div className="card-list">
        {filtered.length === 0 && <p className="empty-state">לא נמצאו מוצרים.</p>}
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
