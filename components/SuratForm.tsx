'use client';

import { useState, FormEvent, useEffect } from 'react';

interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
  nis?: string;
}

interface SuratFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: FormData;
  nis: string;
  siswaData: {
    nama: string;
    kelas: string;
    absen: string;
  };
}

export default function SuratForm({ onSubmit, initialData, nis, siswaData }: SuratFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: siswaData.nama,
    absen: siswaData.absen,
    kelas: siswaData.kelas,
    sangga: initialData?.sangga || '',
    pkKelas: initialData?.pkKelas || '',
    alasan: initialData?.alasan || '',
    nis,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pkOptions, setPkOptions] = useState<string[]>([]);
  const [isLoadingPk, setIsLoadingPk] = useState(true);

  // Update form data when siswaData or nis changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nama: siswaData.nama,
      absen: siswaData.absen,
      kelas: siswaData.kelas,
      nis,
    }));
  }, [siswaData.nama, siswaData.absen, siswaData.kelas, nis]);

  useEffect(() => {
    let isMounted = true;

    const loadPkOptions = async () => {
      try {
        const res = await fetch('/pk.json');
        if (!res.ok) {
          throw new Error(`Gagal memuat daftar PK (status ${res.status})`);
        }
        const data: string[] = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Format pk.json tidak valid');
        }
        if (isMounted) {
          setPkOptions(data);
          // ensure initial PK value is part of options for controlled select
          if (formData.pkKelas && !data.includes(formData.pkKelas)) {
            setPkOptions((prev) => [formData.pkKelas, ...prev]);
          }
        }
      } catch (error) {
        console.error('Tidak dapat memuat pk.json:', error);
        if (isMounted) {
          setPkOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPk(false);
        }
      }
    };

    loadPkOptions();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Normalize kelas format untuk API (X-1 → X1)
      const normalizedData = {
        ...formData,
        kelas: formData.kelas.replace(/-/g, ''),  // Replace all dashes
        nis
      };
      
      console.log('🔍 Form Submit Debug:', {
        originalKelas: formData.kelas,
        normalizedKelas: normalizedData.kelas,
        fullData: normalizedData
      });
      
      await onSubmit(normalizedData);
    } catch (error) {
      console.error('Gagal mengirim data ke Telegram:', error);
      setErrorMessage('Terjadi kendala saat mengirim data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'absen') {
      // Allow only digits for absen field
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: numericValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section className="fade-in" aria-label="Form pembuatan surat">
      <div className="border border-[#BCAAA4] rounded-lg overflow-hidden bg-white">
        <div className="bg-[#efe7d3] border-b border-[#BCAAA4] px-3 sm:px-4 py-2 sm:py-3">
          <span className="font-bold text-mediumBrown text-sm sm:text-base">
            <i className="fas fa-clipboard-list mr-1.5 sm:mr-2 text-xs sm:text-sm" aria-hidden="true"></i>
            Form Izin Pramuka
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {/* Info NIS */}
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  Data Anda: <strong>{siswaData.nama}</strong> - NIS <strong>{nis}</strong>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="nama" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-user text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-gray-50 text-darkBrown text-sm sm:text-base cursor-not-allowed"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="absen" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-hashtag text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Nomor Absen:
                </label>
                <input
                  type="text"
                  id="absen"
                  name="absen"
                  value={formData.absen}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-gray-50 text-darkBrown text-sm sm:text-base cursor-not-allowed"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="kelas" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-school text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Kelas:
                </label>
                <input
                  type="text"
                  id="kelas"
                  name="kelas"
                  value={formData.kelas}
                  readOnly
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-gray-50 text-darkBrown text-sm sm:text-base cursor-not-allowed"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sangga" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-users text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Sangga:
                </label>
                <select
                  id="sangga"
                  name="sangga"
                  value={formData.sangga}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown text-sm sm:text-base focus:outline-none focus:border-mediumBrown transition-colors cursor-pointer"
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
                <label htmlFor="pkKelas" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-chalkboard-teacher text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Nama Pembina Kelas (PK):
                </label>
                <select
                  id="pkKelas"
                  name="pkKelas"
                  value={formData.pkKelas}
                  onChange={handleChange}
                  required
                  disabled={isLoadingPk}
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown text-sm sm:text-base focus:outline-none focus:border-mediumBrown transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">{isLoadingPk ? 'Memuat daftar PK...' : 'Pilih Pembina Kelas'}</option>
                  {pkOptions.map((pk) => (
                    <option key={pk} value={pk}>
                      {pk}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="alasan" className="block mb-1.5 sm:mb-2 text-[#2c3e50] font-medium text-sm sm:text-[0.95em]">
                  <i className="fas fa-comment-alt text-lightBrown mr-1.5 sm:mr-2 w-3 sm:w-4 inline-block text-center text-xs sm:text-sm"></i>
                  Alasan Tidak Mengikuti:
                </label>
                <textarea
                  id="alasan"
                  name="alasan"
                  value={formData.alasan}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan alasan Anda tidak dapat mengikuti kegiatan pramuka..."
                  required
                  className="w-full px-3 sm:px-[15px] py-2.5 sm:py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown text-sm sm:text-base focus:outline-none focus:border-mediumBrown transition-colors resize-vertical min-h-[100px]"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 sm:py-3.5 bg-mediumBrown text-white rounded font-medium text-sm sm:text-base cursor-pointer hover:bg-darkBrown active:scale-[0.98] transition-all mt-2 sm:mt-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i className="fas fa-file-alt mr-1.5 sm:mr-2 text-xs sm:text-sm"></i>
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
