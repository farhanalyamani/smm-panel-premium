'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function LiveOrdersPage() {
  const [liveOrders, setLiveOrders] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        const res = await fetch('/api/customer/live-orders');
        const result = await res.json();
        if (result.status) {
          setLiveOrders(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch live orders:', err);
      } finally {
        setIsLiveLoading(false);
      }
    };

    fetchLiveOrders();
    const intervalId = setInterval(fetchLiveOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '6rem 1rem 2rem', background: '#020617', color: '#f8fafc', position: 'relative' }}>
        
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', zIndex: 0 }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '99px', color: '#f87171', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', animation: 'pulse-badge 2s ease-in-out infinite' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
              LIVE UPDATES
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aktivitas Pesanan
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Pantau antrean pesanan yang sedang diproses secara real-time. Target disensor untuk menjaga privasi. Halaman ini diperbarui otomatis setiap 10 detik.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)' }}>
            
            {isLiveLoading && liveOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                <div style={{ fontSize: '2rem', animation: 'pulse-badge 1.5s infinite' }}>⏳</div>
                <div style={{ marginTop: '1rem' }}>Memuat pesanan real-time...</div>
              </div>
            ) : liveOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                Belum ada aktivitas pesanan baru.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {liveOrders.map((order, idx) => (
                  <div key={order.id} style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', 
                    padding: '1.25rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    animation: `fade-in 0.3s ease forwards`,
                    animationDelay: `${idx * 0.05}s`,
                    opacity: 0
                  }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8' }}>
                        #{order.id}
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                          {order.service_name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                          Target: <span style={{ color: '#fff', letterSpacing: '0.5px' }}>{order.target}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '99px',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      background: order.status === 'completed' ? 'rgba(52, 211, 153, 0.1)' : order.status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : (order.status === 'failed' || order.status === 'error' || order.status === 'canceled') ? 'rgba(248, 113, 113, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                      color: order.status === 'completed' ? '#34d399' : order.status === 'pending' ? '#fbbf24' : (order.status === 'failed' || order.status === 'error' || order.status === 'canceled') ? '#f87171' : '#38bdf8'
                    }}>
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
