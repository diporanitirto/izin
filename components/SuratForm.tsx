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
      <div className="border border-scoutBrown-200 rounded-xl bg-white">
        <div className="px-5 py-4 border-b border-scoutBrown-100">
          <h2 className="font-bold text-scoutBrown-900 text-base flex items-center gap-2">
            <svg className="w-5 h-5 text-scoutBrown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Form Izin Pramuka
          </h2>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 bg-scoutKhaki-50 border border-scoutKhaki-200 rounded-lg p-3 flex gap-3 items-start">
                <svg className="w-5 h-5 text-scoutBrown-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-scoutBrown-700">
                  <strong>{siswaData.nama}</strong> — NIS <strong>{nis}</strong>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  readOnly
                  className="w-full px-4 py-2.5 border border-scoutBrown-200 rounded-lg bg-scoutKhaki-50 text-scoutBrown-800 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                  Nomor Absen
                </label>
                <input
                  type="text"
                  value={formData.absen}
                  readOnly
                  className="w-full px-4 py-2.5 border border-scoutBrown-200 rounded-lg bg-scoutKhaki-50 text-scoutBrown-800 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                  Kelas
                </label>
                <input
                  type="text"
                  value={formData.kelas}
                  readOnly
                  className="w-full px-4 py-2.5 border border-scoutBrown-200 rounded-lg bg-scoutKhaki-50 text-scoutBrown-800 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                  Sangga
                </label>
                <select
                  name="sangga"
                  value={formData.sangga}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-scoutBrown-300 rounded-lg bg-white text-scoutBrown-900 text-sm focus:outline-none focus:border-scoutBrown-500 focus:ring-2 focus:ring-scoutBrown-500/20 transition-all cursor-pointer"
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
                <label className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                  Alasan Tidak Mengikuti
                </label>
                <textarea
                  name="alasan"
                  value={formData.alasan}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan alasan Anda tidak dapat mengikuti kegiatan pramuka..."
                  required
                  className="w-full px-4 py-2.5 border border-scoutBrown-300 rounded-lg bg-white text-scoutBrown-900 text-sm focus:outline-none focus:border-scoutBrown-500 focus:ring-2 focus:ring-scoutBrown-500/20 transition-all resize-vertical min-h-[100px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 px-4 py-3 bg-scoutBrown-700 text-white rounded-lg font-semibold text-sm cursor-pointer hover:bg-scoutBrown-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isSubmitting ? 'Mengirim...' : 'Buat Surat'}
            </button>

            {errorMessage && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
