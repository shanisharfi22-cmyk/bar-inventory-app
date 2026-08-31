import { useMemo, useState } from 'react';
import BottomNav from './components/BottomNav';
import CountScreen from './screens/CountScreen';
import OrdersScreen from './screens/OrdersScreen';
import { useProducts } from './hooks/useProducts';
import { useSuppliers } from './hooks/useSuppliers';
import { getStatus } from './utils/inventory';
import { supabaseConfigured } from './lib/supabaseClient';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('count');
  const { products, loading, error, updateProduct, resetCounts } = useProducts();
  const { suppliers, setSupplierPhone } = useSuppliers();

  const ordersCount = useMemo(
    () => products.filter((p) => getStatus(p) === 'danger').length,
    [products]
  );

  if (!supabaseConfigured) {
    return (
      <div className="setup-notice">
        <h1>חיבור ל-Supabase נדרש</h1>
        <p>
          עדכן/י את <code>VITE_SUPABASE_URL</code> ו-<code>VITE_SUPABASE_ANON_KEY</code> בקובץ{' '}
          <code>.env.local</code>, הרץ/י את <code>supabase/schema.sql</code> ו-
          <code>supabase/seed.sql</code> בפרויקט ה-Supabase, ואז הפעל/י מחדש את השרת.
          פרטים מלאים ב-README.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-screen">טוען מלאי…</div>;
  }

  if (error) {
    return (
      <div className="loading-screen">
        <p>שגיאה בטעינת המלאי: {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app__content">
        {screen === 'count' ? (
          <CountScreen products={products} onUpdate={updateProduct} onResetCounts={resetCounts} />
        ) : (
          <OrdersScreen products={products} suppliers={suppliers} onSetSupplierPhone={setSupplierPhone} />
        )}
      </main>
      <BottomNav screen={screen} onChange={setScreen} ordersCount={ordersCount} />
    </div>
  );
}
