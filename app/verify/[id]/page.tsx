'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PreviewSection from '@/components/PreviewSection';
import Loading from '@/components/Loading';

// Import QRCode secara dynamic untuk menghindari SSR issues
const QRCodeCanvas = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeCanvas), {
  ssr: false,
  loading: () => <div className="w-[300px] h-[300px] bg-gray-200 animate-pulse rounded"></div>
});

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

export default function VerifyPage() {
  const params = useParams();
  const id = params.id as string;
  const [izin, setIzin] = useState<IzinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyUrl, setVerifyUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVerifyUrl(window.location.href);
    }
    fetchIzin();
  }, [id]);

  const fetchIzin = async () => {
    try {
      const response = await fetch(`/api/izin/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setIzin(result.data);
      } else {
        alert('Data tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching izin:', error);
      alert('Gagal memuat data');
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

  if (loading) {
    return <Loading />;
  }

  if (!izin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h1>
          <p className="text-gray-600">Izin yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-white ${
            izin.status === 'approved' ? 'bg-green-600' : 
            izin.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            <div className="text-center">
              <i className={`fas ${
                izin.status === 'approved' ? 'fa-check-circle' : 
                izin.status === 'rejected' ? 'fa-times-circle' : 'fa-clock'
              } text-6xl mb-4`}></i>
              <h1 className="text-3xl font-bold mb-2">
                {izin.status === 'approved' ? 'Surat Izin Terverifikasi' : 
                 izin.status === 'rejected' ? 'Surat Izin Ditolak' : 'Menunggu Verifikasi'}
              </h1>
              <p className="text-lg opacity-90">
                Dewan Ambalan DIPORANI · Gudep 3089/3090 · SMA Negeri 1 Kasihan
              </p>
            </div>
          </div>

          {/* QR Code */}
          {izin.status === 'approved' && verifyUrl && (
            <div className="bg-gray-50 p-6 text-center border-b">
              <div className="inline-block bg-white p-4 rounded-lg shadow">
                <QRCodeCanvas
                  value={verifyUrl}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">Scan QR Code untuk verifikasi</p>
            </div>
          )}

          {/* Data Siswa */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-user mr-2"></i>
              Data Siswa
            </h2>
            
            <div className="space-y-3">
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">Nama:</span>
                <span className="flex-1 text-gray-800">{izin.nama}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">NIS:</span>
                <span className="flex-1 text-gray-800">{izin.nis}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">Absen:</span>
                <span className="flex-1 text-gray-800">{izin.absen}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">Kelas:</span>
                <span className="flex-1 text-gray-800">{izin.kelas}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">Sangga:</span>
                <span className="flex-1 text-gray-800">{izin.sangga || '-'}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="w-32 text-gray-600 font-semibold">PK Kelas:</span>
                <span className="flex-1 text-gray-800">{izin.pk_kelas || '-'}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">Alasan Izin:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{izin.alasan}</p>
            </div>

            {/* Info Verifikasi */}
            {izin.verified_by && (
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4">
                <h3 className="font-bold text-blue-800 mb-2">
                  <i className="fas fa-certificate mr-2"></i>
                  Informasi Verifikasi
                </h3>
                <p className="text-blue-700">
                  <strong>Diverifikasi oleh:</strong> {izin.verified_by}
                </p>
                {izin.verified_at && (
                  <p className="text-blue-700 text-sm mt-1">
                    <strong>Waktu:</strong> {formatDate(izin.verified_at)}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Dibuat pada: {formatDate(izin.created_at)}</p>
              <p className="mt-2">ID Izin: {izin.id}</p>
            </div>

            {/* Tombol untuk melihat preview - untuk semua status */}
            {!showPreview && (
              <div className="mt-6">
                <button
                  onClick={() => setShowPreview(true)}
                  className={`w-full px-6 py-3 rounded-lg transition-colors font-semibold ${
                    izin.status === 'approved'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <i className={`fas ${izin.status === 'approved' ? 'fa-file-pdf' : 'fa-eye'} mr-2`}></i>
                  {izin.status === 'approved' 
                    ? 'Lihat Preview & Download Surat'
                    : 'Lihat Preview Surat'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section - untuk semua status */}
        {showPreview && (
          <div className="mt-6">
            <PreviewSection
              formData={{
                nama: izin.nama,
                absen: izin.absen,
                kelas: izin.kelas,
                sangga: izin.sangga || '',
                pkKelas: izin.pk_kelas || '',
                alasan: izin.alasan,
              }}
              onBack={() => setShowPreview(false)}
              izinId={izin.id}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="flex gap-3 items-stretch">
            <a
              href="/"
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center"
            >
              <i className="fas fa-home mr-2"></i>
              Halaman Utama
            </a>
            <a
              href="/?showCekIzin=true"
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center justify-center"
            >
              <i className="fas fa-list mr-2"></i>
              Kembali ke Riwayat Izin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
