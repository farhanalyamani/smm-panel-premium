'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Logo from './../components/Logo';

// ===== SIDEBAR COMPONENT =====
function Sidebar({ activePage, setActivePage, onLogout }) {
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'orders', icon: '📋', label: 'Pesanan' },
    { id: 'vendor', icon: '🔍', label: 'Cek Pusat' },
  ];

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: 'rgba(255,255,255,0.03)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
          <Logo size="1.3rem" />
        <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.15rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          Menu
        </div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s ease',
              background: activePage === item.id
                ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))'
                : 'transparent',
              color: activePage === item.id ? '#a78bfa' : '#64748b',
              borderLeft: activePage === item.id ? '3px solid #7c3aed' : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.9rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            width: '100%',
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ===== STAT CARD =====
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em', color: color || '#f1f5f9' }}>
        {value}
      </div>
    </div>
  );
}

// ===== OVERVIEW PAGE =====
function OverviewPage({ orders, syncing, onSync }) {
  const pending = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((a, o) => a + o.price, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>Selamat Datang, Admin 👋</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Ringkasan performa bisnis SocialBoost hari ini.</p>
        </div>
        <button
          onClick={onSync}
          disabled={syncing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            cursor: syncing ? 'not-allowed' : 'pointer',
            opacity: syncing ? 0.7 : 1,
          }}
        >
          {syncing ? '⏳ Menyinkronkan...' : '🔄 Sinkronkan Layanan'}
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Pesanan" value={orders.length} icon="📦" />
        <StatCard label="Menunggu Proses" value={pending} icon="⏳" color="#fbbf24" />
        <StatCard label="Selesai" value={completed} icon="✅" color="#34d399" />
        <StatCard label="Total Pemasukan" value={`Rp${totalRevenue.toLocaleString('id-ID')}`} icon="💰" color="#a78bfa" />
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 700, fontSize: '0.95rem' }}>
          📋 5 Pesanan Terbaru
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Layanan</th>
                <th>Target</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td style={{ color: '#475569', fontSize: '0.8rem' }}>#{order.id}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.service_name}</td>
                  <td style={{ color: '#94a3b8' }}>{order.target}</td>
                  <td style={{ color: '#34d399', fontWeight: 700 }}>Rp{order.price.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>{order.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#475569', padding: '2rem' }}>Belum ada pesanan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== VENDOR STATUS PAGE =====
function VendorStatusPage({ orders }) {
  const [checkingId, setCheckingId] = useState(null);
  const [statusModal, setStatusModal] = useState(null); // Data buat modal
  
  // Filter hanya order yang statusnya completed (sudah dilempar ke IrvanKede) dan punya provider_order_id
  const vendorOrders = orders.filter(o => o.status === 'completed' && o.provider_order_id);

  const handleCheckStatus = async (providerOrderId, id) => {
    setCheckingId(id);
    try {
      const res = await fetch('/api/vendor-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_order_id: providerOrderId })
      });
      const result = await res.json();
      
      if (result.status) {
        const d = result.data;
        setStatusModal({
          success: true,
          status: d.status,
          start_count: d.start_count || 0,
          remains: d.remains || 0
        });
      } else {
        setStatusModal({ success: false, message: result.message });
      }
    } catch (error) {
      alert('Error system: ' + error.message);
    }
    setCheckingId(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>Live Cek Pusat (Irvan Kede)</h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>Pantau status real-time pesanan yang sudah dilempar ke pusat.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="order-table">
            <thead>
              <tr>
                <th>ID Panel</th>
                <th>Order ID Pusat</th>
                <th>Layanan</th>
                <th>Target</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vendorOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#475569', padding: '2.5rem' }}>Belum ada pesanan yang terlacak. (Pesanan lama belum didukung)</td></tr>
              ) : (
                vendorOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>#{order.id}</td>
                    <td style={{ color: '#38bdf8', fontWeight: 700 }}>{order.provider_order_id}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.service_name}</td>
                    <td style={{ color: '#94a3b8' }}>{order.target}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleCheckStatus(order.provider_order_id, order.id)}
                        disabled={checkingId === order.id}
                        style={{
                          background: checkingId === order.id ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.1)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: checkingId === order.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {checkingId === order.id ? '⏳ Mengecek...' : '🔍 Cek Status Live'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Status Live */}
      {statusModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '350px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
              🔍 Hasil Pelacakan Pusat
            </h3>
            
            {statusModal.success ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Status: <strong style={{ color: '#38bdf8' }}>{statusModal.status}</strong></p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Start Count: <strong style={{ color: '#fff' }}>{statusModal.start_count}</strong></p>
                <p style={{ margin: '0', color: '#94a3b8' }}>Sisa (Remains): <strong style={{ color: '#fff' }}>{statusModal.remains}</strong></p>
              </div>
            ) : (
              <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                {statusModal.message}
              </div>
            )}

            <button 
              onClick={() => setStatusModal(null)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ORDERS PAGE =====
function OrdersPage({ orders, loading, processingId, onProcess, onReject, onRefresh }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>Manajemen Pesanan</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Lihat & proses semua pesanan yang masuk.</p>
        </div>
        <button
          onClick={onRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            padding: '0.7rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          🔃 Refresh Data
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Layanan</th>
                <th>Target</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Bukti Bayar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#475569', padding: '2.5rem' }}>⏳ Memuat data...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#475569', padding: '2.5rem' }}>Belum ada pesanan masuk bos.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>#{order.id}</td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.service_name}</td>
                    <td style={{ color: '#94a3b8' }}>{order.target}</td>
                    <td>{order.quantity.toLocaleString('id-ID')}</td>
                    <td style={{ color: '#34d399', fontWeight: 700 }}>Rp{order.price.toLocaleString('id-ID')}</td>
                    <td>
                      {order.receipt_url ? (
                        <a href={order.receipt_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}>
                          Lihat Bukti 📸
                        </a>
                      ) : (
                        <span style={{ color: '#64748b' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>{order.status.toUpperCase()}</span>
                    </td>
                    <td>
                      {order.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => onProcess(order.id)}
                            disabled={processingId === order.id}
                            style={{
                              background: processingId === order.id ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.8)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: processingId === order.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {processingId === order.id ? '⏳ ...' : '✅ Proses'}
                          </button>
                          
                          <button
                            onClick={() => onReject(order.id, 'canceled')}
                            disabled={processingId === order.id}
                            style={{
                              background: processingId === order.id ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.8)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: processingId === order.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            ❌ Tolak (Pembayaran)
                          </button>

                          <button
                            onClick={() => onReject(order.id, 'failed')}
                            disabled={processingId === order.id}
                            style={{
                              background: processingId === order.id ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.8)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: processingId === order.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            ⚠️ Gagal (Sistem)
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN ADMIN DASHBOARD =====
export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) router.push('/login');
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const result = await res.json();
      if (result.status) setOrders(result.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleProcessOrder = async (orderId) => {
    if (!confirm('Yakin mau memproses pesanan ini ke Irvan Kede? Saldo API lu bakal kepotong!')) return;
    setProcessingId(orderId);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });
      const result = await res.json();
      if (result.status) {
        alert('Sukses! Pesanan udah dikirim ke Irvan Kede.');
        fetchOrders();
      } else {
        alert('Gagal proses: ' + result.message);
      }
    } catch (error) {
      alert('Error system: ' + error.message);
    }
    setProcessingId(null);
  };

  const handleRejectOrder = async (orderId, reasonStatus) => {
    const confirmMsg = reasonStatus === 'canceled' 
      ? 'Yakin mau MENOLAK pesanan ini karena PEMBAYARAN INVALID? (Pelanggan tidak bisa ganti layanan)' 
      : 'Yakin mau menggagalkan pesanan ini karena SISTEM DOWN? (Pelanggan bisa ganti layanan gratis)';
    
    if (!confirm(confirmMsg)) return;
    setProcessingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: reasonStatus })
      });
      const result = await res.json();
      if (!result.status) throw new Error(result.message);
      
      alert(reasonStatus === 'canceled' ? 'Pesanan berhasil ditolak (Pembayaran).' : 'Pesanan berhasil digagalkan (Sistem).');
      fetchOrders();
    } catch (error) {
      alert('Gagal update pesanan: ' + error.message);
    }
    setProcessingId(null);
  };

  const handleSyncServices = async () => {
    if (!confirm('Yakin mau sinkronisasi layanan sekarang? Ini akan menghapus layanan lama dan mengambil layanan terbaru dari IrvanKede.')) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const result = await res.json();
      alert(result.status ? result.message : 'Gagal Sync: ' + result.message);
    } catch (error) {
      alert('Error system saat sync: ' + error.message);
    }
    setSyncing(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('isAdmin');
    router.push('/login');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100dvh',
      background: '#09090f',
      color: '#f1f5f9',
      fontFamily: 'inherit',
    }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 2rem', overflowY: 'auto', maxWidth: '100%' }}>
        {activePage === 'overview' && (
          <OverviewPage orders={orders} syncing={syncing} onSync={handleSyncServices} />
        )}
        {activePage === 'orders' && (
          <OrdersPage
            orders={orders}
            loading={loading}
            processingId={processingId}
            onProcess={handleProcessOrder}
            onReject={handleRejectOrder}
            onRefresh={fetchOrders}
          />
        )}
        {activePage === 'vendor' && (
          <VendorStatusPage orders={orders} />
        )}
      </main>
    </div>
  );
}
