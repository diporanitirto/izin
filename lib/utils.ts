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
 * Get status badge color
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  label: string;
} {
  const statusMap = {
    pending: {
      bg: 'bg-yellow-200',
      text: 'text-yellow-800',
      label: 'Menunggu',
    },
    approved: {
      bg: 'bg-green-200',
      text: 'text-green-800',
      label: 'Disetujui',
    },
    rejected: {
      bg: 'bg-red-200',
      text: 'text-red-800',
      label: 'Ditolak',
    },
  };

  return (
    statusMap[status as keyof typeof statusMap] || {
      bg: 'bg-gray-200',
      text: 'text-gray-800',
      label: status,
    }
  );
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
