'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const statusConfig = {
  completed:   { label: 'SELESAI',    bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)',  icon: '✅' },
  pending:     { label: 'MENUNGGU',   bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)',  icon: '⏳' },
  processing:  { label: 'DIPROSES',  bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', border: 'rgba(56,189,248,0.3)',  icon: '🚀' },
  'in progress': { label: 'DIPROSES', bg: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: 'rgba(56,189,248,0.3)', icon: '🚀' },
  failed:      { label: 'GAGAL',      bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)', icon: '⚠️' },
  error:       { label: 'ERROR',      bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)', icon: '⚠️' },
  canceled:    { label: 'DIBATALKAN', bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)', icon: '❌' },
};

function getStatus(status) {
  return statusConfig[status] || { label: status.toUpperCase(), bg: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'rgba(255,255,255,0.1)', icon: '📋' };
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function LiveOrdersPage() {
  const [liveOrders, setLiveOrders] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        const res = await fetch('/api/customer/live-orders');
        const result = await res.json();
        if (result.status) {
          setLiveOrders(result.data);
          setLastRefresh(new Date());
          setCountdown(10);
        }
      } catch (err) {
        console.error('Failed to fetch live orders:', err);
      } finally {
        setIsLiveLoading(false);
      }
    };

    fetchLiveOrders();
    const fetchInterval = setInterval(fetchLiveOrders, 10000);
    
    const countdownInterval = setInterval(() => {
      setCountdown(c => (c <= 1 ? 10 : c - 1));
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const counts = {
    total: liveOrders.length,
    processing: liveOrders.filter(o => o.status === 'processing' || o.status === 'in progress').length,
    pending: liveOrders.filter(o => o.status === 'pending').length,
    completed: liveOrders.filter(o => o.status === 'completed').length,
  };

  return (
    <>
      <main style={{ minHeight: '100vh', padding: '6rem 1rem 3rem', background: '#020617', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        
        {/* Ambient blobs */}
        <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1.2rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '99px', color: '#f87171', fontSize: '0.78rem', fontWeight: 800,
              marginBottom: '1.25rem',
              animation: 'pulse-badge 2s ease-in-out infinite'
            }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
              LIVE — Memperbarui setiap {countdown}d
            </span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 30%, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aktivitas Pesanan
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: '500px', margin: '0.75rem auto 0' }}>
              Daftar 20 pesanan terbaru dari semua pelanggan. Target disensor otomatis demi menjaga privasi.
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Terlihat', value: counts.total, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
              { label: 'Diproses', value: counts.processing, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)' },
              { label: 'Menunggu', value: counts.pending, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
              { label: 'Selesai', value: counts.completed, color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: '16px', padding: '1.25rem 1rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Table Header */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px', padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>#Tiket</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Layanan</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Status</span>
            </div>

            {isLiveLoading && liveOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⏳</div>
                <div style={{ fontWeight: 600 }}>Memuat data real-time...</div>
              </div>
            ) : liveOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
                <div style={{ fontWeight: 600 }}>Belum ada pesanan masuk.</div>
              </div>
            ) : (
              <div>
                {liveOrders.map((order, idx) => {
                  const s = getStatus(order.status);
                  return (
                    <div key={order.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 150px',
                      padding: '1rem 1.5rem',
                      borderBottom: idx < liveOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'background 0.2s',
                      animation: `slide-in 0.35s ease both`,
                      animationDelay: `${idx * 0.04}s`,
                      opacity: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Ticket ID */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>#{order.id}</span>
                      </div>

                      {/* Service Info */}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>
                          {order.service_name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                          Target: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{order.target}</span>
                          {order.created_at && <span style={{ marginLeft: '0.75rem' }}>· {timeAgo(order.created_at)}</span>}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '99px',
                          fontSize: '0.7rem', fontWeight: 800,
                          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{ fontSize: '0.75rem' }}>{s.icon}</span>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Link href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ← Kembali ke Beranda
            </Link>
            {lastRefresh && (
              <span style={{ fontSize: '0.78rem', color: '#334155' }}>
                Terakhir diperbarui: {lastRefresh.toLocaleTimeString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </>
  );
}
