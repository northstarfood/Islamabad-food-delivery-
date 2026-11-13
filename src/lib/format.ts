// Placeholder delivery fee for the demo. Change when real pricing is decided.
export const DEMO_DELIVERY_FEE = 150;

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
