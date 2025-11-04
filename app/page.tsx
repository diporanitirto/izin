'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-scoutKhaki-50 to-scoutBrown-100">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8 animate-scale-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-scoutBrown-900 mb-2">
              Memuat Aplikasi
            </h2>
            <p className="text-scoutBrown-600 text-sm">
              Mohon tunggu sebentar...
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="relative">
            {/* Background track */}
            <div className="w-full h-3 bg-scoutBrown-200/50 rounded-full overflow-hidden shadow-inner">
              {/* Progress fill */}
              <div 
                className="h-full bg-gradient-to-r from-scoutBrown-700 via-scoutBrown-800 to-scoutBrown-900 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${loadingProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
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
            <p className="text-xs text-scoutBrown-500 font-medium">
              {loadingProgress < 30 && "Memulai aplikasi..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Memeriksa sesi..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Memuat data..."}
              {loadingProgress >= 90 && "Hampir selesai..."}
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
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-scoutBrown-200/50">
                <div className="flex items-center gap-3">
                  {/* Icon & User Info */}
                  <div className="bg-gradient-to-br from-scoutBrown-700 to-scoutBrown-900 p-2.5 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-scoutBrown-900 truncate">{siswaData.nama}</p>
                    <p className="text-xs text-scoutBrown-600 mt-0.5">NIS: {nis} • {siswaData.kelas}</p>
                  </div>
                  
                  {/* Button Ganti NIS - Icon Only */}
                  <button
                    onClick={() => setShowChangeNISModal(true)}
                    className="group bg-scoutKhaki-100 hover:bg-scoutBrown-800 text-scoutBrown-800 hover:text-white p-2 rounded-lg transition-all border border-scoutBrown-300 hover:border-scoutBrown-800 flex items-center justify-center flex-shrink-0"
                    title="Ganti NIS"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
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
            <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 p-5 sm:p-6 animate-fade-in">
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
          </main>
          
          <Footer />
        </>
      )}
    </>
  );
}
