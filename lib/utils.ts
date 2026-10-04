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
 * Generate verification URL
 */
export function getVerificationUrl(baseUrl: string, izinId: string): string {
  return `${baseUrl}/verify/${izinId}`;
}
