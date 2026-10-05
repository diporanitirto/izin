import { NextResponse } from 'next/server';
import { isAuthenticated, SESSION_COOKIE, userFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const ok = await isAuthenticated();
  const store = await cookies();
  return NextResponse.json({ authenticated: ok, username: ok ? userFromToken(store.get(SESSION_COOKIE)?.value) : null });
}
