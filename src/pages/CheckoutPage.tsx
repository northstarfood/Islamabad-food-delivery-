import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import PageHeader from '../components/PageHeader';
import { getRestaurant } from '../data/restaurants';
import { DEMO_DELIVERY_FEE, formatPrice } from '../lib/format';
import { createOrderId, saveOrder } from '../lib/orders';
import type { Order } from '../types';
import { cardStyle, colors, demoNotice, inputStyle, pageStyle, primaryButton, sectionStyle } from '../ui';

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

// Accepts Pakistani mobile numbers like 03001234567, +923001234567, 0300-1234567
const PHONE_PATTERN = /^(?:\+92|92|0)?3\d{9}$/;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, restaurantId, subtotal, clearCart } = useCart();
  const restaurant = getRestaurant(restaurantId ?? undefined);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [storageError, setStorageError] = useState('');

  if (lines.length === 0) {
    return (
      <main style={pageStyle}>
        <PageHeader title="Checkout" backTo="/" backLabel="← Home" />
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) nextErrors.name = 'Please enter your name.';
    if (!PHONE_PATTERN.test(cleanPhone)) nextErrors.phone = 'Enter a valid mobile number, e.g. 0300 1234567.';
    if (address.trim().length < 10) nextErrors.address = 'Please enter a full delivery address (house, street, sector).';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      restaurantId: restaurantId ?? '',
      restaurantName: restaurant ? restaurant.name : 'Demo restaurant',
      customer: {
        name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
        notes: notes.trim(),
      },
      lines,
      subtotal,
      deliveryFee: DEMO_DELIVERY_FEE,
      total,
      paymentMethod: 'Cash on delivery',
      status: 'Placed (demo)',
    };

    if (!saveOrder(order)) {
      setStorageError('We could not save your demo order on this device. Check your browser storage settings and try again.');
      return;
    }

    setStorageError('');
    clearCart();
    navigate(`/order/${order.id}`, { replace: true, state: { order } });
  };

  const labelStyle = { display: 'block', fontWeight: 700, margin: '14px 0 6px' } as const;
  const errorStyle = { color: colors.error, fontSize: 14, margin: '6px 0 0' } as const;

  return (
    <main style={pageStyle}>
      <PageHeader title="Checkout" backTo="/cart" backLabel="← Back to cart" />
      <section style={sectionStyle}>
        <div style={demoNotice}>
          Demo checkout: no real order is sent to a restaurant and nothing will be delivered.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {storageError && (
            <p role="alert" style={{ color: colors.error, marginTop: 16 }}>
              {storageError}
            </p>
          )}
          <label htmlFor="name" style={labelStyle}>Full name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            style={inputStyle}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}

          <label htmlFor="phone" style={labelStyle}>Phone number</label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0300 1234567"
            style={inputStyle}
          />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}

          <label htmlFor="address" style={labelStyle}>Delivery address</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
            rows={3}
            placeholder="House / street / sector, Islamabad"
            style={inputStyle}
          />
          {errors.address && <p style={errorStyle}>{errors.address}</p>}

          <label htmlFor="notes" style={labelStyle}>Delivery notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={inputStyle}
          />

          <div style={{ ...cardStyle, marginTop: 20 }}>
            <strong>Payment</strong>
            <p style={{ margin: '6px 0 0' }}>💵 Cash on delivery (pay the rider)</p>
          </div>

          <div style={{ ...cardStyle, marginTop: 12 }}>
            <strong>Order summary</strong>
            {lines.map((l) => (
              <div key={l.itemId} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 12 }}>
                <span>{l.quantity} × {l.name}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{formatPrice(l.price * l.quantity)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span>Delivery fee (demo)</span>
              <span>{formatPrice(DEMO_DELIVERY_FEE)}</span>
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
              <strong>Total</strong>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <div style={{ marginTop: 18, marginBottom: 30 }}>
            <button type="submit" style={primaryButton}>
              Place demo order · {formatPrice(total)}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
