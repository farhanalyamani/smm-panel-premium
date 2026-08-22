import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req) {
  try {
    const { order_id, new_service_id, new_target } = await req.json();

    if (!order_id || !new_service_id || !new_target) {
      return NextResponse.json({ status: false, message: 'Data tidak lengkap.' }, { status: 400 });
    }

    // 1. Ambil orderan lama
    const { data: oldOrder, error: orderError } = await supabaseAdmin
      .from('smm_orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !oldOrder) {
      return NextResponse.json({ status: false, message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    if (oldOrder.status !== 'failed' && oldOrder.status !== 'error' && oldOrder.status !== 'canceled') {
      return NextResponse.json({ status: false, message: 'Hanya pesanan yang gagal yang bisa diganti.' }, { status: 400 });
    }

    // 2. Ambil data layanan baru
    const { data: newService, error: serviceError } = await supabaseAdmin
      .from('smm_services')
      .select('*')
      .eq('service_id', new_service_id)
      .single();

    if (serviceError || !newService) {
      return NextResponse.json({ status: false, message: 'Layanan baru tidak ditemukan.' }, { status: 404 });
    }

    // 3. Validasi harga (Total harga layanan baru tidak boleh lebih dari yang sudah dibayar)
    const newTotalPrice = newService.price * (oldOrder.quantity / 1000); 
    // asumsi harga layanan di db adalah harga per 1000

    if (newTotalPrice > oldOrder.price) {
      return NextResponse.json({ status: false, message: 'Harga layanan baru lebih mahal dari uang yang Anda bayar.' }, { status: 400 });
    }

    // 4. Update pesanan
    const { error: updateError } = await supabaseAdmin
      .from('smm_orders')
      .update({
        service_id: newService.service_id,
        service_name: newService.name,
        target: new_target,
        status: 'pending',
        provider_order_id: null // Reset provider id karena pesanan baru
      })
      .eq('id', order_id);

    if (updateError) throw updateError;

    return NextResponse.json({ status: true, message: 'Pesanan berhasil diperbarui dan masuk ke antrean.' });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
