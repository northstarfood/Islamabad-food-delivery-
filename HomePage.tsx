import { useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurants } from '../data/restaurants';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(restaurants.flatMap((r) => r.category.split(' • '))))];

  const filtered = restaurants.filter(
    (r) =>
      (category === 'All' || r.category.split(' • ').includes(category)) &&
      `${r.name} ${r.category} ${r.menu.map((m) => m.name).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase())
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
        <div role="group" aria-label="Filter by category" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0 16px' }}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              style={{
                flex: '0 0 auto',
                minHeight: 40,
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid #0f4c5c',
                background: category === c ? '#0f4c5c' : 'white',
                color: category === c ? 'white' : '#0f4c5c',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
          {filtered.map((r) => (
            <Link
              key={r.id}
              to={`/restaurant/${r.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <article style={{ background: 'white', padding: 22, borderRadius: 14, boxShadow: '0 3px 14px #00000010', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ fontSize: 55 }}>{r.emoji}</div>
                <small style={{ color: '#b36b16' }}>DEMO LISTING</small>
                <h3>{r.name}</h3>
                <p>{r.category}</p>
                <p>⭐ {r.rating} · 🕒 {r.time}</p>
                <p style={{ color: '#0f4c5c', fontWeight: 700 }}>View menu →</p>
              </article>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p>No demo restaurants match your search.</p>}
        <p style={{ marginTop: 25, color: '#777' }}>Sample listings for development only. Real restaurants will be added after partner onboarding.</p>
      </section>
      <footer style={{ padding: 25, textAlign: 'center' }}>Made for Islamabad ❤️</footer>
    </main>
  );
}
