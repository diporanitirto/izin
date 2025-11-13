'use client';

import { useState, useEffect } from 'react';
import Loading from './Loading';

interface IzinData {
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

interface CekIzinProps {
  nis: string;
}

export default function CekIzin({ nis }: CekIzinProps) {
  const [izinList, setIzinList] = useState<IzinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIzinData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nis]);

  const loadIzinData = async () => {
    setLoading(true);

    try {
      console.log('🔄 Loading izin data for NIS:', nis);
      const response = await fetch(`/api/izin?nis=${nis}`);
      const result = await response.json();
      
      console.log('📊 Izin data result:', result);
      
      if (result.success) {
        setIzinList(result.data);
        console.log(`✅ Found ${result.data.length} izin records`);
      } else {
        console.error('❌ Failed to load data:', result);
        setIzinList([]);
      }
    } catch (error) {
      console.error('❌ Error loading izin:', error);
      setIzinList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-200 text-yellow-800',
      approved: 'bg-green-200 text-green-800',
      rejected: 'bg-red-200 text-red-800',
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status as keyof typeof badges] || 'bg-gray-200 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-list mr-2"></i>
          Riwayat Izin Saya
        </h2>
        <button
          onClick={loadIzinData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-semibold"
        >
          <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`}></i>
          Refresh
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : izinList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-600 text-lg">Anda belum pernah membuat izin</p>
          <p className="text-gray-500 text-sm mt-2">NIS: {nis}</p>
        </div>
      ) : (
        <>
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Ditemukan <strong>{izinList.length}</strong> izin untuk NIS <strong>{nis}</strong>
            </p>
          </div>
          <div className="space-y-4">
          {izinList.map((izin) => (
            <div key={izin.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <h3 className="font-bold text-gray-800">{izin.nama}</h3>
                <p className="text-sm text-gray-500">{formatDate(izin.created_at)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <p className="text-gray-600"><strong>Kelas:</strong> {izin.kelas}</p>
                <p className="text-gray-600"><strong>Sangga:</strong> {izin.sangga || '-'}</p>
              </div>

              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-3">
                <strong>Alasan:</strong> {izin.alasan}
              </p>

              {/* Tombol download selalu tersedia untuk semua izin */}
              <a
                href={`/verify/${izin.id}`}
                className="mt-3 block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
              >
                <i className="fas fa-file-download mr-2"></i>
                Lihat & Download Surat
              </a>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
