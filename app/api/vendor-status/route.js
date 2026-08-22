import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    // 1. Verifikasi admin
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'DITOLAK! Lu bukan admin bos.' }, { status: 401 });
    }

    const { provider_order_id } = await req.json();
    if (!provider_order_id) {
      return NextResponse.json({ status: false, message: 'Provider Order ID tidak ditemukan' }, { status: 400 });
    }

    const apiId = process.env.IRVANKEDE_API_ID;
    const apiKey = process.env.IRVANKEDE_API_KEY;

    if (!apiId || !apiKey) {
      return NextResponse.json({ status: false, message: 'API Credentials missing' }, { status: 500 });
    }

    // 2. Kirim request cek status ke Irvan Kede via proxy atau langsung (IrvanKede biasanya action=status)
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);
    formData.append('id', provider_order_id);

    // Endpoint status IrvanKede
    const res = await fetch('https://irvankedesmm.co.id/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const irvanData = await res.json();

    if (irvanData.status === false || irvanData.error) {
      const errorMsg = irvanData.data || irvanData.msg || irvanData.error || irvanData.message || JSON.stringify(irvanData);
      return NextResponse.json({ status: false, message: errorMsg });
    }

    // irvanData.data biasanya berisi: status, start_count, remains
    return NextResponse.json({ status: true, data: irvanData.data || irvanData });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
