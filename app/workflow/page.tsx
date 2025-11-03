'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkflowPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check if user has NIS in session
        const storedNis = sessionStorage.getItem('nis');
        
        if (!storedNis) {
            // No NIS found, redirect to home
            router.push('/');
        } else {
            // Has NIS, allow access to workflow page
            setIsChecking(false);
        }
    }, [router]);

    // Show loading while checking
    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white py-6 px-4 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 mb-4 border border-white/20 hover:border-white/40">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        📋 Cara Membuat Surat Izin
                    </h1>
                    <p className="text-amber-100 text-sm sm:text-base">
                        Panduan lengkap penggunaan sistem izin pramuka DIPORANI
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

                {/* Intro Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-l-4 border-amber-500">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-info-circle text-amber-600 text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Selamat Datang!</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Sistem ini memudahkan kamu untuk membuat surat izin pramuka secara online.
                                Ikuti langkah-langkah di bawah ini dengan mudah dan cepat.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">

                    {/* Step 1 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    1
                                </div>
                                <h3 className="text-xl font-bold">Buka Website & Masukkan NIS</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-id-card text-blue-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Saat pertama kali membuka website, kamu akan diminta memasukkan <strong>NIS (Nomor Induk Siswa)</strong>.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800 font-medium mb-2">💡 Tips:</p>
                                        <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                                            <li>NIS minimal 4 digit</li>
                                            <li>Pastikan NIS yang kamu masukkan benar</li>
                                            <li>NIS akan digunakan untuk mengisi data otomatis</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    2
                                </div>
                                <h3 className="text-xl font-bold">Data Otomatis Terisi</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Setelah NIS tervalidasi, sistem akan otomatis mengisi data kamu:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                                            <p className="font-semibold text-gray-800">✅ Terisi otomatis</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Nomor Absen</p>
                                            <p className="font-semibold text-gray-800">✅ Terisi otomatis</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Kelas</p>
                                            <p className="font-semibold text-gray-800">✅ Terisi otomatis</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Sangga</p>
                                            <p className="font-semibold text-gray-800">✅ Terisi otomatis</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-700">
                                            <i className="fas fa-info-circle mr-2"></i>
                                            Data ini <strong>tidak bisa diubah</strong> karena diambil langsung dari database sekolah
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    3
                                </div>
                                <h3 className="text-xl font-bold">Isi Form Izin</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-edit text-purple-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Sekarang tinggal isi beberapa informasi yang dibutuhkan:
                                    </p>

                                    <div className="space-y-3">
                                        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                                            <h4 className="font-semibold text-purple-900 mb-2">
                                                <i className="fas fa-users mr-2"></i>Sangga
                                            </h4>
                                            <p className="text-sm text-purple-800">
                                                Sudah terisi otomatis, tapi bisa kamu ubah jika ada kesalahan data.
                                                Pilih dari dropdown: Pendobrak, Penegas, Perintis, Pencoba, atau Pelaksana.
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                                            <h4 className="font-semibold text-purple-900 mb-2">
                                                <i className="fas fa-chalkboard-teacher mr-2"></i>Pembina Kelas (PK)
                                            </h4>
                                            <p className="text-sm text-purple-800">
                                                Pilih nama Pembina Kelas kamu dari dropdown yang tersedia.
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                                            <h4 className="font-semibold text-purple-900 mb-2">
                                                <i className="fas fa-comment-dots mr-2"></i>Alasan Izin
                                            </h4>
                                            <p className="text-sm text-purple-800">
                                                Tulis alasan izin kamu dengan jelas (minimal 10 karakter).
                                                Contoh: "Sakit demam dan perlu istirahat di rumah"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    4
                                </div>
                                <h3 className="text-xl font-bold">Submit & Lihat Preview</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-paper-plane text-orange-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Setelah semua terisi, klik tombol <strong>"Submit"</strong>.
                                        Kamu akan langsung melihat preview surat izin lengkap dengan QR Code.
                                    </p>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <p className="text-sm text-orange-800 font-medium mb-2">📌 Yang muncul di preview:</p>
                                        <ul className="text-sm text-orange-700 space-y-1 ml-4 list-disc">
                                            <li>Surat izin dengan semua data kamu</li>
                                            <li>QR Code untuk verifikasi online</li>
                                            <li>Status: <strong>Menunggu Verifikasi</strong></li>
                                            <li>Tombol download <strong>(belum aktif)</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    5
                                </div>
                                <h3 className="text-xl font-bold">Tunggu Approval Admin</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-clock text-amber-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Izin kamu akan diverifikasi oleh admin.
                                        Kamu bisa cek status izin kapan saja dengan klik <strong>"Cek Izin Saya"</strong>.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-300">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-clock text-yellow-800 text-sm"></i>
                                                </div>
                                                <span className="font-semibold text-yellow-800">PENDING</span>
                                            </div>
                                            <p className="text-xs text-yellow-700">Menunggu verifikasi admin</p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-3 border-2 border-green-300">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-check text-green-800 text-sm"></i>
                                                </div>
                                                <span className="font-semibold text-green-800">APPROVED</span>
                                            </div>
                                            <p className="text-xs text-green-700">Izin disetujui, bisa download!</p>
                                        </div>

                                        <div className="bg-red-50 rounded-lg p-3 border-2 border-red-300">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-times text-red-800 text-sm"></i>
                                                </div>
                                                <span className="font-semibold text-red-800">REJECTED</span>
                                            </div>
                                            <p className="text-xs text-red-700">Izin ditolak, izinmu tidak valid.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    6
                                </div>
                                <h3 className="text-xl font-bold">Download Surat PDF</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-file-pdf text-teal-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Setelah status berubah menjadi <strong className="text-green-600">APPROVED</strong>,
                                        tombol download akan aktif. Kamu bisa download surat dalam format PDF yang sudah lengkap dengan QR Code.
                                    </p>
                                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-3">
                                        <p className="text-sm text-teal-800 font-medium mb-2">📄 Kegunaan Surat PDF:</p>
                                        <ul className="text-sm text-teal-700 space-y-2 ml-4 list-disc">
                                            <li><strong>Cetak surat PDF</strong> yang sudah kamu download</li>
                                            <li><strong>Minta tanda tangan</strong> dari Pembina Kelas (PK) kamu</li>
                                            <li><strong>Minta tanda tangan</strong> dari Judat</li>
                                            <li><strong>Minta tanda tangan</strong> dari Mabigus</li>
                                            <li>Surat yang sudah ditandatangani dapat <strong>diserahkan ke penjaga gerbang dan ditaruh di kelas</strong></li>
                                            <li>QR Code di surat dapat discan untuk <strong>verifikasi keaslian</strong> oleh penjaga gerbang</li>
                                        </ul>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                                        <p className="text-xs text-amber-800">
                                            <i className="fas fa-exclamation-triangle mr-2"></i>
                                            <strong>Penting:</strong> Surat yang sudah didownload harus dicetak dan ditandatangani oleh PK, Judat, dan Mabigus sebelum diserahkan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 7 */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 border-amber-300">
                        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                                    7
                                </div>
                                <h3 className="text-xl font-bold">Cetak & Minta Tanda Tangan</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-signature text-amber-600 text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Setelah download PDF, <strong>cetak surat</strong> tersebut dan minta tanda tangan dari 3 pihak berikut secara berurutan:
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    1
                                                </div>
                                                <h4 className="font-semibold text-blue-900">
                                                    <i className="fas fa-chalkboard-teacher mr-2"></i>Pembina Kelas (PK)
                                                </h4>
                                            </div>
                                            <p className="text-sm text-blue-800 ml-11">
                                                Minta tanda tangan PK kamu terlebih dahulu sebagai verifikasi awal
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    2
                                                </div>
                                                <h4 className="font-semibold text-purple-900">
                                                    <i className="fas fa-user-tie mr-2"></i>Judat
                                                </h4>
                                            </div>
                                            <p className="text-sm text-purple-800 ml-11">
                                                Setelah ditandatangani PK, minta tanda tangan Judat
                                            </p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    3
                                                </div>
                                                <h4 className="font-semibold text-green-900">
                                                    <i className="fas fa-user-shield mr-2"></i>Mabigus
                                                </h4>
                                            </div>
                                            <p className="text-sm text-green-800 ml-11">
                                                Terakhir, minta tanda tangan Mabigus untuk pengesahan final
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-4">
                                        <p className="text-sm text-amber-900 font-semibold mb-2">
                                            <i className="fas fa-star mr-2"></i>Setelah semua tanda tangan terkumpul:
                                        </p>
                                        <p className="text-sm text-amber-800">
                                            Surat sudah <strong>resmi dan valid</strong> untuk diserahkan ke penjaga gerbang dan ditaruh di kelas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-lightbulb text-blue-600 text-xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Tips Penting</h3>
                            <ul className="space-y-2 text-blue-800">
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
                                    <span>Pastikan NIS yang kamu masukkan sudah benar sejak awal</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
                                    <span>Tulis alasan izin dengan jelas dan sopan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
                                    <span>Cek status izin secara berkala di menu "Cek Izin Saya"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
                                    <span>Data NIS tersimpan di browser, jadi kamu tidak perlu input ulang setiap kali buka website</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
                                    <span>Jika ingin ganti NIS, klik tombol "Ganti NIS" di info bar</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <i className="fas fa-rocket"></i>
                        <span>Mulai Buat Surat Izin</span>
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                    <p className="text-gray-500 text-sm mt-4">
                        Butuh bantuan? Hubungi admin DIPORANI
                    </p>
                </div>

            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white py-6 px-4 mt-12">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 Dewan Ambalan DIPORANI · Gudep 3089/3090 · SMA Negeri 1 Kasihan
                    </p>
                </div>
            </div>
        </div>
    );
}
