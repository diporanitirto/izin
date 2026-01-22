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
      <div className="min-h-screen flex items-center justify-center bg-scoutKhaki-50">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="inline-block p-4 rounded-xl bg-white shadow-md mb-6 border border-scoutBrown-100">
            <Image
              src="/assets/logo-diporani.png"
              alt="Logo Diporani"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-scoutBrown-800 mb-4">
            Memuat...
          </h2>

          <div className="w-full h-2 bg-scoutBrown-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-scoutBrown-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <p className="text-sm text-scoutBrown-500 mt-3">
            {loadingProgress}%
          </p>
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

          {/* Simple Profile Card */}
          {!showPreview && siswaData && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-scoutBrown-200">
                <div className="flex items-center gap-4">
                  <div className="bg-scoutKhaki-100 p-3 rounded-lg border border-scoutBrown-200">
                    <svg className="w-8 h-8 text-scoutBrown-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-scoutBrown-800 truncate">{siswaData.nama}</p>
                    <p className="text-sm text-scoutBrown-500">NIS: {nis} • Kelas: {siswaData.kelas}</p>
                  </div>
                  <button
                    onClick={() => setShowChangeNISModal(true)}
                    className="text-scoutBrown-500 hover:text-scoutBrown-700 p-2"
                    title="Ganti Akun"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-scoutBrown-100">
                  <Link
                    href="/workflow"
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-scoutBrown-600 bg-scoutKhaki-50 hover:bg-scoutKhaki-100 text-center"
                  >
                    Panduan
                  </Link>
                  <button
                    onClick={() => setShowCekIzin(!showCekIzin)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white bg-scoutBrown-600 hover:bg-scoutBrown-700 text-center"
                  >
                    {showCekIzin ? 'Tutup Riwayat' : 'Riwayat Izin'}
                  </button>
                </div>
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
