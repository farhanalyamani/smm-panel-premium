'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// --- Keyword Platform Grouping ---
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
  'Website Traffic': ['website', 'traffic'],
};

const getPlatform = (categoryName) => {
  const nameLower = categoryName.toLowerCase();
  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(kw => nameLower.includes(kw))) return platform;
  }
  return 'Lainnya';
};

// --- Estimasi waktu berdasarkan nama layanan ---
const getEstimation = (serviceName) => {
  if (!serviceName) return null;
  const lower = serviceName.toLowerCase();
  const isFollowers = lower.includes('follower') || lower.includes('subscriber') || lower.includes('pengikut');
  const isInstant = lower.includes('like') || lower.includes('view') || lower.includes('watch') || lower.includes('comment');
  if (isFollowers) return { icon: '⏱️', label: 'Estimasi Waktu', value: '2×24 Jam', color: '#a78bfa' };
  if (isInstant)   return { icon: '⚡', label: 'Estimasi Waktu', value: '1–2 Jam', color: '#34d399' };
  return { icon: '⏱️', label: 'Estimasi Waktu', value: '1–24 Jam', color: '#fbbf24' };
};

// --- Badge tag parser ---
const ServiceBadge = ({ tag }) => {
  const lower = tag.toLowerCase();
  let bg = 'rgba(255,255,255,0.06)';
  let color = '#94a3b8';
  if (lower.includes('refill') && !lower.includes('no')) { bg = 'rgba(16,185,129,0.15)'; color = '#34d399'; }
  else if (lower.includes('no refill') || lower.includes('nr') || lower.includes('⚠️')) { bg = 'rgba(239,68,68,0.15)'; color = '#f87171'; }
  else if (lower.includes('real') || lower.includes('hq') || lower.includes('active')) { bg = 'rgba(167,139,250,0.15)'; color = '#a78bfa'; }
  else if (lower.includes('instant') || lower.includes('fast')) { bg = 'rgba(56,189,248,0.15)'; color = '#38bdf8'; }
  return (
    <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      {tag.replace(/\[|\]/g, '').trim()}
    </span>
  );
};

// --- Step Indicator ---
function StepIndicator({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none', gap: '0.4rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
            background: i < step ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : i === step ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
            border: i === step ? '2px solid #7c3aed' : 'none',
            color: i < step ? '#fff' : i === step ? '#a78bfa' : '#475569',
            transition: 'all 0.3s ease',
          }}>
            {i < step ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div style={{ flex: 1, height: 2, borderRadius: 2, background: i < step ? 'linear-gradient(to right, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.07)', transition: 'all 0.3s ease' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderForm() {
  const [allCategories, setAllCategories]   = useState([]);
  const [platforms, setPlatforms]           = useState([]);
  const [services, setServices]             = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService]   = useState(null);
  const [target, setTarget]   = useState('');
  const [quantity, setQuantity] = useState('');
  const [loadingCats, setLoadingCats]       = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [ordering, setOrdering]             = useState(false);

  // Step logic: 0=platform, 1=category, 2=service, 3=target+qty
  const currentStep = selectedService ? 3 : selectedCategory ? 2 : selectedPlatform ? 1 : 0;

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('smm_services').select('category');
      if (!error && data) {
        const uniqueCats = [...new Set(data.map(item => item.category))].sort();
        setAllCategories(uniqueCats);
        const uniquePlatforms = [...new Set(uniqueCats.map(c => getPlatform(c)))].sort((a, b) => {
          if (a === 'Lainnya') return 1;
          if (b === 'Lainnya') return -1;
          return a.localeCompare(b);
        });
        setPlatforms(uniquePlatforms);
      }
      setLoadingCats(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) { setServices([]); setSelectedService(null); return; }
    setLoadingServices(true);
    const fetch = async () => {
      const { data, error } = await supabase.from('smm_services').select('*').eq('category', selectedCategory).order('price', { ascending: true });
      if (!error && data) setServices(data);
      setLoadingServices(false);
    };
    fetch();
  }, [selectedCategory]);

  const handlePlatformChange = (e) => { setSelectedPlatform(e.target.value); setSelectedCategory(''); setSelectedService(null); setQuantity(''); };
  const handleCategoryChange = (e) => { setSelectedCategory(e.target.value); setSelectedService(null); setQuantity(''); };
  const handleServiceChange  = (e) => {
    const s = services.find(item => item.id.toString() === e.target.value);
    setSelectedService(s || null); setQuantity('');
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
    if (error) { alert('Gagal mencatat pesanan: ' + error.message); setOrdering(false); return; }
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
  const filteredCategories = selectedPlatform ? allCategories.filter(c => getPlatform(c) === selectedPlatform) : [];
  const estimation = getEstimation(selectedService?.name);
  const tags = selectedService ? selectedService.name.split('|').filter(t => t.trim()) : [];

  return (
    <div className="order-form-wrapper">
      {/* Header */}
      <div className="order-form-header">
        <div>
          <h2 className="order-form-title">📋 Form Pemesanan</h2>
          <p className="order-form-subtitle">Pilih layanan yang kamu inginkan, isi data, dan pesan via WhatsApp</p>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator step={currentStep} total={4} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* STEP 1: Platform */}
        <div className="form-field-group">
          <label className="field-label">
            <span className="field-step-num">1</span>
            Platform Sosmed
          </label>
          <select
            className="form-select"
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

        {/* STEP 2: Kategori */}
        <div className={`form-field-group ${!selectedPlatform ? 'field-disabled' : ''}`}>
          <label className="field-label">
            <span className="field-step-num">2</span>
            Jenis Layanan
          </label>
          <select
            className="form-select"
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

        {/* STEP 3: Layanan + Guide */}
        <div className={`form-field-group ${!selectedCategory ? 'field-disabled' : ''}`}>
          <label className="field-label">
            <span className="field-step-num">3</span>
            Pilih Paket Layanan
          </label>
          <select
            className="form-select"
            value={selectedService ? selectedService.id : ''}
            onChange={handleServiceChange}
            disabled={!selectedCategory || loadingServices}
          >
            <option value="" style={{ color: '#000' }}>
              {loadingServices ? '⏳ Memuat layanan...' : '— Pilih paket —'}
            </option>
            {services.map(s => (
              <option key={s.id} value={s.id} style={{ color: '#000' }}>
                {s.name} — Rp{s.price.toLocaleString('id-ID')}/1000
              </option>
            ))}
          </select>

          {/* Panduan istilah */}
          {!selectedService && selectedCategory && (
            <div className="smm-guide-box">
              <p className="smm-guide-title">💡 Panduan Istilah SMM:</p>
              <div className="smm-guide-items">
                <span><b style={{ color: '#34d399' }}>Refill / ♻️</b> = Bergaransi isi ulang jika turun</span>
                <span><b style={{ color: '#f87171' }}>No Refill / NR</b> = Tanpa garansi</span>
                <span><b style={{ color: '#a78bfa' }}>HQ / Real</b> = Akun asli berkualitas tinggi</span>
                <span><b style={{ color: '#38bdf8' }}>Low Drop</b> = Sangat kecil kemungkinan turun</span>
              </div>
            </div>
          )}
        </div>

        {/* Detail Layanan Card */}
        {selectedService && (
          <div className="service-detail-card">
            {/* Nama Layanan */}
            <p className="service-detail-name">{selectedService.name.split('|')[0].trim()}</p>

            {/* Badges */}
            <div className="service-badge-row">
              {tags.slice(1).map((tag, idx) => tag.trim() && <ServiceBadge key={idx} tag={tag} />)}
            </div>

            {/* Stats Row */}
            <div className="service-stats-row">
              <div className="service-stat">
                <span className="service-stat-label">Min Beli</span>
                <span className="service-stat-val">{selectedService.min.toLocaleString('id-ID')}</span>
              </div>
              <div className="service-stat-divider" />
              <div className="service-stat">
                <span className="service-stat-label">Max Beli</span>
                <span className="service-stat-val">{selectedService.max.toLocaleString('id-ID')}</span>
              </div>
              <div className="service-stat-divider" />
              <div className="service-stat">
                <span className="service-stat-label">{estimation?.icon} {estimation?.label}</span>
                <span className="service-stat-val" style={{ color: estimation?.color }}>{estimation?.value}</span>
              </div>
            </div>

            {/* Description */}
            {selectedService.description && (
              <div className="service-note">
                📌 {selectedService.description}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Target + Jumlah */}
        <div className={`form-field-group ${!selectedService ? 'field-disabled' : ''}`}>
          <label className="field-label">
            <span className="field-step-num">4</span>
            Target & Jumlah
          </label>

          <div className="alert-warning" style={{ marginBottom: '0.75rem' }}>
            ⚠️ Pastikan akun <strong>TIDAK DI-PRIVATE</strong> (wajib Public). Akun dikunci = hangus, no refund!
          </div>

          <input
            type="text"
            className="form-select"
            style={{ marginBottom: '0.75rem' }}
            placeholder="@username atau link lengkap postingan"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={!selectedService}
            autoComplete="off"
          />

          <input
            type="number"
            className="form-select"
            placeholder={selectedService ? `Jumlah (Min: ${selectedService.min.toLocaleString('id-ID')})` : 'Pilih layanan dulu'}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={!selectedService}
            inputMode="numeric"
          />
        </div>

        {/* Total Price */}
        <div className="price-summary-box">
          <div className="price-summary-row">
            <span className="price-summary-label">Total Pembayaran</span>
            {total > 0 && (
              <span className="price-per-unit">{quantity} unit × Rp{selectedService ? Math.ceil(selectedService.price / 1000).toLocaleString('id-ID') : 0}/pcs</span>
            )}
          </div>
          <div className="price-summary-amount gradient-text">
            Rp{total.toLocaleString('id-ID')}
          </div>
          {estimation && total > 0 && (
            <div className="price-summary-eta" style={{ color: estimation.color }}>
              {estimation.icon} Estimasi proses: <strong>{estimation.value}</strong>
              {selectedService?.name?.toLowerCase().includes('follower') && (
                <span style={{ color: '#64748b' }}> · Penambahan bertahap, jangan panik ya 😊</span>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          className="btn-order"
          onClick={handleOrder}
          disabled={!isValid || ordering}
        >
          {ordering ? '⏳ Memproses...' : '🚀 Pesan Sekarang via WhatsApp'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#475569', marginTop: '-0.5rem' }}>
          Setelah klik, kamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.
        </p>
      </div>
    </div>
  );
}
