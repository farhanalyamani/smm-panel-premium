import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // 1. Verifikasi Admin
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const apiId = process.env.IRVANKEDE_API_ID;
    const apiKey = process.env.IRVANKEDE_API_KEY;

    if (!apiId || !apiKey) {
      return NextResponse.json({ status: false, message: 'API Credentials missing' }, { status: 500 });
    }

    // 2. Ambil semua order yang statusnya 'processing' dan punya provider_order_id
    const { data: processingOrders, error: fetchError } = await supabaseAdmin
      .from('smm_orders')
      .select('id, provider_order_id')
      .eq('status', 'processing')
      .not('provider_order_id', 'is', null);

    if (fetchError) throw fetchError;

    if (!processingOrders || processingOrders.length === 0) {
      return NextResponse.json({ status: true, message: 'Tidak ada pesanan yang perlu disinkronisasi.', updated_count: 0 });
    }

    let updatedCount = 0;

    // 3. Loop dan cek status ke Irvan Kede (satu per satu agar aman dari rate limit)
    for (const order of processingOrders) {
      try {
        const formData = new URLSearchParams();
        formData.append('api_id', apiId);
        formData.append('api_key', apiKey);
        formData.append('id', order.provider_order_id);

        const res = await fetch('https://irvankedesmm.co.id/api/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        const irvanData = await res.json();
        
        if (irvanData.status && irvanData.data && irvanData.data.status) {
          const remoteStatus = irvanData.data.status.toLowerCase();
          
          // Mapping status IrvanKede (Pending, Processing, In progress, Partial, Success, Completed, Canceled, Error)
          // ke status lokal kita.
          let localStatus = 'processing';
          
          if (['success', 'completed'].includes(remoteStatus)) {
            localStatus = 'completed';
          } else if (['error', 'canceled'].includes(remoteStatus)) {
            localStatus = 'failed';
          } else if (['partial'].includes(remoteStatus)) {
            localStatus = 'completed'; // Anggap aja beres kalo partial, atau bisa custom 'partial'
          } else if (['pending', 'processing', 'in progress'].includes(remoteStatus)) {
            localStatus = 'processing';
          }

          // Kalau ada perubahan status, update database lokal
          if (localStatus !== 'processing') {
            await supabaseAdmin
              .from('smm_orders')
              .update({ status: localStatus })
              .eq('id', order.id);
            
            updatedCount++;
          }
        }
      } catch (err) {
        console.error(`Gagal cek status untuk order ${order.id}:`, err);
        // Lanjut ke order berikutnya jika satu gagal
      }
    }

    return NextResponse.json({ 
      status: true, 
      message: `Sinkronisasi selesai! ${updatedCount} pesanan berhasil diupdate statusnya.`,
      updated_count: updatedCount
    });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
