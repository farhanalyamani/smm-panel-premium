import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // PROTEKSI: Cek Token Cookies dari Brankas Browser
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'DITOLAK! Lu bukan admin bos.' }, { status: 401 });
    }

    const { order_id } = await req.json();
    if (!order_id) return NextResponse.json({ status: false, message: 'ID Pesanan wajib diisi' }, { status: 400 });

    const apiId = process.env.IRVANKEDE_API_ID;
    const apiKey = process.env.IRVANKEDE_API_KEY;

    if (!apiId || !apiKey) {
      return NextResponse.json({ status: false, message: 'API Credentials missing' }, { status: 500 });
    }

    // 1. Cek pesanan di database
    const { data: orderData, error: orderError } = await supabase
      .from('smm_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ status: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (orderData.status === 'completed') {
      return NextResponse.json({ status: false, message: 'Pesanan ini sudah pernah diproses!' }, { status: 400 });
    }

    // 2. Kirim perintah Order ke Irvan Kede
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);
    formData.append('service', orderData.service_id.toString());
    formData.append('target', orderData.target);
    formData.append('quantity', orderData.quantity.toString());
    // Custom comment atau link, Irvan Kede kadang butuh parameter 'custom_comments' atau sejenisnya, tapi standar umumnya target dan quantity cukup.

    const res = await fetch('https://irvankedesmm.co.id/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const irvanData = await res.json();

    if (irvanData.status === false || irvanData.error) {
      const errorMsg = irvanData.data || irvanData.msg || irvanData.error || irvanData.message || JSON.stringify(irvanData);
      return NextResponse.json({ status: false, message: errorMsg });
    }

    // 3. Kalau sukses, update status di Supabase jadi 'completed'
    // Asumsi balasan Irvan Kede memiliki format data.id untuk order ID.
    const providerOrderId = irvanData.data && irvanData.data.id ? irvanData.data.id.toString() : null;

    await supabase
      .from('smm_orders')
      .update({ status: 'completed', provider_order_id: providerOrderId })
      .eq('id', order_id);

    return NextResponse.json({ status: true, message: 'Pesanan sukses dikirim ke pusat!' });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
