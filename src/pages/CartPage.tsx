import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import PageHeader from '../components/PageHeader';
import QuantityStepper from '../components/QuantityStepper';
import { getRestaurant } from '../data/restaurants';
import { DEMO_DELIVERY_FEE, formatPrice } from '../lib/format';
import { cardStyle, colors, pageStyle, primaryButton, sectionStyle, textButton } from '../ui';

export default function CartPage() {
  const { lines, restaurantId, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const restaurant = getRestaurant(restaurantId ?? undefined);

  if (lines.length === 0) {
    return (
      <main style={pageStyle}>
        <PageHeader title="🛒 Your cart" />
        <section style={sectionStyle}>
          <p>Your cart is empty.</p>
          <Link to="/" style={primaryButton}>
            Browse demo restaurants
          </Link>
        </section>
      </main>
    );
  }

  const total = subtotal + DEMO_DELIVERY_FEE;

  return (
    <main style={pageStyle}>
      <PageHeader
        title="🛒 Your cart"
        backTo={restaurant ? `/restaurant/${restaurant.id}` : '/'}
        backLabel="← Back to menu"
      />
      <section style={sectionStyle}>
        {restaurant && (
          <p style={{ marginTop: 0 }}>
            From <strong>{restaurant.name}</strong> (demo)
          </p>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {lines.map((line) => (
            <article key={line.itemId} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{line.name}</strong>
                <strong style={{ whiteSpace: 'nowrap' }}>{formatPrice(line.price * line.quantity)}</strong>
              </div>
              <p style={{ margin: '4px 0 12px', color: colors.muted, fontSize: 14 }}>
                {formatPrice(line.price)} each
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <QuantityStepper
                  quantity={line.quantity}
                  itemName={line.name}
                  onChange={(q) => setQuantity(line.itemId, q)}
                />
                <button type="button" style={textButton} onClick={() => removeItem(line.itemId)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <div style={{ ...cardStyle, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Delivery fee (demo)</span>
            <span>{formatPrice(DEMO_DELIVERY_FEE)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: `1px solid ${colors.border}`,
              fontSize: 18,
            }}
          >
            <strong>Total</strong>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/checkout" style={primaryButton}>
            Continue to checkout
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button type="button" style={textButton} onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </section>
    </main>
  );
}
