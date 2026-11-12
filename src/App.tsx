import { useState } from 'react';

const restaurants = [
  { name: 'Demo Burger House', category: 'Burgers • Fast Food', time: '25–35 min', rating: '4.8', emoji: '🍔' },
  { name: 'Demo Pizza Corner', category: 'Pizza • Italian', time: '30–40 min', rating: '4.7', emoji: '🍕' },
  { name: 'Demo Wok Kitchen', category: 'Chinese • Asian', time: '25–35 min', rating: '4.6', emoji: '🍜' },
  { name: 'Demo Grill House', category: 'BBQ • Pakistani', time: '35–45 min', rating: '4.9', emoji: '🍗' },
];

export default function App() {
  const [search, setSearch] = useState('');

  const filtered = restaurants.filter((r) =>
    `${r.name} ${r.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', color: '#163b40', background: '#fffaf3', minHeight: '100vh' }}>
      <header style={{ padding: '22px 6%', background: '#0f4c5c', color: 'white' }}>
        <h2>🍽️ FoodLane Islamabad</h2>
        <p>📍 Islamabad, Pakistan</p>
      </header>

      <section style={{ padding: '55px 6%', textAlign: 'center', background: '#f7ead7' }}>
        <h1 style={{ fontSize: 'clamp(30px, 6vw, 52px)' }}>Your next favourite meal is just a few taps away.</h1>
        <p>Discover local restaurants and order your favourites in Islamabad.</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants or food..."
          style={{ padding: 15, width: 'min(90%, 420px)', borderRadius: 10, border: '1px solid #ccc', fontSize: 16 }}
        />
      </section>

      <section style={{ padding: '35px 6%' }}>
        <h2>Restaurants near you — I-8 & nearby</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
          {filtered.map((r) => (
            <article key={r.name} style={{ background: 'white', padding: 22, borderRadius: 14, boxShadow: '0 3px 14px #00000010' }}>
              <div style={{ fontSize: 55 }}>{r.emoji}</div>
              <small style={{ color: '#b36b16' }}>DEMO LISTING</small>
              <h3>{r.name}</h3>
              <p>{r.category}</p>
              <p>⭐ {r.rating} · 🕒 {r.time}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 25, color: '#777' }}>Sample listings for development only. Real restaurants will be added after partner onboarding.</p>
      </section>
      <footer style={{ padding: 25, textAlign: 'center' }}>Made for Islamabad ❤️</footer>
    </main>
  );
}
