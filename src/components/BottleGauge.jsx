import { getTotal, getStatus } from '../utils/inventory';

const STATUS_COLOR_VAR = {
  danger: 'var(--danger)',
  warn: 'var(--warn)',
  ok: 'var(--ok)',
};

// Small SVG "bottle" whose liquid level reflects stock relative to the
// product's minimum order limit — a quick visual read alongside the numbers.
export default function BottleGauge({ product, size = 34 }) {
  const total = getTotal(product);
  const status = getStatus(product);
  const target = Math.max(product.min_limit * 1.5, product.min_limit + 1, 1);
  const fraction = Math.max(0, Math.min(1, total / target));

  const bodyTop = 10;
  const bodyBottom = 40;
  const bodyHeight = bodyBottom - bodyTop;
  const liquidTop = bodyBottom - fraction * bodyHeight;
  const color = STATUS_COLOR_VAR[status];

  return (
    <svg
      width={size}
      height={size * (46 / 26)}
      viewBox="0 0 26 46"
      role="img"
      aria-label={`רמת מלאי: ${total} מתוך יעד ${target}`}
    >
      <clipPath id={`bottle-clip-${product.id}`}>
        <path d="M9 2 H17 V9 C17 10 20 10.5 20 14 V42 C20 44 18.5 45 16.5 45 H9.5 C7.5 45 6 44 6 42 V14 C6 10.5 9 10 9 9 V2 Z" />
      </clipPath>
      <path
        d="M9 2 H17 V9 C17 10 20 10.5 20 14 V42 C20 44 18.5 45 16.5 45 H9.5 C7.5 45 6 44 6 42 V14 C6 10.5 9 10 9 9 V2 Z"
        fill="var(--bg-elev-2)"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <rect
        x="6"
        y={liquidTop}
        width="14"
        height={bodyBottom - liquidTop}
        fill={color}
        clipPath={`url(#bottle-clip-${product.id})`}
      />
    </svg>
  );
}
