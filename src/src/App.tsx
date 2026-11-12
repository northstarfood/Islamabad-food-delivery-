import { useState } from 'react';

const restaurants = [
  { name: 'Demo Burger House', category: 'Burgers • Fast Food', time: '25–35 min', rating: '4.8', emoji: '🍔', color: '#FFF0D8' },
  { name: 'Demo Pizza Corner', category: 'Pizza • Italian', time: '30–40 min', rating: '4.7', emoji: '🍕', color: '#FCE8E5' },
  { name: 'Demo Wok Kitchen', category: 'Chinese • Asian', time: '25–35 min', rating: '4.6', emoji: '🍜', color: '#E4F1E8' },
  { name: 'Demo Grill House', category: 'BBQ • Pakistani', time: '35–45 min', rating: '4.9', emoji: '🍗', color: '#F4E9DC' },
];

export default function App() {
  const [search, setSearch] = useState('');

  const filtered = restaurants.filter((restaurant) =>
    `${restaurant.name} ${restaurant.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#">🍽️ <span>Food<span className="brand-accent">Lane</span></span></a>
        <span className="location">📍 Islamabad, Pakistan</span>
      </header>

      <section className="hero">
        <p className="eyebrow">GOOD FOOD, RIGHT AROUND YOU</p>
        <h1>Your next favourite meal<br />is just a few taps away.</h1>
        <p className="hero-copy">Discover local restaurants and order your favourites in Islamabad.</p>
        <div className="search-box">
          <span>🔎</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search restaurants or food..."
          />
        </div>
      </section>

      <section className="restaurants">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE YOUR NEIGHBOURHOOD</p>
            <h2>Restaurants near you</h2>
          </div>
          <span className="area-tag">I-8 & nearby</span>
        </div>

        <div className="restaurant-grid">
          {filtered.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.name}>
              <div className="food-art" style={{ background: restaurant.color }}>
                <span>{restaurant.emoji}</span>
                <small>DEMO LISTING</small>
              </div>
              <div className="restaurant-info">
                <div className="restaurant-title">
                  <h3>{restaurant.name}</h3>
                  <span>★ {restaurant.rating}</span>
                </div>
                <p>{restaurant.category}</p>
                <div className="restaurant-meta">
                  <span>🕒 {restaurant.time}</span>
                  <span>Islamabad</span>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p>No matching restaurants found. Try another search.</p>}
        </div>
        <p className="demo-note">These are sample listings for development only. Real restaurant menus and orders will be added after partner onboarding.</p>
      </section>

      <footer>Made for Islamabad ❤️</footer>
    </main>
  );
}
