import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('smm_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('smm_admin_token');
    if (!adminToken || adminToken.value !== 'valid_admin_session') {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { order_id, status } = await req.json();
    if (!order_id || !status) {
      return NextResponse.json({ status: false, message: 'Invalid data' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('smm_orders')
      .update({ status })
      .eq('id', order_id);

    if (error) throw error;

    return NextResponse.json({ status: true, message: 'Order updated' });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}
