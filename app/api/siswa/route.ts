import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nis = searchParams.get('nis')?.trim();

    if (!nis || !/^\d+$/.test(nis)) {
      return NextResponse.json({ error: 'NIS tidak valid.' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: siswa, error } = await supabase
      .from('siswa')
      .select('nis, nama, jk, kelas_id, kelas(nama)')
      .eq('nis', nis)
      .single();

    if (error || !siswa) {
      return NextResponse.json({ error: 'NIS tidak ditemukan.' }, { status: 404 });
    }

    // Nomor absen = urutan NIS dalam satu kelas (sesuai daftar hadir)
    const { count } = await supabase
      .from('siswa')
      .select('*', { count: 'exact', head: true })
      .eq('kelas_id', siswa.kelas_id)
      .lt('nis', siswa.nis);

    const kelasNama = (siswa.kelas as unknown as { nama: string } | null)?.nama ?? '';

    const { data: pendamping } = await supabase
      .from('pendamping')
      .select('nama')
      .eq('kelas_id', siswa.kelas_id)
      .eq('aktif', true)
      .order('id');

    const pkList = (pendamping ?? []).map((p) => p.nama as string);

    return NextResponse.json({
      success: true,
      data: {
        nis: siswa.nis,
        nama: siswa.nama,
        jk: siswa.jk ?? '',
        kelas: kelasNama,
        absen: (count ?? 0) + 1,
        pkList,
      },
    });
  } catch (error) {
    console.error('Siswa GET error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
  }
}
