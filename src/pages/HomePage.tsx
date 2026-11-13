import { useState } from 'react';
import { ArrowDown, ArrowRight, Clock3, MapPin, Search, Store, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurants } from '../data/restaurants';

export default function HomePage() {
  const [search, setSearch] = useState('');

  const filtered = restaurants.filter((r) =>
    `${r.name} ${r.category} ${r.menu.map((m) => m.name).join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="home-page">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="FoodLane home">
            <span className="brand-mark"><UtensilsCrossed size={21} strokeWidth={2.2} /></span>
            <span>FoodLane<span className="brand-city">ISLAMABAD</span></span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#restaurants">Explore restaurants</a>
            <a className="nav-partner-link" href="#partners">Partner with us <ArrowRight size={15} /></a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><MapPin size={14} /> MADE FOR ISLAMABAD</span>
            <h1>Good food.<br /><span>Closer to home.</span></h1>
            <p className="hero-description">
              A local food discovery experience, starting with I-8 and the neighbourhoods around it.
            </p>
            <label className="search-box">
              <Search size={19} aria-hidden="true" />
              <input
                aria-label="Search demo restaurants or food"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or dishes"
              />
              {search && (
                <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">
                  Clear
                </button>
              )}
            </label>
            <div className="hero-meta">
              <span><MapPin size={15} /> I-8 & nearby</span>
              <span className="meta-divider" aria-hidden="true" />
              <span><Store size={15} /> Partner demonstrations</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of a meal">
            <div className="hero-art-orbit orbit-one" />
            <div className="hero-art-orbit orbit-two" />
            <div className="hero-food">🥘</div>
            <div className="hero-art-caption"><span className="caption-dot" /> A taste of what's possible</div>
            <div className="hero-demo-stamp">DEMO<br />EXPERIENCE</div>
          </div>
        </div>
        <a className="scroll-cue" href="#restaurants"><ArrowDown size={16} /> Explore the demo</a>
      </section>

      <section className="demo-strip" aria-label="Demo disclosure">
        <div className="demo-strip-inner">
          <span className="demo-pill">DEMO EXPERIENCE</span>
          <p>Every restaurant, menu, price and order on this site is fictional. No restaurants are currently partnered, and orders or payments are not processed.</p>
        </div>
      </section>

      <section className="restaurants-section" id="restaurants">
        <div className="section-heading">
          <div>
            <span className="eyebrow section-eyebrow">A LOCAL TASTE</span>
            <h2>Explore the menu</h2>
            <p>Sample restaurant concepts for our I-8 partner demonstrations.</p>
          </div>
          <span className="listing-count">{filtered.length} demo {filtered.length === 1 ? 'listing' : 'listings'}</span>
        </div>

        {filtered.length > 0 ? (
          <div className="restaurant-grid">
            {filtered.map((r) => (
              <Link className="restaurant-link" key={r.id} to={`/restaurant/${r.id}`}>
                <article className="restaurant-card">
                  <div className="restaurant-card-top">
                    <div className="restaurant-emoji" aria-hidden="true">{r.emoji}</div>
                    <span className="demo-card-badge">DEMO LISTING</span>
                  </div>
                  <p className="restaurant-category">{r.category}</p>
                  <h3>{r.name}</h3>
                  <div className="restaurant-details">
                    <span>★ {r.rating} <span className="detail-muted">sample rating</span></span>
                    <span><Clock3 size={15} /> {r.time}</span>
                  </div>
                  <div className="restaurant-card-action">View sample menu <ArrowRight size={16} /></div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <Search size={22} />
            <p>No demo restaurants or dishes match: {search}</p>
            <button type="button" className="text-action" onClick={() => setSearch('')}>Clear search</button>
          </div>
        )}
      </section>

      <section className="partner-section" id="partners">
        <div className="partner-inner">
          <div className="partner-copy">
            <span className="eyebrow partner-eyebrow">FOR ISLAMABAD RESTAURANTS</span>
            <h2>Let's put local food in the spotlight.</h2>
            <p>
              FoodLane is preparing partner demonstrations in I-8 and nearby areas. The platform is being shaped to help restaurants present their menu online and give customers a simple way to explore it.
            </p>
            <a className="partner-cta" href="#restaurants">See the demo experience <ArrowRight size={17} /></a>
          </div>
          <div className="partner-benefits">
            <h3>What a partnership is designed to offer</h3>
            <div className="benefit-item">
              <span className="benefit-icon"><Store size={20} /></span>
              <div><strong>A dedicated restaurant presence</strong><p>Showcase your restaurant and menu in one easy-to-browse place.</p></div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon"><UtensilsCrossed size={20} /></span>
              <div><strong>Clear, digital menus</strong><p>Help nearby customers discover dishes and menu details.</p></div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon"><MapPin size={20} /></span>
              <div><strong>A neighbourhood-first start</strong><p>Bring I-8 and surrounding Islamabad communities into focus.</p></div>
            </div>
          </div>
          <p className="partner-note">This is a product demonstration. No partner applications are collected here, and no restaurants shown above are real FoodLane partners.</p>
        </div>
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark"><UtensilsCrossed size={18} /></span>
          <span>FoodLane<span className="brand-city">ISLAMABAD</span></span>
        </Link>
        <p>Built for local discovery. All listings and menus shown are demo content.</p>
        <a href="#restaurants">Back to top ↑</a>
      </footer>
    </main>
  );
}
