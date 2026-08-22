import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: false, message: 'ID pesanan tidak valid' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('smm_orders')
      .select('id, service_name, target, quantity, price, status, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
