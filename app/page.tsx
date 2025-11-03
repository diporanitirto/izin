'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuratForm from '@/components/SuratForm';
import PreviewSection from '@/components/PreviewSection';
import CekIzin from '@/components/CekIzin';
import NISModal from '@/components/NISModal';

interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
  nis?: string;
}

interface SiswaData {
  kelas: string;
  nama: string;
  presensi: number;
  nis: number;
}

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [showCekIzin, setShowCekIzin] = useState(false);
  const [showNISModal, setShowNISModal] = useState(true);
  const [nis, setNis] = useState('');
  const [siswaData, setSiswaData] = useState<SiswaData | null>(null);
  const [previewIzinId, setPreviewIzinId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    absen: '',
    kelas: '',
    sangga: '',
    pkKelas: '',
    alasan: '',
  });

  useEffect(() => {
    // Check if NIS is already stored in sessionStorage
    const storedNis = sessionStorage.getItem('nis');
    const storedSiswaData = sessionStorage.getItem('siswaData');
    
    if (storedNis && storedSiswaData) {
      setNis(storedNis);
      setSiswaData(JSON.parse(storedSiswaData));
      setShowNISModal(false);
    }

    // Check if URL has showCekIzin parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('showCekIzin') === 'true' && storedNis) {
        setShowCekIzin(true);
        // Clean URL without reload
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const handleNISSubmit = (submittedNis: string, data: SiswaData) => {
    setNis(submittedNis);
    setSiswaData(data);
    setShowNISModal(false);
    
    // Store in sessionStorage
    sessionStorage.setItem('nis', submittedNis);
    sessionStorage.setItem('siswaData', JSON.stringify(data));
  };

  const handleChangeNIS = () => {
    const confirmed = confirm(
      'Apakah Anda yakin ingin mengganti NIS?\n\n' +
      'Data sesi saat ini akan dihapus dan Anda akan diminta memasukkan NIS baru.'
    );
    
    if (confirmed) {
      // Clear session storage and show modal again
      sessionStorage.removeItem('nis');
      sessionStorage.removeItem('siswaData');
      setShowNISModal(true);
      setShowCekIzin(false);
      setShowPreview(false);
      setNis('');
      setSiswaData(null);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log('📤 Sending to API:', data);
    
    const headers = {
      'Content-Type': 'application/json',
    } as const;

    const dbResponse = await fetch('/api/izin', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📥 DB Response status:', dbResponse.status);

    if (!dbResponse.ok) {
      const errorPayload = await dbResponse.json().catch(() => null);
      console.error('❌ DB Error:', errorPayload);
      const message = errorPayload?.error ?? 'Gagal menyimpan data ke database.';
      throw new Error(message);
    }

    const dbResult = await dbResponse.json();
    console.log('✅ Data saved to DB:', dbResult);

    const telegramResponse = await fetch('/api/telegram', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!telegramResponse.ok) {
      const errorPayload = await telegramResponse.json().catch(() => null);
      const message =
        errorPayload?.error ?? 'Data tersimpan, tetapi notifikasi Telegram gagal dikirim.';
      console.warn('⚠️ Telegram warning:', message);
      // Don't throw error, telegram is not critical
    }

    setFormData(data);
    setShowPreview(true);
    setShowCekIzin(false); // Close cek izin if open
  };

  const handleBack = () => {
    setShowPreview(false);
    setPreviewIzinId(null);
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        strategy="beforeInteractive"
      />
      
      <NISModal isOpen={showNISModal} onSubmit={handleNISSubmit} />
      
      {!showNISModal && (
        <>
          <Header />
          
          {/* Info Bar dengan Data Siswa dan Tombol Ganti NIS */}
          {!showPreview && siswaData && (
            <div className="max-w-[900px] mx-auto px-3 sm:px-4 md:px-10 py-3 sm:py-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 text-white w-full sm:w-auto">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <i className="fas fa-user-circle text-xl sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm opacity-90 mb-0.5">Logged in as</p>
                    <p className="font-bold text-base sm:text-lg truncate">{siswaData.nama}</p>
                    <p className="text-[10px] sm:text-xs opacity-80">NIS: {nis} | Kelas: {siswaData.kelas}</p>
                  </div>
                </div>
                <button
                  onClick={handleChangeNIS}
                  className="w-full sm:w-auto bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <i className="fas fa-sync-alt text-xs sm:text-sm"></i>
                  <span>Ganti NIS</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Tombol Cek Izin */}
          {!showPreview && siswaData && (
            <div className="max-w-[900px] mx-auto px-3 sm:px-4 md:px-10 pb-3 sm:pb-4 flex justify-center">
              <button
                onClick={() => setShowCekIzin(!showCekIzin)}
                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all shadow-md active:scale-95 ${
                  showCekIzin
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <i className={`fas ${showCekIzin ? 'fa-times' : 'fa-list'} mr-2 text-sm`}></i>
                <span className="text-sm sm:text-base">{showCekIzin ? 'Tutup Riwayat Izin' : 'Cek Izin Saya'}</span>
              </button>
            </div>
          )}
          
          <main className="max-w-[900px] mx-auto bg-[#fdfaf4] px-3 sm:px-4 md:px-10 py-4 sm:py-6 md:py-10 rounded-xl shadow-xl border-2 border-mediumBrown mb-4 sm:mb-6" role="main">
            {showCekIzin && !showPreview && siswaData ? (
              <CekIzin nis={nis} />
            ) : !showPreview && siswaData ? (
              <SuratForm 
                onSubmit={handleFormSubmit} 
                initialData={formData} 
                nis={nis}
                siswaData={{
                  nama: siswaData.nama,
                  kelas: siswaData.kelas.includes('-') ? siswaData.kelas : `X-${siswaData.kelas.replace('X', '')}`,
                  absen: siswaData.presensi.toString()
                }}
              />
            ) : (
              <PreviewSection formData={formData} onBack={handleBack} izinId={previewIzinId} />
            )}
          </main>
          
          <Footer />
        </>
      )}
    </>
  );
}
