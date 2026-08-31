import { getTotal, needed, neededBoxes } from './inventory';

export function buildOrderMessage(supplierName, products, roundToBoxes) {
  const lines = [`הזמנה עבור ${supplierName}:`, ''];
  for (const p of products) {
    const qty = roundToBoxes ? neededBoxes(p) : needed(p);
    const unit = roundToBoxes ? 'ארגזים' : 'יח׳';
    lines.push(`• ${p.name} — ${qty} ${unit} (יש ${getTotal(p)}, מינימום ${p.min_limit})`);
  }
  return lines.join('\n');
}

export function buildWhatsappLink(phone, message) {
  const digitsOnly = (phone || '').replace(/[^\d+]/g, '');
  // Normalize Israeli local numbers (05X-XXXXXXX) to international 972 format.
  const normalized = digitsOnly.startsWith('0')
    ? '972' + digitsOnly.slice(1)
    : digitsOnly.replace(/^\+/, '');
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
