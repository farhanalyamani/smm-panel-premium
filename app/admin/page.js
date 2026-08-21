'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const router = useRouter();

  // Proteksi Keamanan: Cek apakah user adalah admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
    }
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('smm_orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleProcessOrder = async (orderId) => {
    if (!confirm("Yakin mau memproses pesanan ini ke Irvan Kede? Saldo API lu bakal kepotong!")) return;
    
    setProcessingId(orderId);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });
      
      const result = await res.json();
      
      if (result.status) {
        alert("Sukses! Pesanan udah dikirim ke Irvan Kede.");
        fetchOrders(); // Refresh table
      } else {
        alert("Gagal proses: " + (result.data || result.message));
      }
    } catch (error) {
      alert("Error system: " + error.message);
    }
    setProcessingId(null);
  };

  return (
    <div style={{ padding: '3rem 5%', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        <button onClick={fetchOrders} className="glass-button" style={{ padding: '0.5rem 1rem' }}>
          Refresh Data
        </button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Layanan</th>
              <th style={{ padding: '1rem' }}>Target</th>
              <th style={{ padding: '1rem' }}>Jumlah</th>
              <th style={{ padding: '1rem' }}>Total Tagihan</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Memuat pesanan...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center' }}>Belum ada pesanan masuk bos.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>#{order.id}</td>
                  <td style={{ padding: '1rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.service_name}
                  </td>
                  <td style={{ padding: '1rem' }}>{order.target}</td>
                  <td style={{ padding: '1rem' }}>{order.quantity.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '1rem', color: '#10b981', fontWeight: 'bold' }}>
                    Rp{order.price.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: order.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: order.status === 'pending' ? '#f59e0b' : '#10b981'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.status === 'pending' && (
                      <button 
                        className="glass-button" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#8b5cf6' }}
                        onClick={() => handleProcessOrder(order.id)}
                        disabled={processingId === order.id}
                      >
                        {processingId === order.id ? 'Memproses...' : 'Proses ke Bandar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
