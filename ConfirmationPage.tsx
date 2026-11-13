import { Link, useLocation, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { formatDeliveryFee, formatPrice } from '../lib/format';
import { getOrder } from '../lib/orders';
import type { Order } from '../types';
import { cardStyle, colors, demoBadge, demoNotice, pageStyle, primaryButton, sectionStyle } from '../ui';

export default function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const order = stateOrder && stateOrder.id === orderId ? stateOrder : orderId ? getOrder(orderId) : undefined;

  if (!order) {
    return (
      <main style={pageStyle}>
        <PageHeader title="Order not found" />
        <section style={sectionStyle}>
          <p>We could not find that order on this device.</p>
          <Link to="/" style={primaryButton}>
            Back to restaurants
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <PageHeader title="Order placed ✅" backLabel="← Home" />
      <section style={sectionStyle}>
        <span style={demoBadge}>DEMO ORDER</span>
        <h2 style={{ marginBottom: 4 }}>Thank you, {order.customer.name}!</h2>
        <p style={{ marginTop: 0 }}>
          Order number: <strong>{order.id}</strong>
        </p>

        <div style={demoNotice}>
          This was a demo order. It was saved on this device only. No restaurant received it and nothing will be delivered.
        </div>

        <div style={{ ...cardStyle, marginTop: 16 }}>
          <strong>{order.restaurantName}</strong>
          {order.lines.map((l) => (
            <div key={l.itemId} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 12 }}>
              <span>{l.quantity} × {l.name}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{formatPrice(l.price * l.quantity)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span>Delivery fee</span>
            <span>{formatDeliveryFee(order.deliveryFee)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              paddingTop: 10,
              borderTop: `1px solid ${colors.border}`,
              fontSize: 18,
            }}
          >
            <strong>Total to pay</strong>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <div style={{ ...cardStyle, marginTop: 12 }}>
          <strong>Delivery details</strong>
          <p style={{ margin: '8px 0 0' }}>{order.customer.name}</p>
          <p style={{ margin: '4px 0 0' }}>{order.customer.phone}</p>
          <p style={{ margin: '4px 0 0' }}>{order.customer.address}</p>
          {order.customer.notes && <p style={{ margin: '4px 0 0', color: colors.muted }}>Notes: {order.customer.notes}</p>}
          <p style={{ margin: '10px 0 0' }}>💵 Payment: {order.paymentMethod}</p>
        </div>

        <div style={{ marginTop: 18, marginBottom: 30 }}>
          <Link to="/" style={primaryButton}>
            Back to restaurants
          </Link>
        </div>
      </section>
    </main>
  );
}
