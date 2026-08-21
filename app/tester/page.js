'use client';
import { useState } from 'react';

export default function TesterPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const result = await res.json();
      setData(result);
    } catch (error) {
      setData({ status: false, data: error.message });
    }
    setLoading(false);
  };

  const syncDatabase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync');
      const result = await res.json();
      setData({ status: result.status, data: result.message });
    } catch (error) {
      setData({ status: false, data: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#0d0f14', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#3b82f6' }}>Tester Koneksi API Irvan Kede</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Klik tombol di bawah buat narik seluruh daftar layanan dan harga modal dari server pusat Irvan Kede.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={testApi} 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Menyedot...' : '1. Test Narik Data (Asli)'}
        </button>

        <button 
          onClick={syncDatabase} 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Sinkronisasi...' : '2. Sinkronkan ke Supabase (Mark-up 25%)'}
        </button>
      </div>

      {data && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflowX: 'auto' }}>
          <h3 style={{ color: data.status ? '#10b981' : '#ef4444' }}>
            Status: {data.status ? 'Berhasil (Tembus)' : 'Gagal'}
          </h3>
          <p style={{ marginBottom: '1rem' }}>Total Layanan Ditemukan: {data.data && Array.isArray(data.data) ? data.data.length : 0}</p>
          <pre style={{ fontSize: '12px', color: '#f4f4f5' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
