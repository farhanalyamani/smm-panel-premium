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
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Masuk ke Akun
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Silakan login untuk melanjutkan
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="alert-warning" style={{ textAlign: 'left' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '1rem' }}
          >
            {loading ? '⏳ Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
