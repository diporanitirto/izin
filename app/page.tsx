'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuratForm from '@/components/SuratForm';
import PreviewSection from '@/components/PreviewSection';
import CekIzin from '@/components/CekIzin';
import NISModal from '@/components/NISModal';
import ChangeNISModal from '@/components/ChangeNISModal';

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
  sangga: string | null;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showCekIzin, setShowCekIzin] = useState(false);
  const [showNISModal, setShowNISModal] = useState(false);
  const [showChangeNISModal, setShowChangeNISModal] = useState(false);
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
    // Simulate realistic loading progress
    const intervals = [
      { time: 100, progress: 20 },   // Initial load
      { time: 200, progress: 45 },   // Checking session
      { time: 150, progress: 70 },   // Loading data
      { time: 200, progress: 90 },   // Almost done
      { time: 150, progress: 100 },  // Complete
    ];

    let currentStep = 0;
    const runProgress = () => {
      if (currentStep < intervals.length) {
        const { time, progress } = intervals[currentStep];
        setTimeout(() => {
          setLoadingProgress(progress);
          currentStep++;
          runProgress();
        }, time);
      }
    };

    runProgress();

    // Check if NIS is already stored in sessionStorage
    const storedNis = sessionStorage.getItem('nis');
    const storedSiswaData = sessionStorage.getItem('siswaData');

    if (storedNis && storedSiswaData) {
      try {
        const parsedData = JSON.parse(storedSiswaData);
        setNis(storedNis);
        setSiswaData(parsedData);
        setShowNISModal(false);
      } catch (error) {
        console.error('Error parsing stored siswa data:', error);
        // Clear corrupted data
        sessionStorage.removeItem('nis');
        sessionStorage.removeItem('siswaData');
        setShowNISModal(true);
      }
    } else {
      // No stored data, show modal
      setShowNISModal(true);
    }

    // Finish loading check after progress completes
    setTimeout(() => {
      setIsLoading(false);
    }, 800);

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
    // Clear session storage and show modal again
    sessionStorage.removeItem('nis');
    sessionStorage.removeItem('siswaData');
    setShowNISModal(true);
    setShowChangeNISModal(false);
    setShowCekIzin(false);
    setShowPreview(false);
    setNis('');
    setSiswaData(null);
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

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-scoutKhaki-50 to-scoutBrown-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 compass-pattern opacity-10 pointer-events-none"></div>

        <div className="w-full max-w-md px-6 relative z-10">
          <div className="text-center mb-8 animate-scale-in">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-white to-scoutKhaki-50 mb-4 shadow-xl ring-4 ring-scoutBrown-100 border border-scoutBrown-200">
              <Image
                src="/assets/logo-diporani.png"
                alt="Logo Diporani"
                width={64}
                height={64}
                className="object-contain mix-blend-multiply animate-pulse"
                priority
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-scoutBrown-900 mb-2 font-display">
              SIAP SEDIA
            </h2>
            <p className="text-scoutBrown-600 text-sm font-medium">
              Mempersiapkan kelengkapan...
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="relative">
            {/* Background track */}
            <div className="w-full h-4 bg-scoutBrown-100 rounded-full overflow-hidden shadow-inner border border-scoutBrown-300">
              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-scoutBrown-600 via-scoutBrown-500 to-scoutBrown-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${loadingProgress}%` }}
              >
                {/* Hasduk Pattern on Progress Bar */}
                <div className="absolute inset-0 opacity-20 pattern-hasduk"></div>
              </div>
            </div>

            {/* Percentage text */}
            <div className="mt-3 text-center">
              <span className="text-sm font-bold text-scoutBrown-800">
                {loadingProgress}%
              </span>
            </div>
          </div>

          {/* Loading messages based on progress */}
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-xs text-scoutBrown-600 font-semibold uppercase tracking-wider">
              {loadingProgress < 30 && "Menyiapkan..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Mengecek Atribut..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Menyiapkan Surat..."}
              {loadingProgress >= 90 && "Siap!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        strategy="beforeInteractive"
      />

      <NISModal isOpen={showNISModal} onSubmit={handleNISSubmit} />

      <ChangeNISModal
        isOpen={showChangeNISModal}
        currentNIS={nis}
        currentName={siswaData?.nama || ''}
        onConfirm={handleChangeNIS}
        onCancel={() => setShowChangeNISModal(false)}
      />

      {!showNISModal && (
        <>
          <Header />

          {/* Info Bar & Riwayat - Side by Side Compact */}
          {!showPreview && siswaData && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4 animate-slide-up">
              {/* Profile Card */}
              {/* Profile Card - KTA Style */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-0 border-2 border-scoutBrown-800 overflow-hidden relative group">
                {/* Header KTA */}
                <div className="bg-scoutBrown-800 p-2 flex justify-between items-center pattern-hasduk relative">
                  <div className="absolute inset-0 bg-scoutBrown-900/40 backdrop-blur-[1px]"></div>
                  <h3 className="text-white font-bold text-sm z-10 relative px-2 tracking-wider">KARTU TANDA ANGGOTA</h3>
                  <div className="w-2 h-2 rounded-full bg-scoutGreen-500 z-10 relative animate-pulse"></div>
                </div>

                <div className="p-4 relative">
                  {/* Watermark */}
                  <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-4 translate-x-4">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 3.5l6 10.5H6L12 5.5z" /></svg>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Photo Placeholder / Icon */}
                    <div className="bg-gradient-to-br from-scoutKhaki-100 to-white p-3 rounded-lg border-2 border-scoutBrown-200 shadow-inner flex-shrink-0">
                      <svg className="w-10 h-10 text-scoutBrown-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0 font-mono">
                      <p className="font-bold text-base sm:text-lg text-scoutBrown-900 truncate uppercase">{siswaData.nama}</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex text-xs text-scoutBrown-700">
                          <span className="w-12 opacity-70">NIA</span>
                          <span className="font-semibold">: {nis}</span>
                        </div>
                        <div className="flex text-xs text-scoutBrown-700">
                          <span className="w-12 opacity-70">KELAS</span>
                          <span className="font-semibold">: {siswaData.kelas}</span>
                        </div>
                      </div>
                    </div>

                    {/* Button Ganti NIS */}
                    <button
                      onClick={() => setShowChangeNISModal(true)}
                      className="group bg-scoutKhaki-50 hover:bg-scoutBrown-50 text-scoutBrown-700 p-2 rounded-lg border border-scoutBrown-200 transition-all flex-shrink-0"
                      title="Ganti Akun"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Below card on mobile, inside on desktop */}
              <div className="flex sm:hidden items-center gap-2 mt-3">
                {/* Button Panduan - Mobile */}
                <Link
                  href="/workflow"
                  className="flex-1 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Panduan</span>
                </Link>

                {/* Button Lihat/Tutup Riwayat Izin - Mobile */}
                <button
                  onClick={() => setShowCekIzin(!showCekIzin)}
                  className="flex-1 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2 bg-scoutBrown-900 hover:bg-scoutBrown-950 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showCekIzin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                  <span>{showCekIzin ? 'Tutup Riwayat' : 'Lihat Riwayat'}</span>
                </button>
              </div>

              {/* Desktop Buttons - Inside extended card */}
              <div className="hidden sm:flex items-center gap-2 mt-3">
                {/* Button Panduan - Desktop */}
                <Link
                  href="/workflow"
                  className="flex-1 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Panduan</span>
                </Link>

                {/* Button Lihat/Tutup Riwayat Izin - Desktop */}
                <button
                  onClick={() => setShowCekIzin(!showCekIzin)}
                  className="flex-1 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2 bg-scoutBrown-900 hover:bg-scoutBrown-950 text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showCekIzin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                  <span>
                    {showCekIzin ? 'Tutup Riwayat Izin' : 'Lihat Riwayat Izin'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" role="main">
            <div className="bg-white rounded-xl shadow-xl border-2 border-scoutBrown-200 p-5 sm:p-6 animate-fade-in relative z-10 wood-texture">
              {/* Paper effect overlay */}
              <div className="absolute inset-0 bg-white/95 rounded-[10px]"></div>
              <div className="relative z-10">
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
                      absen: siswaData.presensi.toString(),
                      sangga: siswaData.sangga || ''
                    }}
                  />
                ) : (
                  <PreviewSection formData={formData} onBack={handleBack} izinId={previewIzinId} />
                )}
              </div>
            </div>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
