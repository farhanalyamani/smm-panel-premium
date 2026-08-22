import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('smm_admin_token');
  return NextResponse.json({ status: true, message: 'Logged out' });
}
