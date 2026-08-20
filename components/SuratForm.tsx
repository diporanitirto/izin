'use client';

import { useState, FormEvent } from 'react';
import type { FormData } from '@/lib/types';

interface SuratFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
  nis: string;
  siswaData: {
    nama: string;
    kelas: string;
    absen: string;
    sangga: string;
  };
}

export default function SuratForm({ onSubmit, initialData, nis, siswaData }: SuratFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: siswaData.nama,
    absen: siswaData.absen,
    kelas: siswaData.kelas,
    sangga: initialData?.sangga || siswaData.sangga || '',
    alasan: initialData?.alasan || '',
    nis,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        kelas: formData.kelas.replace(/-/g, ''),
        nis,
      });
    } catch {
      setErrorMessage('Terjadi kendala saat mengirim data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'absen' ? value.replace(/\D/g, '') : value,
    }));
  };

  return (
    <section className="fade-in" aria-label="Form pembuatan surat">
      <div className="border-2 border-scoutBrown-700 rounded-lg overflow-hidden bg-white shadow-md">
        <div className="bg-scoutBrown-600 border-b border-scoutBrown-500 px-3 sm:px-4 py-2 sm:py-3">
          <span className="font-bold text-white text-sm sm:text-base flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Form Izin Pramuka
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <div className="md:col-span-2 bg-scoutKhaki-50 border border-scoutBrown-200 rounded-lg p-3 flex gap-3 items-start">
                <svg className="w-5 h-5 text-scoutBrown-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-scoutBrown-800">
                  Data Anda: <strong>{siswaData.nama}</strong> - NIS <strong>{nis}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="block mb-1.5 sm:mb-2 text-scoutBrown-900 font-bold text-sm sm:text-[0.95em]">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border-2 border-scoutBrown-200 rounded bg-scoutBrown-50 text-scoutBrown-800 text-sm sm:text-base cursor-not-allowed font-mono"
                />
              </div>

              <div className="form-group">
                <label className="block mb-1.5 sm:mb-2 text-scoutBrown-900 font-bold text-sm sm:text-[0.95em]">
                  Nomor Absen:
                </label>
                <input
                  type="text"
                  value={formData.absen}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border-2 border-scoutBrown-200 rounded bg-scoutBrown-50 text-scoutBrown-800 text-sm sm:text-base cursor-not-allowed font-mono"
                />
              </div>

              <div className="form-group">
                <label className="block mb-1.5 sm:mb-2 text-scoutBrown-900 font-bold text-sm sm:text-[0.95em]">
                  Kelas:
                </label>
                <input
                  type="text"
                  value={formData.kelas}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border-2 border-scoutBrown-200 rounded bg-scoutBrown-50 text-scoutBrown-800 text-sm sm:text-base cursor-not-allowed font-mono"
                />
              </div>

              <div className="form-group">
                <label className="block mb-1.5 sm:mb-2 text-scoutBrown-900 font-bold text-sm sm:text-[0.95em]">
                  Sangga:
                </label>
                <select
                  name="sangga"
                  value={formData.sangga}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border-2 border-scoutBrown-300 rounded bg-white text-scoutBrown-900 text-sm sm:text-base focus:outline-none focus:border-scoutBrown-600 focus:ring-1 focus:ring-scoutBrown-600 transition-all cursor-pointer shadow-sm"
                >
                  <option value="">Pilih Sangga</option>
                  <option value="Pendobrak">Pendobrak</option>
                  <option value="Penegas">Penegas</option>
                  <option value="Perintis">Perintis</option>
                  <option value="Pencoba">Pencoba</option>
                  <option value="Pelaksana">Pelaksana</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1.5 sm:mb-2 text-scoutBrown-900 font-bold text-sm sm:text-[0.95em]">
                  Alasan Tidak Mengikuti:
                </label>
                <textarea
                  name="alasan"
                  value={formData.alasan}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan alasan Anda tidak dapat mengikuti kegiatan pramuka..."
                  required
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border-2 border-scoutBrown-300 rounded bg-white text-scoutBrown-900 text-sm sm:text-base focus:outline-none focus:border-scoutBrown-600 focus:ring-1 focus:ring-scoutBrown-600 transition-all resize-vertical min-h-[100px] shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 sm:py-3.5 bg-scoutBrown-600 text-white rounded font-bold text-sm sm:text-base cursor-pointer hover:bg-scoutBrown-800 active:scale-[0.98] transition-all mt-2 sm:mt-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center justify-center transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isSubmitting ? 'Mengirim...' : 'Buat Surat'}
            </button>

            {errorMessage && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
