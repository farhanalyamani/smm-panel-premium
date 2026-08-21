import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const apiId = process.env.IRVANKEDE_API_ID;
  const apiKey = process.env.IRVANKEDE_API_KEY;

  if (!apiId || !apiKey) {
    return NextResponse.json({ status: false, data: 'API Credentials missing' }, { status: 400 });
  }

  try {
    // 1. Ambil data asli dari Irvan Kede
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);

    const res = await fetch('https://irvankedesmm.co.id/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const irvanData = await res.json();

    if (!irvanData.status || !irvanData.data) {
      throw new Error('Gagal narik data dari Irvan Kede');
    }

    // 2. Format data dan tambah Mark-Up Keuntungan (Misal: 25%)
    const PROFIT_MARGIN = 1.25;
    
    const formattedData = irvanData.data.map(item => ({
      service_id: parseInt(item.id),
      category: item.category,
      name: item.name,
      price: Math.ceil(parseInt(item.price) * PROFIT_MARGIN), // Harga jual ke user
      min: parseInt(item.min),
      max: parseInt(item.max),
      description: item.note || ''
    }));

    // 3. Hapus data lama biar bersih (Biar harga selalu update)
    await supabase.from('smm_services').delete().neq('id', 0); // Delete all

    // 4. Insert data baru secara massal (Bulk Insert)
    const { error } = await supabase
      .from('smm_services')
      .insert(formattedData);

    if (error) throw error;

    return NextResponse.json({ 
      status: true, 
      message: `Sukses sinkronisasi ${formattedData.length} layanan ke Supabase dengan profit 25%!` 
    });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
