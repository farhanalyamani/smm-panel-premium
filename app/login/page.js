'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Floating orbs background
function FloatingOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <div style={{
        position: 'absolute', width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        top: '-15%', left: '-10%', animation: 'orb-drift 12s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)',
        bottom: '-10%', right: '-8%', animation: 'orb-drift 14s ease-in-out 2s infinite alternate',
      }} />
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
        top: '40%', right: '20%', animation: 'orb-drift 10s ease-in-out 1s infinite alternate',
      }} />
    </div>
  );
}

// Animated dots grid
function DotGrid() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }} />
  );
}

// Individual stat badge
function StatBadge({ icon, label, value, delay }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', padding: '0.7rem 1rem',
      backdropFilter: 'blur(8px)',
      animation: `slide-in-left 0.5s ease ${delay}s both`,
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status) {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin');
      } else {
        setError(data.message || 'Username atau password salah!');
        setPassword('');
      }
    } catch {
      setError('Gagal koneksi ke server. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px',
    padding: '0.9rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    boxShadow: focused === name ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
  });

  return (
    <>
      <style>{`
        @keyframes orb-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer-line {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-split-left { display: flex; }
        @media (max-width: 768px) { .login-split-left { display: none; } }
      `}</style>

      <FloatingOrbs />
      <DotGrid />

      <div style={{
        display: 'flex', minHeight: '100dvh', position: 'relative', zIndex: 1,
        fontFamily: 'inherit',
      }}>
        {/* ===== LEFT PANEL (hidden on mobile) ===== */}
        <div className="login-split-left" style={{
          flex: 1, flexDirection: 'column', justifyContent: 'space-between',
          padding: '3rem', borderRight: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: '0.2rem',
            }}>
              SocialBoost<span style={{ WebkitTextFillColor: '#fff' }}>.</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              Admin Control Panel
            </div>
          </div>

          {/* Hero text */}
          <div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.15,
              letterSpacing: '-0.03em', marginBottom: '1.25rem',
            }}>
              Kelola Bisnis<br />
              <span style={{
                background: 'linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                animation: 'shimmer-line 3s linear infinite',
              }}>
                SMM-mu
              </span><br />
              dari Sini.
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.7, maxWidth: '340px', fontSize: '0.95rem' }}>
              Dashboard terpusat untuk menerima, memverifikasi, dan memproses semua pesanan followers, likes, & views pelangganmu.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <StatBadge icon="📦" label="Total Layanan" value="2.300+" delay={0.1} />
            <StatBadge icon="👥" label="Pelanggan Aktif" value="500+" delay={0.2} />
            <StatBadge icon="✅" label="Sukses Rate" value="99%" delay={0.3} />
          </div>

          {/* Footer credit */}
          <div style={{ fontSize: '0.72rem', color: '#334155' }}>
            © 2026 SocialBoost · Digital Kreatif
          </div>
        </div>

        {/* ===== RIGHT PANEL - Login Form ===== */}
        <div style={{
          width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 'clamp(2rem, 5vw, 3.5rem)',
          animation: 'login-card-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Mobile brand */}
          <div style={{ marginBottom: '2.5rem', display: 'block' }}>
            <div style={{
              fontSize: '1.3rem', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              SocialBoost<span style={{ WebkitTextFillColor: '#fff' }}>.</span>
            </div>
          </div>

          {/* Lock icon */}
          <div style={{
            width: 64, height: 64, borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', marginBottom: '1.75rem',
            boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
          }}>
            🔐
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            Selamat Datang
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Masuk sebagai Admin untuk mengakses dashboard dan mengelola pesanan pelanggan.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused('user')}
                onBlur={() => setFocused('')}
                autoComplete="username"
                style={inputStyle('user')}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  autoComplete="current-password"
                  style={{ ...inputStyle('pass'), paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b',
                    padding: 0, lineHeight: 1,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem',
                color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.75rem', padding: '1rem 1.5rem',
                background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800,
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(124,58,237,0.45)',
                transition: 'all 0.25s ease', letterSpacing: '0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Memproses...
                </>
              ) : (
                '🚀 Masuk Sekarang'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              🔒 Akses Aman & Terenkripsi
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
