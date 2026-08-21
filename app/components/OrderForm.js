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

  // 1. Fetch Kategori Unik dari Supabase pas komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('smm_services')
        .select('category');
        
      if (!error && data) {
        // Ambil kategori unik (karena 1 kategori punya banyak layanan)
        const uniqueCats = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCats.sort());
      }
      setLoadingCats(false);
    };
    fetchCategories();
  }, []);

  // 2. Fetch layanan berdasarkan kategori yang dipilih
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategory) {
        setServices([]);
        setSelectedService(null);
        return;
      }
      
      setLoadingServices(true);
      const { data, error } = await supabase
        .from('smm_services')
        .select('*')
        .eq('category', selectedCategory)
        .order('price', { ascending: true });
        
      if (!error && data) {
        setServices(data);
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, [selectedCategory]);

  // Handle perubahan pilihan layanan
  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const s = services.find(item => item.id.toString() === serviceId);
    setSelectedService(s || null);
    setQuantity(''); // Reset kuantitas
  };

  // Hitung total harga (Harga SMM itu per 1000 unit)
  const calculateTotal = () => {
    if (!selectedService || !quantity) return 0;
    const qty = parseInt(quantity);
    if (isNaN(qty)) return 0;
    // Bulatkan ke atas supaya tidak ada angka desimal (karena database minta INT)
    return Math.ceil((selectedService.price / 1000) * qty);
  };

  const handleOrder = async () => {
    if (!selectedService || !target || !quantity) return;
    const total = calculateTotal();
    const qty = parseInt(quantity);
    
    if (qty < selectedService.min || qty > selectedService.max) {
      alert(`Kuantitas harus antara ${selectedService.min} sampai ${selectedService.max}`);
      return;
    }

    // 1. Simpan pesanan ke database Supabase dengan status 'pending'
    const { error: insertError } = await supabase
      .from('smm_orders')
      .insert([
        {
          service_id: selectedService.service_id,
          service_name: selectedService.name,
          target: target,
          quantity: qty,
          price: total,
          status: 'pending'
        }
      ]);

    if (insertError) {
      alert("Oops, gagal mencatat pesanan: " + insertError.message);
      return;
    }

    // 2. Arahkan ke WhatsApp buat pembayaran
    const text = `Halo Min, saya mau order:\n\n` +
                 `Layanan: ${selectedService.name}\n` +
                 `Target/Link: ${target}\n` +
                 `Jumlah: ${quantity}\n` +
                 `Total Bayar: Rp${total.toLocaleString('id-ID')}\n\n` +
                 `Tolong proses ya!`;
                 
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="glass-panel" style={{ marginTop: '3rem' }}>
      <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Form Pemesanan Baru</h2>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Kategori Dropdown */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Pilih Kategori</label>
          <select 
            className="glass-card" 
            style={{ width: '100%', padding: '0.8rem', outline: 'none', color: '#f8fafc' }}
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedService(null); }}
          >
            <option value="" style={{ color: 'black' }}>{loadingCats ? 'Memuat Kategori...' : '-- Pilih Kategori Sosmed --'}</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat} style={{ color: 'black' }}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Layanan Dropdown */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Pilih Layanan</label>
          <select 
            className="glass-card" 
            style={{ width: '100%', padding: '0.8rem', outline: 'none', color: '#f8fafc' }}
            value={selectedService ? selectedService.id : ''}
            onChange={handleServiceChange}
            disabled={!selectedCategory || loadingServices}
          >
            <option value="" style={{ color: 'black' }}>{loadingServices ? 'Memuat Layanan...' : '-- Pilih Layanan --'}</option>
            {services.map(s => (
              <option key={s.id} value={s.id} style={{ color: 'black' }}>
                {s.name} - Rp{s.price.toLocaleString('id-ID')}/1000
              </option>
            ))}
          </select>
        </div>

        {/* Detail Layanan (Muncul kalau layanan dipilih) */}
        {selectedService && (
          <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <p><strong>Min Order:</strong> {selectedService.min}</p>
            <p><strong>Max Order:</strong> {selectedService.max.toLocaleString('id-ID')}</p>
            <p><strong>Keterangan:</strong> {selectedService.description || '-'}</p>
          </div>
        )}

        {/* Target / Link */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Target (Link / Username)</label>
          
          {/* WARNING MESSAGE */}
          <div style={{ marginBottom: '1rem', padding: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <p style={{ color: '#fca5a5', fontSize: '0.85rem', margin: 0 }}>
              ⚠️ <strong>PERHATIAN:</strong> Pastikan akun <strong>TIDAK DI-PRIVATE</strong> (wajib Public) selama proses berlangsung! Kesalahan isi target atau akun digembok = Hangus (No Refund).
            </p>
          </div>

          <input 
            type="text" 
            className="glass-card" 
            style={{ width: '100%', padding: '0.8rem', outline: 'none', color: '#f8fafc' }}
            placeholder="Contoh: https://instagram.com/username atau @username"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        {/* Kuantitas */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Jumlah Pesanan</label>
          <input 
            type="number" 
            className="glass-card" 
            style={{ width: '100%', padding: '0.8rem', outline: 'none', color: '#f8fafc' }}
            placeholder="Masukan angka (contoh: 1000)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Total Harga */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '1.2rem', color: '#a1a1aa' }}>Total Bayar:</span>
          <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            Rp{calculateTotal().toLocaleString('id-ID')}
          </span>
        </div>

        {/* Tombol Order */}
        <button 
          className="glass-button" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
          onClick={handleOrder}
          disabled={!selectedService || !target || !quantity}
        >
          Pesan Sekarang (Lanjut WA)
        </button>

      </div>
    </div>
  );
}
