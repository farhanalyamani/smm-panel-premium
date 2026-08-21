'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Daftar keyword untuk grouping
const platformKeywords = {
  'Instagram': ['instagram', 'ig '],
  'TikTok': ['tiktok', 'tik tok'],
  'YouTube': ['youtube', 'yt '],
  'Facebook': ['facebook', 'fb '],
  'Twitter/X': ['twitter', ' x '],
  'Shopee': ['shopee'],
  'Tokopedia': ['tokopedia'],
  'Spotify': ['spotify'],
  'Telegram': ['telegram'],
  'Discord': ['discord'],
  'Website Traffic': ['website', 'traffic']
};

const getPlatform = (categoryName) => {
  const nameLower = categoryName.toLowerCase();
  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(kw => nameLower.includes(kw))) {
      return platform;
    }
  }
  return 'Lainnya';
};

export default function OrderForm() {
  const [allCategories, setAllCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedPlatform, setSelectedPlatform] = useState('');
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
        const uniqueCats = [...new Set(data.map(item => item.category))].sort();
        setAllCategories(uniqueCats);
        
        // Ambil platform unik
        const uniquePlatforms = [...new Set(uniqueCats.map(c => getPlatform(c)))];
        const sortedPlatforms = uniquePlatforms.sort((a, b) => {
          if (a === 'Lainnya') return 1;
          if (b === 'Lainnya') return -1;
          return a.localeCompare(b);
        });
        setPlatforms(sortedPlatforms);
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

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
    setSelectedCategory('');
    setSelectedService(null);
    setQuantity('');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedService(null);
    setQuantity('');
  };

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

  // Filter kategori berdasarkan platform yang dipilih
  const filteredCategories = selectedPlatform 
    ? allCategories.filter(c => getPlatform(c) === selectedPlatform)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p className="section-title">📋 Form Pemesanan</p>

      {/* Platform */}
      <div className="form-group">
        <label className="form-label">1. Pilih Platform Sosmed</label>
        <select
          className="form-control"
          value={selectedPlatform}
          onChange={handlePlatformChange}
        >
          <option value="" style={{ color: '#000' }}>
            {loadingCats ? '⏳ Memuat...' : '— Pilih Platform (IG, TikTok, dll) —'}
          </option>
          {platforms.map((plat, i) => (
            <option key={i} value={plat} style={{ color: '#000' }}>{plat}</option>
          ))}
        </select>
      </div>

      {/* Kategori */}
      <div className="form-group">
        <label className="form-label">2. Pilih Kategori</label>
        <select
          className="form-control"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={!selectedPlatform || loadingCats}
        >
          <option value="" style={{ color: '#000' }}>
            {!selectedPlatform ? '— Pilih platform dulu —' : '— Pilih Kategori —'}
          </option>
          {filteredCategories.map((cat, i) => (
            <option key={i} value={cat} style={{ color: '#000' }}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Layanan */}
      <div className="form-group">
        <label className="form-label">3. Pilih Layanan</label>
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
        
        {/* Panduan Singkat Istilah SMM */}
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', lineHeight: '1.5' }}>
          <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.25rem' }}>💡 Bingung milih? Ini panduan istilahnya:</strong>
          • <strong style={{ color: '#34d399' }}>Refill / ♻️</strong> = Bergaransi. Kalau turun bakal diisi ulang gratis.<br/>
          • <strong style={{ color: '#f87171' }}>No Refill / NR / ⚠️</strong> = Tanpa garansi, risiko ditanggung sendiri.<br/>
          • <strong style={{ color: '#a78bfa' }}>Low Drop</strong> = Kemungkinan turun/unfollow sangat kecil.<br/>
          • <strong>Mix / Bot</strong> = Akun campuran (biasanya tanpa foto profil).<br/>
          • <strong>Real / HQ</strong> = Akun asli / kualitas tinggi (ada foto profil).
        </div>
      </div>

      {/* Detail Layanan */}
      {selectedService && (
        <div className="detail-card" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Fitur Layanan (Dipecah dari Nama) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Spek Layanan Ini:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedService.name.split('|').map((tag, idx) => {
                const cleanTag = tag.trim();
                if (!cleanTag) return null;
                
                // Pewarnaan otomatis berdasarkan kata kunci
                let bg = 'rgba(255,255,255,0.05)';
                let color = '#e2e8f0';
                const lower = cleanTag.toLowerCase();
                
                if (lower.includes('refill') || lower.includes('♻️')) { bg = 'rgba(16, 185, 129, 0.15)'; color = '#34d399'; }
                else if (lower.includes('no refill') || lower.includes('nr') || lower.includes('⚠️')) { bg = 'rgba(239, 68, 68, 0.15)'; color = '#f87171'; }
                else if (lower.includes('real') || lower.includes('hq') || lower.includes('active')) { bg = 'rgba(167, 139, 250, 0.15)'; color = '#a78bfa'; }
                else if (lower.includes('instant') || lower.includes('fast')) { bg = 'rgba(56, 189, 248, 0.15)'; color = '#38bdf8'; }

                return (
                  <span key={idx} style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {cleanTag.replace(/\[|\]/g, '')}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="divider" style={{ margin: '1rem 0', background: 'rgba(255,255,255,0.05)', height: '1px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#94a3b8' }}>Minimum Beli</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>{selectedService.min.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#94a3b8' }}>Maksimum Beli</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>{selectedService.max.toLocaleString('id-ID')}</span>
          </div>

          {selectedService.description && (
            <>
              <div className="divider" style={{ margin: '1rem 0', background: 'rgba(255,255,255,0.05)', height: '1px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Catatan Pusat:</span>
                <span style={{ fontSize: '0.8rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '0.75rem', borderRadius: '8px', lineHeight: '1.5' }}>
                  {selectedService.description}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Target */}
      <div className="form-group">
        <label className="form-label">4. Target (Username / Link)</label>
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
        <label className="form-label">5. Jumlah</label>
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
