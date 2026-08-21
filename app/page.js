import OrderForm from './components/OrderForm';

export default function Home() {
  const sosmedCategories = [
    { name: 'Instagram', desc: 'Followers, Likes & Views', icon: '📸' },
    { name: 'TikTok', desc: 'Followers, Likes & Views', icon: '🎵' },
    { name: 'YouTube', desc: 'Subscribers & Jam Tayang', icon: '▶️' },
    { name: 'Shopee', desc: 'Followers & Likes Produk', icon: '🛍️' },
    { name: 'Twitter/X', desc: 'Followers & Retweets', icon: '🐦' },
    { name: 'Facebook', desc: 'Page Likes & Followers', icon: '📘' }
  ];

  return (
    <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Tingkatkan <span className="gradient-text">Engagement</span><br />Sosmed Kamu Instan!
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Platform termurah & terpercaya buat kebutuhan optimasi sosial media. Proses cepat, harga tangan pertama (reseller).
        </p>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {sosmedCategories.map((cat, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              {cat.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{cat.name}</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Order Form */}
      <OrderForm />
    </main>
  );
}
