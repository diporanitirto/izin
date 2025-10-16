'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
}

interface SuratFormProps {
  onSubmit: (data: FormData) => void;
}

export default function SuratForm({ onSubmit }: SuratFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    absen: '',
    kelas: '',
    sangga: '',
    pkKelas: '',
    alasan: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="fade-in" aria-label="Form pembuatan surat">
      <div className="border border-[#BCAAA4] rounded-lg overflow-hidden bg-white">
        <div className="bg-[#efe7d3] border-b border-[#BCAAA4] px-4 py-3">
          <span className="font-bold text-mediumBrown">
            <i className="fas fa-clipboard-list mr-2" aria-hidden="true"></i>
            Form Izin Pramuka
          </span>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="form-group">
                <label htmlFor="nama" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-user text-lightBrown mr-2 w-4 inline-block text-center"></i>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="absen" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-hashtag text-lightBrown mr-2 w-4 inline-block text-center"></i>
                  Nomor Absen:
                </label>
                <input
                  type="text"
                  id="absen"
                  name="absen"
                  value={formData.absen}
                  onChange={handleChange}
                  required
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="kelas" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-school text-lightBrown mr-2 w-4 inline-block text-center"></i>
                  Kelas:
                </label>
                <select
                  id="kelas"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  required
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors cursor-pointer"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X-1">X-1</option>
                  <option value="X-2">X-2</option>
                  <option value="X-3">X-3</option>
                  <option value="X-4">X-4</option>
                  <option value="X-5">X-5</option>
                  <option value="X-6">X-6</option>
                  <option value="X-7">X-7</option>
                  <option value="X-8">X-8</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="sangga" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-users text-lightBrown mr-2 w-4 inline-block text-center"></i>
                  Sangga:
                </label>
                <select
                  id="sangga"
                  name="sangga"
                  value={formData.sangga}
                  onChange={handleChange}
                  required
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors cursor-pointer"
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
                <label htmlFor="pkKelas" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-chalkboard-teacher text-lightBrown mr-2 w-4 inline-block text-center"></i>
                  Nama Pembina Kelas (PK):
                </label>
                <input
                  type="text"
                  id="pkKelas"
                  name="pkKelas"
                  value={formData.pkKelas}
                  onChange={handleChange}
                  required
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="alasan" className="block mb-2 text-[#2c3e50] font-medium text-[0.95em]">
                  <i className="fas fa-comment-alt text-lightBrown mr-2 w-4 inline-block text-center"></i>
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
                  className="w-full px-[15px] py-3 border border-[#BCAAA4] rounded bg-white text-darkBrown focus:outline-none focus:border-mediumBrown transition-colors resize-vertical min-h-[100px]"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-3.5 bg-mediumBrown text-white rounded font-medium text-base cursor-pointer hover:bg-darkBrown active:scale-[0.98] transition-all mt-2.5"
            >
              <i className="fas fa-file-alt mr-2"></i>
              Buat Surat
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
