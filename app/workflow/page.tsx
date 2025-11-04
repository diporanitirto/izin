'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WorkflowPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const intervals = [
            { time: 100, progress: 30 },
            { time: 150, progress: 60 },
            { time: 120, progress: 90 },
            { time: 100, progress: 100 },
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

        const storedNis = sessionStorage.getItem('nis');
        
        if (!storedNis) {
            router.push('/');
        } else {
            setTimeout(() => {
                setIsChecking(false);
            }, 500);
        }
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-scoutKhaki-50 to-scoutBrown-100">
                <div className="w-full max-w-md px-6">
                    <div className="text-center mb-8 animate-scale-in">
                        <h2 className="text-xl sm:text-2xl font-bold text-scoutBrown-900 mb-2">
                            Memuat Panduan
                        </h2>
                        <p className="text-scoutBrown-600 text-sm">
                            Mohon tunggu sebentar...
                        </p>
                    </div>
                    <div className="relative">
                        <div className="w-full h-3 bg-scoutBrown-200/50 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-scoutBrown-700 via-scoutBrown-800 to-scoutBrown-900 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                                style={{ width: `${loadingProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <span className="text-sm font-bold text-scoutBrown-800">
                                {loadingProgress}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 sm:mt-4 mb-4 sm:mb-6 animate-slide-up">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-scoutKhaki-50 border border-scoutBrown-300 hover:border-scoutBrown-500 rounded-lg transition-all text-xs sm:text-sm font-semibold text-scoutBrown-800 shadow-sm hover:shadow-md"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden xs:inline">Kembali ke Beranda</span>
                    <span className="xs:hidden">Kembali</span>
                </Link>
            </div>
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-scale-in">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-scoutBrown-700 to-scoutBrown-900 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-scoutBrown-900 mb-2 sm:mb-3">Panduan Penggunaan</h2>
                            <p className="text-sm sm:text-base text-scoutBrown-700 leading-relaxed">
                                Sistem ini memudahkan kamu untuk membuat surat izin pramuka secara online. Surat izin yang dibuat akan direview oleh admin terlebih dahulu sebelum bisa digunakan. Ikuti langkah-langkah berikut dengan lengkap.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up">
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    1
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Masukkan NIS</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Saat pertama kali membuka website, kamu akan diminta memasukkan <strong>NIS (Nomor Induk Siswa)</strong>.
                            </p>
                            <div className="bg-scoutKhaki-50 border border-scoutBrown-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-semibold text-scoutBrown-900 mb-2">💡 Tips:</p>
                                <ul className="text-xs sm:text-sm text-scoutBrown-700 space-y-1 ml-4 list-disc">
                                    <li>NIS minimal 4 digit</li>
                                    <li>Pastikan NIS yang kamu masukkan benar</li>
                                    <li>Data akan terisi otomatis setelah NIS divalidasi</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    2
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Isi Form Izin</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Lengkapi formulir surat izin dengan informasi yang dibutuhkan:
                            </p>
                            <ul className="text-xs sm:text-sm text-scoutBrown-700 space-y-1.5 sm:space-y-2 ml-4 list-disc">
                                <li>Pilih PK yang bertugas</li>
                                <li>Tulis alasan izin dengan jelas dan lengkap</li>
                                <li>Pastikan semua data sudah benar sebelum submit</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    3
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Preview & Submit</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Setelah submit, kamu akan melihat preview surat izin yang telah dibuat. <strong className="text-red-700">Surat masih berstatus "Pending"</strong> dan menunggu review dari admin.
                            </p>
                            <div className="bg-scoutKhaki-50 border border-scoutBrown-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                <p className="text-xs sm:text-sm font-semibold text-scoutBrown-900 mb-2">⏳ Status Surat:</p>
                                <ul className="text-xs sm:text-sm text-scoutBrown-700 space-y-1 ml-4 list-disc">
                                    <li><strong>Pending:</strong> Menunggu review admin</li>
                                    <li><strong>Approved:</strong> Disetujui, bisa didownload</li>
                                    <li><strong>Rejected:</strong> Ditolak, harus buat ulang</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-semibold text-red-900 mb-1">⚠️ Penting:</p>
                                <p className="text-xs sm:text-sm text-red-700">
                                    Tombol download akan <strong>muncul setelah surat di-ACC</strong> oleh admin.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    4
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Tunggu ACC dari Admin</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Admin akan mereview surat izin kamu. Pastikan alasan izin yang ditulis sudah jelas dan valid.
                            </p>
                            <div className="bg-scoutKhaki-50 border border-scoutBrown-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-semibold text-scoutBrown-900 mb-2">✅ Jika di-ACC:</p>
                                <ul className="text-xs sm:text-sm text-scoutBrown-700 space-y-1 ml-4 list-disc mb-3">
                                    <li>Status berubah menjadi "Approved"</li>
                                    <li>Tombol download akan muncul</li>
                                    <li>Surat siap untuk didownload dan diprint</li>
                                </ul>
                                <p className="text-xs sm:text-sm font-semibold text-red-900 mb-2">❌ Jika di-Reject:</p>
                                <ul className="text-xs sm:text-sm text-red-700 space-y-1 ml-4 list-disc">
                                    <li>Surat ditolak dan tidak bisa digunakan</li>
                                    <li>Buat surat izin baru dengan alasan yang lebih valid</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    5
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Download & Print Surat</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Setelah surat di-ACC, klik tombol <strong>"Download Surat Izin"</strong> dan print surat tersebut.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">🖨️ Tips Print:</p>
                                <ul className="text-xs sm:text-sm text-blue-700 space-y-1 ml-4 list-disc">
                                    <li>Print dalam format A4</li>
                                    <li>Pastikan hasil print jelas dan tidak blur</li>
                                    <li>Bawa surat yang sudah diprint</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    6
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Minta Tanda Tangan</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Surat izin harus ditandatangani oleh <strong>3 pihak</strong> secara berurutan:
                            </p>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gradient-to-r from-scoutKhaki-50 to-white border border-scoutBrown-200 rounded-lg">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-scoutBrown-700 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                                        1
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-scoutBrown-900 text-sm sm:text-base">PK</p>
                                        <p className="text-xs sm:text-sm text-scoutBrown-600">Minta tanda tangan ke PK kamu</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gradient-to-r from-scoutKhaki-50 to-white border border-scoutBrown-200 rounded-lg">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-scoutBrown-700 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                                        2
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-scoutBrown-900 text-sm sm:text-base">JUDAT</p>
                                        <p className="text-xs sm:text-sm text-scoutBrown-600">Setelah PK, minta tanda tangan JUDAT</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gradient-to-r from-scoutKhaki-50 to-white border border-scoutBrown-200 rounded-lg">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-scoutBrown-700 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                                        3
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-scoutBrown-900 text-sm sm:text-base">MABIGUS</p>
                                        <p className="text-xs sm:text-sm text-scoutBrown-600">Terakhir, minta tanda tangan MABIGUS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <div className="bg-gradient-to-r from-green-700 to-green-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    7
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Serahkan ke Penjaga Gerbang</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Setelah semua tanda tangan lengkap, <strong>serahkan surat izin ke penjaga gerbang</strong> saat kamu akan izin keluar.
                            </p>
                            <div className="bg-green-50 border border-green-300 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm font-semibold text-green-900 mb-2">✅ Checklist Akhir:</p>
                                <ul className="text-xs sm:text-sm text-green-800 space-y-1 ml-4 list-disc">
                                    <li>Surat sudah di-ACC admin (status Approved)</li>
                                    <li>Sudah didownload dan diprint</li>
                                    <li>Ada tanda tangan PK, JUDAT, dan MABIGUS</li>
                                    <li>Surat dalam kondisi baik dan lengkap</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-scoutBrown-200/50 overflow-hidden animate-slide-up" style={{ animationDelay: '0.7s' }}>
                        <div className="bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                    8
                                </div>
                                <h3 className="text-base sm:text-lg font-bold">Cek Riwayat Izin</h3>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-scoutBrown-700 mb-3 sm:mb-4">
                                Kamu bisa melihat semua riwayat izin yang pernah dibuat dengan klik tombol <strong>"Lihat Riwayat Izin"</strong>.
                            </p>
                            <ul className="text-xs sm:text-sm text-scoutBrown-700 space-y-1.5 sm:space-y-2 ml-4 list-disc">
                                <li>Lihat semua izin yang pernah dibuat</li>
                                <li>Cek status verifikasi (Pending/Approved/Rejected)</li>
                                <li>Akses kembali surat izin lama</li>
                            </ul>
                        </div>
                    </div>
                </div>

                                <div className="bg-gradient-to-br from-scoutBrown-50 to-scoutKhaki-50 border border-scoutBrown-300 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8 animate-scale-in">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-scoutBrown-700" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-scoutBrown-900 mb-1.5 sm:mb-2">Butuh Bantuan?</h3>
                            <p className="text-scoutBrown-700 text-xs sm:text-sm">
                                Jika ada kendala atau pertanyaan, hubungi PK XII atau admin Pramuka Diporani.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
