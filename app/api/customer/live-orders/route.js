import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Fungsi untuk menyensor target demi privasi pelanggan
const censorTarget = (target) => {
  if (!target) return '***';
  
  target = target.trim();
  
  // Jika target adalah URL (misal: https://instagram.com/farhan)
  if (target.startsWith('http://') || target.startsWith('https://')) {
    try {
      const url = new URL(target);
      return `${url.protocol}//${url.hostname}/***`;
    } catch (e) {
      return target.substring(0, 15) + '***';
    }
  }

  // Jika target adalah username dengan @ (misal: @farhanalyamani)
  if (target.startsWith('@')) {
    if (target.length <= 3) return '@***';
    return target.substring(0, 3) + '***'; // Tampil @ + 2 huruf (misal: @fa***)
  }

  // Fallback string biasa (misal: farhanalyamani)
  if (target.length <= 2) return '***';
  return target.substring(0, 2) + '***'; // Tampil 2 huruf (misal: fa***)
};

export async function GET() {
  try {
    // Ambil 20 orderan terakhir
    const { data, error } = await supabaseAdmin
      .from('smm_orders')
      .select('id, service_name, target, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Format data dan sensor target
    const liveOrders = data.map(order => ({
      id: order.id,
      service_name: order.service_name.split('|')[0].trim(), // Ambil nama utamanya aja
      target: censorTarget(order.target),
      status: order.status,
      created_at: order.created_at
    }));

    return NextResponse.json({ status: true, data: liveOrders });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
