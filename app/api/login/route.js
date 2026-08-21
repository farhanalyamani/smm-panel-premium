import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    // Cek kecocokan dengan file .env.local
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Bikin brankas cookie yang aman (HttpOnly)
      const cookieStore = await cookies();
      cookieStore.set('smm_admin_token', 'valid_admin_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return NextResponse.json({ status: true });
    }
    
    return NextResponse.json({ status: false, message: 'Username atau Password salah bos!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Sistem error' }, { status: 500 });
  }
}
