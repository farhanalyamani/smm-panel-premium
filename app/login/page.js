'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>🔐</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portal Admin
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Silakan masuk untuk mengelola pesanan.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff' }}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff' }}
            required
          />

          {error && (
            <div className="alert-warning" style={{ textAlign: 'left' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff', 
              fontWeight: 800, 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? '⏳ Memproses...' : '🚀 Masuk Sekarang'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#475569', fontWeight: 600, letterSpacing: '0.05em' }}>
          SECURE SMM PANEL ACCESS
        </div>
      </div>
    </div>
  );
}
