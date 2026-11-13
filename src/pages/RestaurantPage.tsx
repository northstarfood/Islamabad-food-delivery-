import { Link, useParams } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import PageHeader from '../components/PageHeader';
import QuantityStepper from '../components/QuantityStepper';
import { getRestaurant } from '../data/restaurants';
import { formatPrice } from '../lib/format';
import type { MenuItem } from '../types';
import { cardStyle, colors, demoBadge, demoNotice, pageStyle, sectionStyle, smallButton } from '../ui';

export default function RestaurantPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurant = getRestaurant(restaurantId);
  const { lines, restaurantId: cartRestaurantId, addItem, setQuantity, clearCart } = useCart();

  if (!restaurant) {
    return (
      <main style={pageStyle}>
        <PageHeader title="Restaurant not found" />
        <section style={sectionStyle}>
          <p>We could not find that restaurant.</p>
          <Link to="/">Back to restaurants</Link>
        </section>
      </main>
    );
  }

  const handleAdd = (item: MenuItem) => {
    if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
      const ok = window.confirm(
        'Your cart has items from another restaurant. Clear it and start a new cart here?'
      );
      if (!ok) return;
      clearCart();
    }
    addItem({
      itemId: item.id,
      restaurantId: restaurant.id,
      name: item.name,
      price: item.price,
    });
  };

  return (
    <main style={pageStyle}>
      <PageHeader title={`${restaurant.emoji} ${restaurant.name}`} backLabel="← All restaurants" />
      <section style={sectionStyle}>
        <span style={demoBadge}>DEMO RESTAURANT</span>
        <p style={{ margin: '10px 0 4px' }}>{restaurant.category}</p>
        <p style={{ margin: '0 0 16px' }}>⭐ {restaurant.rating} · 🕒 {restaurant.time}</p>
        <div style={demoNotice}>
          This is a demo restaurant with sample food and prices. It is not a real partner.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Sample menu</h3>
          <span style={{ ...demoBadge, fontSize: 10 }}>DEMO PRICES</span>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {restaurant.menu.map((item) => {
            const inCart = lines.find((l) => l.itemId === item.id);
            return (
              <article key={item.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ margin: '4px 0 0', color: colors.muted, fontSize: 14 }}>{item.description}</p>
                  </div>
                  <strong style={{ whiteSpace: 'nowrap' }}>{formatPrice(item.price)}</strong>
                </div>
                <div style={{ marginTop: 12 }}>
                  {inCart ? (
                    <QuantityStepper
                      quantity={inCart.quantity}
                      itemName={item.name}
                      onChange={(q) => setQuantity(item.id, q)}
                    />
                  ) : (
                    <button type="button" style={smallButton} onClick={() => handleAdd(item)}>
                      Add to cart
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
