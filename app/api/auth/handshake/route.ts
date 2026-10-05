import { NextResponse } from 'next/server';
import { sessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  if (!token || token !== sessionToken()) {
    return NextResponse.json({ error: 'Token tidak valid.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}
