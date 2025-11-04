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
  const [qrSize, setQrSize] = useState(280);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVerifyUrl(window.location.href);
      
      // Set QR size based on screen width
      const updateQrSize = () => {
        const width = window.innerWidth;
        if (width < 400) {
          setQrSize(200);
        } else if (width < 640) {
          setQrSize(240);
        } else {
          setQrSize(280);
        }
      };
      
      updateQrSize();
      window.addEventListener('resize', updateQrSize);
      return () => window.removeEventListener('resize', updateQrSize);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchIzin();
    }
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-4 sm:p-6 text-white ${
            izin.status === 'approved' ? 'bg-green-600' : 
            izin.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            <div className="text-center">
              <i className={`fas ${
                izin.status === 'approved' ? 'fa-check-circle' : 
                izin.status === 'rejected' ? 'fa-times-circle' : 'fa-clock'
              } text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4`}></i>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 px-2">
                {izin.status === 'approved' ? 'Surat Izin Terverifikasi' : 
                 izin.status === 'rejected' ? 'Surat Izin Ditolak' : 'Menunggu Verifikasi'}
              </h1>
              <p className="text-xs sm:text-sm md:text-base opacity-90 px-2 leading-relaxed">
                Dewan Ambalan DIPORANI<br className="sm:hidden" />
                <span className="hidden sm:inline"> · </span>
                Gudep 3089/3090<br className="sm:hidden" />
                <span className="hidden sm:inline"> · </span>
                SMA Negeri 1 Kasihan
              </p>
            </div>
          </div>

          {/* QR Code */}
          {izin.status === 'approved' && verifyUrl && (
            <div className="bg-gray-50 p-4 sm:p-6 flex flex-col items-center justify-center border-b">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-center">
                <QRCodeCanvas
                  value={verifyUrl}
                  size={qrSize}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-3 text-center px-2">
                Scan QR Code untuk verifikasi
              </p>
            </div>
          )}

          {/* Data Siswa */}
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <i className="fas fa-user mr-2 text-sm sm:text-base"></i>
              Data Siswa
            </h2>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">Nama:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800 break-words">{izin.nama}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">NIS:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800">{izin.nis}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">Absen:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800">{izin.absen}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">Kelas:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800">{izin.kelas}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">Sangga:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800">{izin.sangga || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:border-b pb-2">
                <span className="text-sm sm:text-base text-gray-600 font-semibold sm:w-32 mb-1 sm:mb-0">PK:</span>
                <span className="text-sm sm:text-base flex-1 text-gray-800 break-words">{izin.pk_kelas || '-'}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-4 sm:mt-6 mb-2">Alasan Izin:</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{izin.alasan}</p>
            </div>

            {/* Info Verifikasi */}
            {izin.verified_by && (
              <div className="mt-4 sm:mt-6 bg-blue-50 border-l-4 border-blue-600 p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-2">
                  <i className="fas fa-certificate mr-2 text-xs sm:text-sm"></i>
                  Informasi Verifikasi
                </h3>
                <p className="text-xs sm:text-sm text-blue-700">
                  <strong>Diverifikasi oleh:</strong> {izin.verified_by}
                </p>
                {izin.verified_at && (
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    <strong>Waktu:</strong> {formatDate(izin.verified_at)}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 space-y-1">
              <p>Dibuat pada: {formatDate(izin.created_at)}</p>
              <p className="break-all px-2">ID Izin: {izin.id}</p>
            </div>

            {/* Tombol untuk melihat preview - untuk semua status */}
            {!showPreview && (
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => setShowPreview(true)}
                  className={`w-full px-4 sm:px-6 py-3 rounded-lg transition-colors text-sm sm:text-base font-semibold ${
                    izin.status === 'approved'
                      ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
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
          <div className="mt-4 sm:mt-6">
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

        {/* Tombol Navigasi */}
        <div className="mt-4 sm:mt-6">
          <a
            href="/"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center active:scale-95"
          >
            <i className="fas fa-home mr-2"></i>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
