import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validasi data
    if (!body.service_id || !body.target || !body.quantity || !body.price) {
      return NextResponse.json({ status: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    // Insert menggunakan supabaseAdmin (bypass RLS)
    const { data, error } = await supabaseAdmin.from('smm_orders').insert([{
      service_id: body.service_id,
      service_name: body.service_name,
      target: body.target, 
      quantity: body.quantity, 
      price: body.price, 
      status: 'pending',
      receipt_url: body.receipt_url
    }]).select();

    if (error) throw error;

    return NextResponse.json({ status: true, data: data[0] });

  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
