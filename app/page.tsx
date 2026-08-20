'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuratForm from '@/components/SuratForm';
import PreviewSection from '@/components/PreviewSection';
import CekIzin from '@/components/CekIzin';
import NISModal from '@/components/NISModal';
import ChangeNISModal from '@/components/ChangeNISModal';
import { parseSiswaData, type SiswaData } from '@/lib/utils';
import type { FormData } from '@/lib/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
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
    alasan: '',
  });

  useEffect(() => {
    const storedNis = sessionStorage.getItem('nis');
    const storedSiswaData = sessionStorage.getItem('siswaData');

    if (storedNis && storedSiswaData) {
      try {
        const parsedData = JSON.parse(storedSiswaData) as SiswaData;
        setNis(storedNis);
        setSiswaData(parsedData);
      } catch {
        sessionStorage.removeItem('nis');
        sessionStorage.removeItem('siswaData');
        setShowNISModal(true);
      }
    } else {
      setShowNISModal(true);
    }

    setIsLoading(false);

    const params = new URLSearchParams(window.location.search);
    if (params.get('showCekIzin') === 'true' && storedNis) {
      setShowCekIzin(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleNISSubmit = (submittedNis: string, data: SiswaData) => {
    setNis(submittedNis);
    setSiswaData(data);
    setShowNISModal(false);
    sessionStorage.setItem('nis', submittedNis);
    sessionStorage.setItem('siswaData', JSON.stringify(data));
  };

  const handleChangeNIS = () => {
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
    const dbResponse = await fetch('/api/izin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!dbResponse.ok) {
      const err = await dbResponse.json().catch(() => null);
      throw new Error(err?.error ?? 'Gagal menyimpan data.');
    }

    const dbResult = await dbResponse.json();

    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    setFormData(data);
    setPreviewIzinId(dbResult?.data?.id ?? null);
    setShowPreview(true);
    setShowCekIzin(false);
  };

  const handleBack = () => {
    setShowPreview(false);
    setPreviewIzinId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/assets/logo-diporani.png"
            alt="Logo Diporani"
            width={56}
            height={56}
            className="object-contain mx-auto mb-3"
            priority
          />
          <p className="text-scoutBrown-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

          {!showPreview && siswaData && (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4 mb-4">
              <div className="bg-white rounded-xl border border-scoutBrown-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-scoutKhaki-100 p-3 rounded-xl">
                    <svg className="w-7 h-7 text-scoutBrown-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-scoutBrown-900 truncate">{siswaData.nama}</p>
                    <p className="text-sm text-scoutBrown-500">NIS: {nis} • Kelas: {siswaData.kelas}</p>
                  </div>
                  <button
                    onClick={() => setShowChangeNISModal(true)}
                    className="text-scoutBrown-400 hover:text-scoutBrown-600 p-2 rounded-lg hover:bg-scoutKhaki-50 transition-colors"
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
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-scoutBrown-600 bg-scoutKhaki-50 hover:bg-scoutKhaki-100 text-center transition-colors"
                  >
                    Panduan
                  </Link>
                  <button
                    onClick={() => setShowCekIzin(!showCekIzin)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white bg-scoutBrown-700 hover:bg-scoutBrown-800 text-center transition-colors"
                  >
                    {showCekIzin ? 'Tutup Riwayat' : 'Riwayat Izin'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-8" role="main">
            <div className="animate-fade-in">
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
