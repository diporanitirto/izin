'use client';

import { useState, FormEvent } from 'react';
import type { FormData } from '@/lib/types';

interface SuratFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
  nis: string;
  siswaData: {
    nama: string;
    jk: string;
    kelas: string;
    absen: string;
    pkList: string[];
  };
}

const SANGGA_PUTRA = ['Pendobrak', 'Penegas'];
const SANGGA_PUTRI = ['Perintis', 'Pencoba', 'Pelaksana'];

export default function SuratForm({ onSubmit, initialData, nis, siswaData }: SuratFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: siswaData.nama,
    absen: siswaData.absen,
    kelas: siswaData.kelas,
    sangga: initialData?.sangga || '',
    alasan: initialData?.alasan || '',
    nis,
    pk: initialData?.pk || '',
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

  const sanggaOptions =
    siswaData.jk === 'L' ? SANGGA_PUTRA : siswaData.jk === 'P' ? SANGGA_PUTRI : [...SANGGA_PUTRA, ...SANGGA_PUTRI];

  const identitas: Array<{ label: string; value: string; wide?: boolean }> = [
    { label: 'Nama', value: formData.nama, wide: true },
    { label: 'NIS', value: nis },
    { label: 'Kelas', value: formData.kelas },
    { label: 'Nomor Absen', value: formData.absen },
  ];

  return (
    <section className="fade-in" aria-label="Form pembuatan surat">
      <div className="border border-scoutBrown-200 rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-scoutBrown-100 bg-scoutKhaki-50">
          <h2 className="font-bold text-scoutBrown-900 text-base flex items-center gap-2">
            <svg className="w-5 h-5 text-scoutBrown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Form Izin Pramuka
          </h2>
          <p className="text-xs text-scoutBrown-500 mt-1">
            Data diri terisi otomatis — tinggal pilih sangga dan tulis alasan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-scoutKhaki-200 bg-scoutKhaki-50 p-4">
            {identitas.map(({ label, value, wide }) => (
              <div key={label} className={wide ? 'col-span-2' : ''}>
                <dt className="text-xs text-scoutBrown-500">{label}</dt>
                <dd className="text-sm font-semibold text-scoutBrown-900 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>

          {siswaData.pkList.length > 0 && (
            <div>
              <label htmlFor="pk" className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
                Pembina Kelas
              </label>
              <select
                id="pk"
                name="pk"
                value={formData.pk}
                onChange={(e) => setFormData((prev) => ({ ...prev, pk: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-scoutBrown-300 rounded-lg bg-white text-scoutBrown-900 text-sm focus:outline-none focus:border-scoutBrown-500 focus:ring-2 focus:ring-scoutBrown-500/20 transition-all cursor-pointer"
              >
                <option value="">Pilih Pembina Kelas</option>
                {siswaData.pkList.map((nama) => (
                  <option key={nama} value={nama}>{nama}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="sangga" className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
              Sangga
            </label>
            <select
              id="sangga"
              name="sangga"
              value={formData.sangga}
              onChange={(e) => setFormData((prev) => ({ ...prev, sangga: e.target.value }))}
              required
              className="w-full px-4 py-2.5 border border-scoutBrown-300 rounded-lg bg-white text-scoutBrown-900 text-sm focus:outline-none focus:border-scoutBrown-500 focus:ring-2 focus:ring-scoutBrown-500/20 transition-all cursor-pointer"
            >
              <option value="">Pilih Sangga</option>
              {sanggaOptions.map((sangga) => (
                <option key={sangga} value={sangga}>{sangga}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="alasan" className="block mb-1.5 text-scoutBrown-700 font-semibold text-sm">
              Alasan Tidak Mengikuti
            </label>
            <textarea
              id="alasan"
              name="alasan"
              value={formData.alasan}
              onChange={(e) => setFormData((prev) => ({ ...prev, alasan: e.target.value }))}
              rows={5}
              placeholder="Jelaskan alasan Anda tidak dapat mengikuti kegiatan pramuka..."
              required
              className="w-full px-4 py-2.5 border border-scoutBrown-300 rounded-lg bg-white text-scoutBrown-900 text-sm focus:outline-none focus:border-scoutBrown-500 focus:ring-2 focus:ring-scoutBrown-500/20 transition-all resize-vertical min-h-[120px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-scoutBrown-700 text-white rounded-lg font-semibold text-sm cursor-pointer hover:bg-scoutBrown-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isSubmitting ? 'Mengirim...' : 'Buat Surat'}
          </button>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
