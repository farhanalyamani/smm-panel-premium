'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        setError(data.message);
        setPassword('');
      }
    } catch (err) {
      setError('Gagal koneksi ke server.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Login Akun</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Silahkan masuk untuk mengelola pesanan atau melakukan order.
        </p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            className="glass-card" 
            placeholder="Username..." 
            style={{ width: '100%', padding: '1rem', outline: 'none', color: '#f8fafc', marginBottom: '1rem', textAlign: 'center', letterSpacing: '1px' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input 
            type="password" 
            className="glass-card" 
            placeholder="Masukkan Password..." 
            style={{ width: '100%', padding: '1rem', outline: 'none', color: '#f8fafc', marginBottom: '1rem', textAlign: 'center', letterSpacing: '2px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          
          <button 
            type="submit" 
            className="glass-button" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
