import { NextResponse } from 'next/server';

export async function GET() {
  const apiId = process.env.IRVANKEDE_API_ID;
  const apiKey = process.env.IRVANKEDE_API_KEY;

  if (!apiId || !apiKey) {
    return NextResponse.json({ status: false, data: 'API Credentials not found in .env.local' }, { status: 400 });
  }

  try {
    // Endpoin standar panel SMM Indonesia (Irvan Kede)
    const formData = new URLSearchParams();
    formData.append('api_id', apiId);
    formData.append('api_key', apiKey);

    const res = await fetch('https://irvankedesmm.co.id/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const responseData = await res.json();
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ status: false, data: error.message }, { status: 500 });
  }
}
