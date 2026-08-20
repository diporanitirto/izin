export interface SiswaData {
  kelas: string;
  nama: string;
  presensi: number;
  nis: number;
  sangga: string | null;
}

export interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  alasan: string;
  nis?: string;
}

export interface IzinData {
  id: string;
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pk_kelas: string;
  alasan: string;
  nis: string;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}
