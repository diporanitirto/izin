import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface IzinPayload {
  nama: string;
  absen: string | number;
  kelas: string;
  sangga?: string;
  alasan: string;
  nis?: string | number;
}

const ALLOWED_KELAS = new Set(['X1','X2','X3','X4','X5','X6','X7','X8','XADMIN']);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<IzinPayload>;

    const requiredFields: Array<keyof IzinPayload> = ['nama', 'absen', 'kelas', 'alasan'];
    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return NextResponse.json({ error: `Field "${missingField}" wajib diisi.` }, { status: 400 });
    }

    const absenNumber = Number(String(payload.absen).replace(/\D/g, ''));
    if (!Number.isInteger(absenNumber) || absenNumber <= 0) {
      return NextResponse.json({ error: 'Nomor absen harus berupa angka positif.' }, { status: 400 });
    }

    const kelasNormalized = String(payload.kelas).replace(/[^0-9A-Z]/gi, '').toUpperCase();
    if (!ALLOWED_KELAS.has(kelasNormalized)) {
      return NextResponse.json({ error: 'Kelas tidak valid.' }, { status: 400 });
    }

    const supabase = getSupabase();
    const nisValue = payload.nis ? String(payload.nis) : String(absenNumber);

    const { data, error } = await supabase
      .from('izin')
      .insert({
        nama: payload.nama,
        absen: absenNumber,
        kelas: kelasNormalized,
        sangga: payload.sangga || '',
        pk_kelas: '',
        alasan: payload.alasan,
        nis: nisValue,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message ?? 'Gagal menyimpan data.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Database route error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memproses permintaan.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const nis = searchParams.get('nis');

    const supabase = getSupabase();
    let query = supabase.from('izin').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (nis) {
      query = query.eq('nis', nis);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Gagal mengambil data.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Database GET error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
  }
}
