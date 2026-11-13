import type { Order } from '../types';

const STORAGE_KEY = 'foodlane-orders-v1';

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function createOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `FL-${n}`;
}

// Demo version: orders are saved on this device only.
// Later this function can send the order to Supabase instead.
export function saveOrder(order: Order): boolean {
  try {
    const next = [order, ...readAll()].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}
