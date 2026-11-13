import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { formatPrice } from '../lib/format';
import { colors } from '../ui';

export default function CartBar() {
  const { itemCount, subtotal } = useCart();
  const { pathname } = useLocation();

  const hidden =
    pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/order');

  if (itemCount === 0 || hidden) return null;

  return (
    <>
      <div style={{ height: 84 }} aria-hidden="true" />
      <Link
        to="/cart"
        style={{
          position: 'fixed',
          left: '4%',
          right: '4%',
          bottom: 'max(12px, env(safe-area-inset-bottom))',
          boxSizing: 'border-box',
          minHeight: 52,
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: colors.teal,
          color: 'white',
          borderRadius: 14,
          textDecoration: 'none',
          fontWeight: 700,
          boxShadow: '0 4px 18px #00000040',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <span>🛒 View cart ({itemCount})</span>
        <span>{formatPrice(subtotal)}</span>
      </Link>
    </>
  );
}
