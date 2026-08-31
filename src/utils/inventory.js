export const CATEGORY_ICONS = {
  'וויסקי': '🥃',
  'קוניאק': '🥃',
  'טקילה': '🌵',
  "ג'ין": '🌿',
  'וודקה': '❄️',
  'אניס': '🌊',
  'רום': '🏝️',
  'ליקרים ושונות': '🍮',
  'ורמוט': '🍇',
  'מיקסרים וסירופים': '🧃',
  'מיקסרים ושונות': '🧉',
  'קוקטיילים מוכנים': '🍹',
  "ג'ריקנים": '🧴',
  'יין לבן': '🥂',
  'יין רוזה': '🌸',
  'יין אדום': '🍷',
  'מבעבע': '🍾',
  'שמפניה': '🍾',
  'בירה': '🍺',
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '🍾';
}

export function getTotal(product) {
  return (
    (product.bar_stock || 0) +
    (product.storage_boxes || 0) * (product.units_per_box || 1) +
    (product.storage_singles || 0)
  );
}

// 'danger' = מתחת למינימום, 'warn' = מתקרב, 'ok' = במלאי
export function getStatus(product) {
  const total = getTotal(product);
  const min = product.min_limit || 0;
  if (total < min) return 'danger';
  if (total < min * 1.25 + 1) return 'warn';
  return 'ok';
}

export const STATUS_LABELS = {
  danger: 'מתחת למינימום',
  warn: 'מתקרב למינימום',
  ok: 'במלאי',
};

export function needed(product) {
  return Math.max(0, (product.min_limit || 0) - getTotal(product));
}

export function neededBoxes(product) {
  const upb = product.units_per_box || 1;
  return Math.ceil(needed(product) / upb);
}

export function exportProductsToCsv(products) {
  const headers = [
    'שם', 'קטגוריה', 'ספק', 'בר', 'ארגזים במחסן', 'בודדים במחסן',
    'יח׳ בארגז', 'סה"כ', 'מינימום להזמנה', 'סטטוס',
  ];
  const rows = products.map((p) => [
    p.name,
    p.category,
    p.supplier,
    p.bar_stock,
    p.storage_boxes,
    p.storage_singles,
    p.units_per_box,
    getTotal(p),
    p.min_limit,
    STATUS_LABELS[getStatus(p)],
  ]);

  const csvBody = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\r\n');

  // BOM so Excel opens UTF-8 Hebrew correctly.
  const blob = new Blob(['﻿' + csvBody], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `דוח-מלאי-בר-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
