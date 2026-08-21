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

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleProceedPayment = () => {
    if (!selectedService || !target || !quantity) return;
    const qty = parseInt(quantity);
    if (qty < selectedService.min || qty > selectedService.max) {
      alert(`Jumlah harus antara ${selectedService.min.toLocaleString('id-ID')} – ${selectedService.max.toLocaleString('id-ID')}`);
      return;
    }
    setShowModal(true); // Tampilkan modal pembayaran
  };

  const handleConfirmOrder = async () => {
    if (!receiptFile) {
      alert('Tolong upload bukti transfer (struk) dulu ya!');
      return;
    }
    
    setUploading(true);
    const total = calculateTotal();
    const qty = parseInt(quantity);

    // 1. Upload Gambar ke Storage
    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(`public/${fileName}`, receiptFile);

    if (uploadError) {
      alert('Gagal upload gambar: ' + uploadError.message + '\n\nPastikan admin sudah menjalankan SQL script di Supabase!');
      setUploading(false);
      return;
    }

    // Ambil Public URL
    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(`public/${fileName}`);
    
    const receiptUrl = publicUrlData.publicUrl;

    // 2. Insert ke tabel pesanan
    const { error: dbError } = await supabase.from('smm_orders').insert([{
      service_id: selectedService.service_id,
      service_name: selectedService.name,
      target, 
      quantity: qty, 
      price: total, 
      status: 'pending',
      receipt_url: receiptUrl // Kolom baru!
    }]);

    if (dbError) { 
      alert('Gagal mencatat pesanan ke database: ' + dbError.message); 
      setUploading(false); 
      return; 
    }

    alert('✅ Pesanan berhasil dibuat! Admin akan segera memverifikasi pembayaran kamu.');
    setShowModal(false);
    setUploading(false);
    // Reset Form
    setTarget('');
    setQuantity('');
    setReceiptFile(null);
  };

  const total = calculateTotal();
  const isValid = selectedService && target && quantity;
  const filteredCategories = selectedPlatform ? allCategories.filter(c => getPlatform(c) === selectedPlatform) : [];
  const estimation = getEstimation(selectedService?.name);
  const tags = selectedService ? selectedService.name.split('|').filter(t => t.trim()) : [];

  return (
    <>
      <div className="order-form-wrapper">
        {/* Header */}
        <div className="order-form-header">
          <div>
            <h2 className="order-form-title">📋 Form Pemesanan</h2>
            <p className="order-form-subtitle">Pilih layanan yang kamu inginkan dan bayar otomatis pakai QRIS</p>
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
            onClick={handleProceedPayment}
            disabled={!isValid}
          >
            💳 Lanjutkan Pembayaran
          </button>
        </div>
      </div>

      {/* ================= MODAL PEMBAYARAN QRIS ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Pembayaran via QRIS</h3>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Scan kode di bawah ini menggunakan aplikasi M-Banking atau E-Wallet kesayangan kamu.
            </p>

            {/* Total Bayar di Modal */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', border: '1px dashed rgba(124, 58, 237, 0.3)' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Total yang harus dibayar:</span>
              <strong className="gradient-text" style={{ fontSize: '2rem' }}>Rp{total.toLocaleString('id-ID')}</strong>
            </div>

            {/* QRIS Image Placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '220px', height: '220px', background: '#fff', padding: '10px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                {/* 
                  TODO: USER HARUS MENAMBAHKAN qris.png KE DALAM FOLDER public/
                */}
                <img src="/qris.png" alt="QRIS Barcode" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3e%3Crect width='200' height='200' fill='%23f1f5f9'/%3e%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23475569'%3eTaruh qris.png di folder public%3C/text%3e%3C/svg%3e";
                  }}
                />
              </div>
              
              {/* Nama Rekening */}
              <div style={{ marginTop: '0.75rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Diterima Atas Nama</span>
                <strong style={{ fontSize: '0.95rem', color: '#f1f5f9', letterSpacing: '0.01em' }}>Digital Kreatif, Farhan Eka F</strong>
              </div>
            </div>

            {/* Upload Bukti */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#e2e8f0' }}>Upload Bukti Pembayaran (Wajib)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowModal(false)}
                disabled={uploading}
                style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmOrder}
                disabled={uploading || !receiptFile}
                style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: receiptFile ? 'pointer' : 'not-allowed', opacity: (!receiptFile || uploading) ? 0.5 : 1 }}
              >
                {uploading ? '⏳ Mengunggah...' : '✅ Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
