import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 1. Verifikasi admin
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'DITOLAK! Lu bukan admin bos.' }, { status: 401 });
    }

    const apiId = process.env.IRVANKEDE_API_ID;
    const apiKey = process.env.IRVANKEDE_API_KEY;

    if (!apiId || !apiKey) {
      return NextResponse.json({ status: false, message: 'API Credentials missing' }, { status: 500 });
    }

    // 2. Tarik data layanan terbaru dari Irvan Kede
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);

    // KITA GUNAKAN VPS WIBUFLIX SEBAGAI PROXY (JOKI) BIAR NGGAK DIBLOKIR CLOUDFLARE
    const res = await fetch('https://wibuflixid.web.id/proxy_irvankede.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: formData.toString()
    });

    const rawResponse = await res.text();
    let responseData;
    try {
      responseData = JSON.parse(rawResponse);
    } catch (e) {
      return NextResponse.json({ status: false, message: 'Server IrvanKede mengembalikan error non-JSON (mungkin kena blokir Cloudflare atau Endpoint salah): ' + rawResponse.substring(0, 100) }, { status: 500 });
    }
    
    // Asumsi IrvanKede: respons sukses = { status: true, data: [...] }
    const services = responseData.data;
    if (!responseData.status || !Array.isArray(services)) {
      return NextResponse.json({ status: false, message: 'Gagal menyedot data layanan dari Irvan Kede.' }, { status: 500 });
    }

    // 3. Hapus SEMUA layanan lama di database kita
    // Supabase JS tidak bisa delete tanpa filter, jadi kita gunakan ne (not equal) ke ID yang tidak mungkin ada, atau is_not_null
    const { error: deleteError } = await supabase
      .from('smm_services')
      .delete()
      .neq('id', 0); // Menghapus semua baris karena ID pasti != 0

    if (deleteError) {
      return NextResponse.json({ status: false, message: 'Gagal menghapus data lama: ' + deleteError.message }, { status: 500 });
    }

    // 4. Siapkan data baru dengan Mark-up Harga (Untung 20% + Rp100)
    const formattedData = services.map(s => {
      const modal = parseFloat(s.price);
      // Untung kotor 40% + Rp100
      let hargaJual = modal + (modal * 0.40) + 100;
      
      return {
        service_id: s.id,
        name: s.name,
        category: s.category,
        price: Math.ceil(hargaJual),
        min: parseInt(s.min),
        max: parseInt(s.max),
        description: s.description || ''
      };
    });

    // 5. Masukkan ke Supabase dalam batch per 500 baris (mencegah timeout payload terlalu besar)
    const batchSize = 500;
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('smm_services')
        .insert(batch);
        
      if (insertError) {
        return NextResponse.json({ status: false, message: 'Gagal menyimpan batch baru: ' + insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      status: true, 
      message: `Berhasil sinkronisasi ${formattedData.length} layanan terbaru yang aktif!` 
    });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
