'use client';

import { useState } from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuratForm from '@/components/SuratForm';
import PreviewSection from '@/components/PreviewSection';

interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
}

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    absen: '',
    kelas: '',
    sangga: '',
    pkKelas: '',
    alasan: '',
  });

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        strategy="beforeInteractive"
      />
      
      <Header />
      
      <main className="max-w-[900px] mx-auto bg-[#fdfaf4] px-4 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-lg shadow-lg border-2 border-mediumBrown" role="main">
        {!showPreview ? (
          <SuratForm onSubmit={handleFormSubmit} initialData={formData} />
        ) : (
          <PreviewSection formData={formData} onBack={handleBack} />
        )}
      </main>
      
      <Footer />
    </>
  );
}
