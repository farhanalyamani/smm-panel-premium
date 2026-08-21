'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderForm() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [target, setTarget] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('smm_services').select('category');
      if (!error && data) {
        const uniqueCats = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCats.sort());
      }
      setLoadingCats(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) { setServices([]); setSelectedService(null); return; }
    setLoadingServices(true);
    const fetch = async () => {
      const { data, error } = await supabase
        .from('smm_services').select('*')
        .eq('category', selectedCategory).order('price', { ascending: true });
      if (!error && data) setServices(data);
      setLoadingServices(false);
    };
    fetch();
  }, [selectedCategory]);

  const handleServiceChange = (e) => {
    const s = services.find(item => item.id.toString() === e.target.value);
    setSelectedService(s || null);
    setQuantity('');
  };

  const calculateTotal = () => {
    if (!selectedService || !quantity) return 0;
    const qty = parseInt(quantity);
    if (isNaN(qty)) return 0;
    return Math.ceil((selectedService.price / 1000) * qty);
  };

  const handleOrder = async () => {
    if (!selectedService || !target || !quantity) return;
    const total = calculateTotal();
    const qty = parseInt(quantity);

    if (qty < selectedService.min || qty > selectedService.max) {
      alert(`Jumlah harus antara ${selectedService.min.toLocaleString('id-ID')} – ${selectedService.max.toLocaleString('id-ID')}`);
      return;
    }

    setOrdering(true);
    const { error } = await supabase.from('smm_orders').insert([{
      service_id: selectedService.service_id,
      service_name: selectedService.name,
      target, quantity: qty, price: total, status: 'pending'
    }]);

    if (error) { alert("Gagal mencatat pesanan: " + error.message); setOrdering(false); return; }

    const text = `Halo Min, mau order:\n\n` +
      `Layanan: ${selectedService.name}\n` +
      `Target: ${target}\n` +
      `Jumlah: ${qty.toLocaleString('id-ID')}\n` +
      `Total Bayar: Rp${total.toLocaleString('id-ID')}\n\nTolong diproses ya!`;

    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
    setOrdering(false);
  };

  const total = calculateTotal();
  const isValid = selectedService && target && quantity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p className="section-title">📋 Form Pemesanan</p>

      {/* Kategori */}
      <div className="form-group">
        <label className="form-label">1. Pilih Kategori</label>
        <select
          className="form-control"
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setSelectedService(null); }}
        >
          <option value="" style={{ color: '#000' }}>
            {loadingCats ? '⏳ Memuat...' : '— Pilih platform sosmed —'}
          </option>
          {categories.map((cat, i) => (
            <option key={i} value={cat} style={{ color: '#000' }}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Layanan */}
      <div className="form-group">
        <label className="form-label">2. Pilih Layanan</label>
        <select
          className="form-control"
          value={selectedService ? selectedService.id : ''}
          onChange={handleServiceChange}
          disabled={!selectedCategory || loadingServices}
        >
          <option value="" style={{ color: '#000' }}>
            {loadingServices ? '⏳ Memuat layanan...' : '— Pilih jenis layanan —'}
          </option>
          {services.map(s => (
            <option key={s.id} value={s.id} style={{ color: '#000' }}>
              {s.name} — Rp{s.price.toLocaleString('id-ID')}/1000
            </option>
          ))}
        </select>
      </div>

      {/* Detail Layanan */}
      {selectedService && (
        <div className="detail-card">
          <div className="detail-row">
            <span>Min</span>
            <span>{selectedService.min.toLocaleString('id-ID')}</span>
          </div>
          <div className="divider" />
          <div className="detail-row">
            <span>Max</span>
            <span>{selectedService.max.toLocaleString('id-ID')}</span>
          </div>
          {selectedService.description && (
            <>
              <div className="divider" />
              <div className="detail-row">
                <span>Info</span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selectedService.description}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Target */}
      <div className="form-group">
        <label className="form-label">3. Target (Username / Link)</label>
        <div className="alert-warning" style={{ marginBottom: '0.5rem' }}>
          ⚠️ <strong>Wajib</strong>: Akun <strong>TIDAK DI-PRIVATE</strong> (harus Public). Akun gembok = hangus, no refund!
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="@username atau link lengkap"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Kuantitas */}
      <div className="form-group">
        <label className="form-label">4. Jumlah</label>
        <input
          type="number"
          className="form-control"
          placeholder={selectedService ? `Min ${selectedService.min.toLocaleString('id-ID')}` : 'Pilih layanan dulu'}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={!selectedService}
          inputMode="numeric"
        />
      </div>

      {/* Total */}
      <div className="total-box">
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total yang harus dibayar
        </div>
        <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Rp{total.toLocaleString('id-ID')}
        </div>
        {total > 0 && (
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
            {quantity} unit × Rp{selectedService ? Math.ceil(selectedService.price / 1000).toLocaleString('id-ID') : 0}/pcs
          </div>
        )}
      </div>

      {/* Tombol */}
      <button
        className="btn-primary"
        onClick={handleOrder}
        disabled={!isValid || ordering}
        style={{ padding: '1.1rem', fontSize: '1.05rem' }}
      >
        {ordering ? '⏳ Memproses...' : '🚀 Pesan Sekarang via WhatsApp'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#475569' }}>
        Setelah klik, kamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.
      </p>
    </div>
  );
}
