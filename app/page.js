'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import OrderForm from './components/OrderForm';

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('id-ID')}{suffix}</span>;
}

// ===== FLOATING PARTICLES BACKGROUND =====
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.id % 2 === 0 ? 'rgba(124,58,237,0.6)' : 'rgba(236,72,153,0.5)',
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            opacity: p.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

// ===== MARQUEE TICKER =====
const tickerItems = [
  '🚀 Proses Instan', '❤️ 2.3 JUTA Likes Terkirim', '👥 850K+ Followers Terjual',
  '⚡ Layanan 24/7', '✅ Terpercaya 500+ Pelanggan', '🔥 Harga Paling Murah',
  '▶️ 1 Juta Views YouTube', '🎵 Trending TikTok', '🛡️ Anti Banned',
];

function MarqueeTicker() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  );
}

// ===== SOCIAL LOGO CHIPS =====
const platforms = [
  {
    name: 'Instagram',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  },
  {
    name: 'TikTok',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #010101, #2d2d2d)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.04-8.86a8.28 8.28 0 0 0 4.86 1.56V4.57a4.85 4.85 0 0 1-1.05-.12z"/></svg>`,
  },
  {
    name: 'YouTube',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #FF0000, #cc0000)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
  },
  {
    name: 'Shopee',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #EE4D2D, #ff7337)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.005 0C8.704 0 6.03 2.674 6.03 5.975h1.8a4.175 4.175 0 0 1 8.35 0h1.8C17.98 2.674 15.305 0 12.005 0zM4.432 7.775l-1.8 13.5h18.746l-1.8-13.5zm4.617 9.45a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7zm5.85 0a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7z"/></svg>`,
  },
  {
    name: 'Twitter/X',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #000, #222)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.851L1.254 2.25H8.08l4.258 5.631 5.906-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    name: 'Facebook',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #1877F2, #0d5cbf)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    name: 'Telegram',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #26A5E4, #0088cc)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  },
  {
    name: 'Spotify',
    color: '#fff',
    gradient: 'linear-gradient(135deg, #1DB954, #158a3e)',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  },
];

// ===== HOW TO ORDER STEPS =====
const steps = [
  { num: '01', title: 'Pilih Platform', desc: 'Pilih sosmed yang mau kamu boost — Instagram, TikTok, YouTube, dll.', icon: '📱' },
  { num: '02', title: 'Pilih Layanan', desc: 'Tentukan jenis layanan (Followers, Likes, Views) dan kualitas yang kamu mau.', icon: '🎯' },
  { num: '03', title: 'Isi Target & Jumlah', desc: 'Masukkan username/link akun kamu dan jumlah yang ingin dipesan.', icon: '✏️' },
  { num: '04', title: 'Konfirmasi via WA', desc: 'Klik tombol order, kamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.', icon: '💬' },
  { num: '05', title: 'Pesanan Diproses', desc: 'Admin langsung proses. Followers/Likes akan masuk otomatis — cepat dan aman!', icon: '🚀' },
];

export default function Home() {
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackOrder = async () => {
    if (!trackId) return;
    setIsTracking(true);
    setTrackResult(null);
    const id = trackId.replace('#', '').trim();
    const { data, error } = await supabase.from('smm_orders').select('*').eq('id', id).single();
    if (error || !data) {
      setTrackResult({ notFound: true });
    } else {
      setTrackResult(data);
    }
    setIsTracking(false);
  };

  return (
    <>
      <FloatingParticles />

      {/* Running Ticker */}
      <MarqueeTicker />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="hero">
          <span className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-block', animation: 'pulse-badge 2s ease-in-out infinite' }}>
            🔥 Terpercaya &amp; Termurah di Indonesia
          </span>
          <h1>
            Boost Sosmed Kamu<br />
            <span className="gradient-text">Instan &amp; Otomatis!</span>
          </h1>
          <p>
            Platform SMM tangan pertama. Followers, Likes, Views, Jam Tayang — proses cepat, harga reseller, anti ribet.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                const el = document.querySelector('.order-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', borderRadius: '99px', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' }}
            >
              🚀 Pesan Sekarang
            </button>
            <button 
              onClick={() => setShowTrackModal(true)}
              style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', color: '#f1f5f9', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔍 Lacak Pesanan
            </button>
          </div>
        </section>

        {/* Stats Row — Animated Counters */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num gradient-text">
              <AnimatedCounter end={2331} suffix="+" />
            </div>
            <div className="stat-label">Layanan Aktif</div>
          </div>
          <div className="stat-card">
            <div className="stat-num gradient-text">
              <AnimatedCounter end={500} suffix="+" />
            </div>
            <div className="stat-label">Pelanggan Puas</div>
          </div>
          <div className="stat-card">
            <div className="stat-num gradient-text">
              <AnimatedCounter end={99} suffix="%" />
            </div>
            <div className="stat-label">Sukses Rate</div>
          </div>
        </div>

        {/* Platform Grid with Real Logos */}
        <div style={{ padding: '0 1.2rem', marginBottom: '2rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1rem' }}>
            Platform yang Kami Dukung
          </p>
          <div className="platform-grid">
            {platforms.map((p, i) => (
              <div key={i} className="platform-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div
                  className="platform-logo-wrapper"
                  style={{ background: p.gradient }}
                  dangerouslySetInnerHTML={{ __html: p.logo }}
                />
                <span className="platform-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form */}
        <div className="order-section">
          <OrderForm />
        </div>

        {/* How To Order Guide */}
        <section style={{ padding: '0 1.2rem 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Panduan</span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, marginTop: '0.3rem' }}>
              Cara Pesan <span className="gradient-text">Mudah &amp; Cepat</span>
            </h2>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <div className="trust-row">
          {['🔒 Aman & Terpercaya', '⚡ Proses Instan', '💸 Harga Termurah', '📞 Support 24 Jam'].map((t, i) => (
            <div key={i} className="trust-badge">{t}</div>
          ))}
        </div>

        <footer className="footer">
          © 2026 SocialBoost — Semua hak dilindungi
        </footer>
      </main>

      {/* ================= MODAL TRACKING ================= */}
      {showTrackModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🔍 Lacak Pesanan</h3>
              <button 
                onClick={() => { setShowTrackModal(false); setTrackResult(null); setTrackId(''); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >✕</button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Masukkan ID Pesanan (Resi) yang kamu dapatkan saat memesan.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Contoh: 1024" 
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
              />
              <button 
                onClick={handleTrackOrder}
                disabled={isTracking || !trackId}
                style={{ padding: '0 1.2rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: (!trackId || isTracking) ? 'not-allowed' : 'pointer', opacity: (!trackId || isTracking) ? 0.6 : 1 }}
              >
                {isTracking ? '⏳' : 'Cek'}
              </button>
            </div>

            {/* HASIL TRACKING */}
            {trackResult && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem', animation: 'fade-in 0.3s ease' }}>
                {trackResult.notFound ? (
                  <div style={{ textAlign: 'center', color: '#f87171' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
                    <strong style={{ fontSize: '1rem', display: 'block' }}>Pesanan Tidak Ditemukan</strong>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pastikan ID pesanan yang dimasukkan sudah benar.</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Layanan</span>
                      <strong style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>{trackResult.service_name.split('|')[0]}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Target</span>
                      <strong style={{ fontSize: '0.85rem' }}>{trackResult.target}</strong>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Status Pesanan</span>
                      
                      {trackResult.status === 'pending' && (
                        <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.2rem' }}>⏳ MENUNGGU VERIFIKASI</div>
                      )}
                      
                      {(trackResult.status === 'processing' || trackResult.status === 'in progress') && (
                        <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>🚀 SEDANG DIPROSES</div>
                      )}
                      
                      {trackResult.status === 'completed' && (
                        <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>✅ SELESAI</div>
                      )}
                      
                      {(trackResult.status === 'failed' || trackResult.status === 'error' || trackResult.status === 'canceled') && (
                        <div>
                          <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>❌ DITOLAK / GAGAL</div>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                            Bukti pembayaran tidak sah atau target salah.
                          </p>
                          <a 
                            href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20komplain%20pesanan%20dengan%20ID%20%23" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ display: 'inline-block', padding: '0.6rem 1rem', background: '#25D366', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                          >
                            💬 Hubungi Admin
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
