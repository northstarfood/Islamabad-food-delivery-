function readNumber(value: unknown, fallback: number): number {
  if (typeof value !== 'string' || value.trim() === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

// Configurable through environment variables (see .env.example).
// Defaults: Rs. 150 flat fee, no free-delivery threshold.
export const DELIVERY_FEE = readNumber(import.meta.env.VITE_DELIVERY_FEE, 150);
export const FREE_DELIVERY_ABOVE = readNumber(import.meta.env.VITE_FREE_DELIVERY_ABOVE, 0);

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (FREE_DELIVERY_ABOVE > 0 && subtotal >= FREE_DELIVERY_ABOVE) return 0;
  return DELIVERY_FEE;
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatDeliveryFee(fee: number): string {
  return fee === 0 ? 'Free' : formatPrice(fee);
}
