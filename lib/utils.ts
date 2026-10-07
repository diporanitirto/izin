// Utility functions untuk aplikasi izin

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format tanggal singkat
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Validasi NIS
 */
export function validateNIS(nis: string): boolean {
  const cleaned = nis.trim();
  return cleaned.length > 0 && /^\d+$/.test(cleaned);
}

/**
 * Link wa.me berisi ringkasan izin yang sudah disetujui
 */
export function getWhatsAppShareUrl(izin: {
  nama: string;
  kelas: string;
  sangga: string | null;
  alasan: string;
  created_at: string;
}): string {
  const tanggal = new Date(izin.created_at).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  const text = [
    `Tanggal: ${tanggal} WIB`,
    `Nama: ${izin.nama}`,
    `Kelas: ${izin.kelas}`,
    `Sangga: ${izin.sangga || '-'}`,
    `Alasan: ${izin.alasan}`,
    '',
    '*Izin telah disetujui*',
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generate verification URL
 */
export function getVerificationUrl(baseUrl: string, izinId: string): string {
  return `${baseUrl}/verify/${izinId}`;
}
