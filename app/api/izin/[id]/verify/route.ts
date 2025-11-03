import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Konfigurasi database belum lengkap.' },
        { status: 500 },
      );
    }

    const { status, verifiedBy } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid. Harus "approved" atau "rejected".' },
        { status: 400 },
      );
    }

    if (!verifiedBy || !verifiedBy.trim()) {
      return NextResponse.json(
        { error: 'Nama verifikator harus diisi.' },
        { status: 400 },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
      global: { headers: { 'x-client-info': 'izin-app/1.0.0' } },
    });

    const { data, error } = await supabase
      .from('izin')
      .update({
        status,
        verified_by: verifiedBy,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Gagal memverifikasi data.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Verify izin error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan.' },
      { status: 500 },
    );
  }
}
