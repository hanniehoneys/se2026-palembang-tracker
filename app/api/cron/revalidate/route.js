import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized Validation Call' }, { status: 401 });
  }

  revalidateTag('census-data');

  return NextResponse.json({ 
    revalidated: true, 
    timestamp: new Date().toISOString() 
  });
}