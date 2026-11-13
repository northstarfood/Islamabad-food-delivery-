import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartLine } from '../types';

const STORAGE_KEY = 'foodlane-cart-v1';
const MAX_QUANTITY = 20;

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.itemId === 'string' &&
    typeof o.restaurantId === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.quantity === 'number'
  );
}

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  restaurantId: string | null;
  itemCount: number;
  subtotal: number;
  addItem: (line: Omit<CartLine, 'quantity'>) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadLines);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable (e.g. private mode). Cart still works in memory.
    }
  }, [lines]);

  const addItem = useCallback((line: Omit<CartLine, 'quantity'>) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.itemId === line.itemId);
      if (existing) {
        return prev.map((l) =>
          l.itemId === line.itemId ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QUANTITY) } : l
        );
      }
      return [...prev, { ...line, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.itemId !== itemId)
        : prev.map((l) => (l.itemId === itemId ? { ...l, quantity: Math.min(quantity, MAX_QUANTITY) } : l))
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      restaurantId: lines.length > 0 ? lines[0].restaurantId : null,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [lines, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
