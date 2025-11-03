'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import QRCode from 'qrcode';
import Loading from './Loading';

interface FormData {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
}

interface PreviewSectionProps {
  formData: FormData;
  onBack: () => void;
  izinId?: string | null;  // Optional: ID dari database untuk generate QR
}

export default function PreviewSection({ formData, onBack, izinId: propIzinId }: PreviewSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [izinId, setIzinId] = useState<string | null>(propIzinId || null);
  const [izinStatus, setIzinStatus] = useState<string>('pending');
  const [verifiedBy, setVerifiedBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // regenerate preview when form data changes
    generatePreview();
    // Only fetch status if izinId not provided (meaning it's a new submission)
    if (!propIzinId) {
      fetchIzinStatus();
    }
  }, [formData, propIzinId]);

  useEffect(() => {
    // If izinId provided from props, fetch that specific izin's status
    if (propIzinId) {
      fetchIzinById(propIzinId);
    }
  }, [propIzinId]);

  const fetchIzinById = async (id: string) => {
    try {
      setLoading(true);
      // Fetch langsung by ID
      const response = await fetch(`/api/izin/${id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setIzinStatus(result.data.status || 'pending');
        setVerifiedBy(result.data.verified_by || null);
      }
    } catch (error) {
      console.error('Error fetching izin by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIzinStatus = async () => {
    try {
      setLoading(true);
      // Cari izin berdasarkan absen (yang merupakan NIS)
      const response = await fetch(`/api/izin?nis=${formData.absen}`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        // Ambil izin terbaru yang sesuai dengan data form
        const latestIzin = result.data.find((item: any) => 
          item.nama === formData.nama && 
          item.kelas === formData.kelas
        );
        
        if (latestIzin) {
          setIzinId(latestIzin.id);
          setIzinStatus(latestIzin.status || 'pending');
          setVerifiedBy(latestIzin.verified_by || null);
        }
      }
    } catch (error) {
      console.error('Error fetching izin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Try to load logo image from public assets; if it fails, continue with text-only watermark
    let logoImg: HTMLImageElement | null = null;
    try {
      const img = new (window as any).Image() as HTMLImageElement;
      // set crossOrigin to allow drawing into canvas without tainting in most dev setups
      img.crossOrigin = 'anonymous';
      img.src = '/assets/logo-diporani.png';
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = (e) => reject(e);
      });
      logoImg = img;
    } catch (e) {
      // image failed to load; keep logoImg as null and proceed
      logoImg = null;
    }

  const baseWidth = 794;
  const baseHeight = 1123;
  const scale = 2000 / baseWidth; // ~200 DPI keeps readability while reducing file size
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px Times New Roman';
    ctx.fillStyle = '#7b5b46';
    
    const wmSpacingX = 280;
    const wmSpacingY = 200;
    const startX = -100;
    const startY = 100;
    
    for (let y = startY; y < baseHeight + 100; y += wmSpacingY) {
      for (let x = startX; x < baseWidth + 100; x += wmSpacingX) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 8);
        const rowIndex = Math.floor((y - startY) / wmSpacingY);
        const colIndex = Math.floor((x - startX) / wmSpacingX);
        const shouldDrawLogo = Boolean(logoImg) && ((rowIndex + colIndex) % 2 === 1);

        if (shouldDrawLogo && logoImg) {
          try {
            ctx.save();
            ctx.globalAlpha = 0.08;
            const logoSize = 80;
            ctx.drawImage(logoImg, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
            ctx.restore();
          } catch (e) {
            ctx.fillText('DIPORANI', 0, 0);
          }
        } else {
          ctx.fillText('DIPORANI', 0, 0);
        }

        ctx.restore();
      }
    }
    
    ctx.restore();

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = '16px Times New Roman';

    let y = 80;
    const leftMargin = 100;
    const rightMargin = 100;
    const lineHeight = 26;

    const today = new Date();
    const location = 'Kasihan';
    const dateStr = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.textAlign = 'right';
    ctx.fillText(`${location}, ${dateStr}`, baseWidth - rightMargin, y);
    ctx.textAlign = 'left';
    y += lineHeight * 1.2;
    
    ctx.fillText('Perihal', leftMargin, y);
    ctx.fillText(': Permohonan ijin tidak mengikuti kegiatan pramuka', leftMargin + 80, y);
    y += lineHeight * 1.8;

    ctx.fillText('Kepada Yth.', leftMargin, y); y += lineHeight;
    ctx.fillText('Kakak Dewan Ambalan', leftMargin, y); y += lineHeight;
    ctx.fillText('SMA Negeri 1 Kasihan', leftMargin, y); y += lineHeight;
    ctx.fillText('Di tempat', leftMargin, y); y += lineHeight * 1.8;

    ctx.fillText('Dengan Hormat,', leftMargin, y); y += lineHeight * 1.4;
    ctx.fillText('Saya yang bertanda tangan di bawah ini:', leftMargin, y); y += lineHeight * 1.4;

    const indent = leftMargin + 40;
    const labelWidth = 150;
    const dataIndent = indent + 20;
    ctx.fillText('Nama', dataIndent, y);
    ctx.fillText(':', dataIndent + labelWidth, y);
    ctx.fillText(formData.nama, dataIndent + labelWidth + 20, y);
    y += lineHeight;

    ctx.fillText('Nomor Absen', dataIndent, y);
    ctx.fillText(':', dataIndent + labelWidth, y);
    ctx.fillText(formData.absen, dataIndent + labelWidth + 20, y);
    y += lineHeight;

    ctx.fillText('Kelas', dataIndent, y);
    ctx.fillText(':', dataIndent + labelWidth, y);
    ctx.fillText(formData.kelas, dataIndent + labelWidth + 20, y);
    y += lineHeight;

    ctx.fillText('Sangga', dataIndent, y);
    ctx.fillText(':', dataIndent + labelWidth, y);
    ctx.fillText(formData.sangga, dataIndent + labelWidth + 20, y);
    y += lineHeight;

    ctx.fillText('Pembina Kelas', dataIndent, y);
    ctx.fillText(':', dataIndent + labelWidth, y);
    ctx.fillText(formData.pkKelas, dataIndent + labelWidth + 20, y);
    y += lineHeight * 1.4;

    const drawJustifiedText = (text: string, x: number, yPos: number, maxW: number, isLastLine: boolean = false) => {
      const words = text.trim().split(' ');
      if (words.length === 1 || isLastLine) {
        ctx.fillText(text, x, yPos);
        return;
      }
      
      const totalTextWidth = ctx.measureText(words.join('')).width;
      const totalSpaces = words.length - 1;
      const spaceWidth = (maxW - totalTextWidth) / totalSpaces;
      
      let currentX = x;
      words.forEach((word, index) => {
        ctx.fillText(word, currentX, yPos);
        currentX += ctx.measureText(word).width + spaceWidth;
      });
    };

    const maxWidth = baseWidth - leftMargin - rightMargin;
    const reasonIntro = 'Dengan ini saya ingin memberitahukan bahwa saya tidak dapat mengikuti kegiatan pramuka dengan alasan sebagai berikut:';
    let words = reasonIntro.split(' ');
    let line = '';
    let lines: string[] = [];
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const m = ctx.measureText(testLine);
      if (m.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== '') {
      lines.push(line.trim());
    }
    
    lines.forEach((l, index) => {
      const isLast = index === lines.length - 1;
      drawJustifiedText(l, leftMargin, y, maxWidth, isLast);
      y += lineHeight;
    });
    y += lineHeight * 0.2;

    words = formData.alasan.split(' ');
    line = '';
    lines = [];
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const m = ctx.measureText(testLine);
      if (m.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== '') {
      lines.push(line.trim());
    }
    
    lines.forEach((l, index) => {
      const isLast = index === lines.length - 1;
      drawJustifiedText(l, leftMargin, y, maxWidth, isLast);
      y += lineHeight;
    });
    y += lineHeight * 0.6;

    const closing = 'Demikian surat ijin saya sampaikan dengan sebenar-benarnya. Atas perhatiannya saya ucapkan terima kasih.';
    words = closing.split(' ');
    line = '';
    lines = [];
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const m = ctx.measureText(testLine);
      if (m.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== '') {
      lines.push(line.trim());
    }
    
    lines.forEach((l, index) => {
      const isLast = index === lines.length - 1;
      drawJustifiedText(l, leftMargin, y, maxWidth, isLast);
      y += lineHeight;
    });
    y += lineHeight * 1.2;

    const signatureStartY = y;
    const hormatSayaX = baseWidth - rightMargin - 80;
    ctx.textAlign = 'center';
    ctx.fillText('Hormat Saya,', hormatSayaX, signatureStartY);
    let lineY = signatureStartY + lineHeight * 3.5;
    ctx.fillText('( ' + formData.nama + ' )', hormatSayaX, lineY);

    y = signatureStartY + lineHeight * 6;
    
    // Baris atas: PK (kiri) dan Judat (kanan)
    const topRowSpacing = (baseWidth - leftMargin - rightMargin) / 2;
    const pkX = leftMargin + topRowSpacing * 0.5;
    const judatX = leftMargin + topRowSpacing * 1.5;

    ctx.textAlign = 'center';
    ctx.fillText('Mengetahui,', pkX, y);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Pembina Kelas', pkX, y + lineHeight);
    ctx.font = '16px Times New Roman';
    ctx.fillText('( ' + formData.pkKelas + ' )', pkX, y + lineHeight * 4);

    ctx.fillText('Mengetahui,', judatX, y);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Judat', judatX, y + lineHeight);
    ctx.font = '16px Times New Roman';
    ctx.fillText('( ____________________ )', judatX, y + lineHeight * 4);

    // Baris bawah: Mabigus (tengah)
    const mabigusY = y + lineHeight * 6;
    const mabigusX = (baseWidth - leftMargin - rightMargin) / 2 + leftMargin;

    ctx.fillText('Mengetahui,', mabigusX, mabigusY);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Mabigus', mabigusX, mabigusY + lineHeight);
    ctx.font = '16px Times New Roman';
    ctx.fillText('( ____________________ )', mabigusX, mabigusY + lineHeight * 4);

    // Tambahkan QR Code di pojok kanan atas jika izinId tersedia
    if (izinId) {
      try {
        const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/verify/${izinId}`;
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
          width: 120,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        const qrImage = new (window as any).Image() as HTMLImageElement;
        qrImage.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImage.onload = resolve;
        });
        
        // Posisi QR di pojok kanan, diturunkan sedikit
        const qrSize = 100;
        const qrX = baseWidth - rightMargin - qrSize - 10;
        const qrY = 150; // Diturunkan dari 60 ke 150
        
        // Background putih untuk QR
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
        
        // Draw QR code
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        
        // Label di bawah QR
        ctx.fillStyle = '#000000';
        ctx.font = '10px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText('Scan untuk verifikasi', qrX + qrSize / 2, qrY + qrSize + 15);
        ctx.textAlign = 'left';
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }

    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
  };

  const downloadSurat = async () => {
    if (izinStatus !== 'approved') {
      alert('⚠️ Surat izin belum diverifikasi oleh Judat.\n\nAnda dapat melihat preview surat, tetapi download hanya tersedia setelah izin disetujui.\n\nMohon tunggu persetujuan terlebih dahulu atau hubungi Judat untuk informasi lebih lanjut.');
      return;
    }

    await generatePreview();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = 210;
    const pdfHeight = 297;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const filename = `Surat_Ijin_Pramuka_${formData.nama.replace(/\s/g, '_')}_${formData.kelas}.pdf`;
    pdf.save(filename);
  };

  return (
    <section className="fade-in" aria-label="Preview surat">
      <div className="border border-[#BCAAA4] rounded-lg overflow-hidden bg-white">
        <div className="bg-[#efe7d3] border-b border-[#BCAAA4] px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <span className="font-bold text-mediumBrown text-sm sm:text-base">
            <i className="fas fa-eye mr-1.5 sm:mr-2 text-xs sm:text-sm" aria-hidden="true"></i>
            Preview Surat
          </span>
          <button
            onClick={onBack}
            className="px-3 py-2 bg-[#5D4037] text-white rounded text-sm cursor-pointer hover:bg-[#4E342E] transition-all flex items-center gap-2 font-semibold"
            title="Kembali"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Kembali</span>
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="bg-[#f8f9fa] p-2 sm:p-5 rounded text-center mb-3 sm:mb-4">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview Surat"
                width={794}
                height={1123}
                className="max-w-full h-auto border border-[#ddd] rounded shadow-sm"
                unoptimized
              />
            )}
          </div>
          
          {/* Status Verifikasi */}
          {loading ? (
            <Loading />
          ) : (
            <div className={`mb-4 p-4 rounded-lg ${
              izinStatus === 'approved' 
                ? 'bg-green-50 border border-green-200' 
                : izinStatus === 'rejected'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                <i className={`fas ${
                  izinStatus === 'approved' 
                    ? 'fa-check-circle text-green-600' 
                    : izinStatus === 'rejected'
                    ? 'fa-times-circle text-red-600'
                    : 'fa-clock text-yellow-600'
                } text-2xl`}></i>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${
                    izinStatus === 'approved' 
                      ? 'text-green-800' 
                      : izinStatus === 'rejected'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {izinStatus === 'approved' 
                      ? '✓ Izin Terverifikasi' 
                      : izinStatus === 'rejected'
                      ? '✗ Izin Ditolak'
                      : '⏳ Menunggu Verifikasi'}
                  </h3>
                  <p className={`text-sm ${
                    izinStatus === 'approved' 
                      ? 'text-green-700' 
                      : izinStatus === 'rejected'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {izinStatus === 'approved' 
                      ? `Izin Anda telah disetujui oleh${verifiedBy ? `: ${verifiedBy}` : ''}. Silakan download surat PDF.`
                      : izinStatus === 'rejected'
                      ? 'Izin Anda ditolak. Silakan hubungi Judat untuk informasi lebih lanjut.'
                      : 'Izin Anda sedang menunggu persetujuan dari Judat. Anda dapat download surat setelah diverifikasi.'}
                  </p>
                  {izinStatus === 'pending' && (
                    <p className="text-xs text-yellow-600 mt-2">
                      💡 Tips: Cek status izin secara berkala menggunakan tombol "Cek Izin Saya" di halaman utama.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={downloadSurat}
              disabled={izinStatus !== 'approved' || loading}
              className={`w-full px-4 py-3 sm:py-3.5 rounded font-medium text-sm sm:text-base transition-all ${
                izinStatus === 'approved' && !loading
                  ? 'bg-scoutGreen text-white cursor-pointer hover:bg-[#388E3C]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-download mr-1.5 sm:mr-2 text-xs sm:text-sm"></i>
              {izinStatus === 'approved' 
                ? 'Download Surat PDF' 
                : 'Download (Menunggu Verifikasi)'}
            </button>

            <button
              onClick={() => window.location.href = '/?showCekIzin=true'}
              className="w-full px-4 py-3 sm:py-3.5 rounded font-medium text-sm sm:text-base transition-all bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
            >
              <i className="fas fa-list mr-1.5 sm:mr-2 text-xs sm:text-sm"></i>
              Cek Izin Saya
            </button>
          </div>
          
          {/* {izinId && izinStatus === 'approved' && (
            // <a
            //   href={`/verify/${izinId}`}
            //   target="_blank"
            //   rel="noopener noreferrer"
            //   className="block mt-3 text-center px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all text-sm"
            // >
            //   <i className="fas fa-qrcode mr-2"></i>
            //   Lihat Verifikasi Online
            // </a>
          )} */}
        </div>
      </div>
    </section>
  );
}
