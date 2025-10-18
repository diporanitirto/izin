import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface IzinPayload {
  nama: string;
  absen: string | number;
  kelas: string;
  alasan: string;
}

const ALLOWED_KELAS = new Set([
  'X1',
  'X2',
  'X3',
  'X4',
  'X5',
  'X6',
  'X7',
  'X8',
]);

export async function POST(request: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        {
          error:
            'Konfigurasi database belum lengkap. Set environment SUPABASE_SERVICE_ROLE_KEY agar server dapat menulis data.',
        },
        { status: 500 },
      );
    }

    const payload = (await request.json()) as Partial<IzinPayload>;

    const requiredFields: Array<keyof IzinPayload> = ['nama', 'absen', 'kelas', 'alasan'];
    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return NextResponse.json(
        { error: `Field "${missingField}" wajib diisi.` },
        { status: 400 },
      );
    }

    const absenNumber = Number(String(payload.absen).replace(/\D/g, ''));
    if (!Number.isInteger(absenNumber) || absenNumber <= 0) {
      return NextResponse.json(
        { error: 'Nomor absen harus berupa angka positif.' },
        { status: 400 },
      );
    }

    const kelasNormalized = String(payload.kelas)
      .replace(/[^0-9A-Z]/gi, '')
      .toUpperCase();
    if (!ALLOWED_KELAS.has(kelasNormalized)) {
      return NextResponse.json(
        { error: 'Kelas tidak valid.' },
        { status: 400 },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
      global: { headers: { 'x-client-info': 'izin-app/1.0.0' } },
    });

    const { data, error } = await supabase
      .from('izin')
      .insert({
        nama: payload.nama,
        absen: absenNumber,
        kelas: kelasNormalized,
        alasan: payload.alasan,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        {
          error:
            error.message ??
            'Gagal menyimpan data ke database. Periksa konfigurasi Supabase atau kebijakan RLS.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Database route error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan.' },
      { status: 500 },
    );
  }
}
