import OrderForm from './components/OrderForm';

const stats = [
  { num: '2300+', label: 'Layanan' },
  { num: '⚡ Instan', label: 'Proses' },
  { num: '#1', label: 'Termurah' },
];

const categories = [
  { icon: '📸', name: 'Instagram' },
  { icon: '🎵', name: 'TikTok' },
  { icon: '▶️', name: 'YouTube' },
  { icon: '🛍️', name: 'Shopee' },
  { icon: '🐦', name: 'Twitter/X' },
  { icon: '📘', name: 'Facebook' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <span className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          🔥 Terpercaya & Termurah
        </span>
        <h1>
          Boost Sosmed Kamu<br />
          <span className="gradient-text">Instan & Otomatis!</span>
        </h1>
        <p>
          Platform SMM tangan pertama. Followers, Likes, Views, Jam Tayang — proses cepat, harga reseller, anti ribet.
        </p>
      </section>

      {/* Stats Row */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-num gradient-text">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category Chips */}
      <div className="chips-wrapper">
        {categories.map((c, i) => (
          <div key={i} className="chip">
            <span>{c.icon}</span>
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      {/* Order Form */}
      <div className="order-section" style={{ marginTop: '2rem' }}>
        <OrderForm />
      </div>

      <footer className="footer">
        © 2026 SocialBoost — Semua hak dilindungi
      </footer>
    </main>
  );
}
