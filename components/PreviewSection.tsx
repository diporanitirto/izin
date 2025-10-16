'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
}

export default function PreviewSection({ formData, onBack }: PreviewSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    generatePreview();
  }, [formData]);

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseWidth = 794;
    const baseHeight = 1123;
    const scale = 2480 / baseWidth;
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Multiple Watermarks
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px Times New Roman';
    ctx.fillStyle = '#7b5b46';
    
    // Create a pattern of watermarks across the page
    const wmSpacingX = 280;
    const wmSpacingY = 200;
    const startX = -100;
    const startY = 100;
    
    for (let y = startY; y < baseHeight + 100; y += wmSpacingY) {
      for (let x = startX; x < baseWidth + 100; x += wmSpacingX) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 8);
        ctx.fillText('DIPORANI', 0, 0);
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

    // Date first (top right)
    const today = new Date();
    const location = 'Kasihan';
    const dateStr = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.textAlign = 'right';
    ctx.fillText(`${location}, ${dateStr}`, baseWidth - rightMargin, y);
    ctx.textAlign = 'left';
    y += lineHeight * 1.2;
    
    // Subject
    ctx.fillText('Perihal', leftMargin, y);
    ctx.fillText(': Permohonan ijin tidak mengikuti kegiatan pramuka', leftMargin + 80, y);
    y += lineHeight * 1.8;

    // Recipient
    ctx.fillText('Kepada Yth.', leftMargin, y); y += lineHeight;
    ctx.fillText('Kakak Dewan Ambalan', leftMargin, y); y += lineHeight;
    ctx.fillText('SMA Negeri 1 Kasihan', leftMargin, y); y += lineHeight;
    ctx.fillText('Di tempat', leftMargin, y); y += lineHeight * 1.8;

    // Opening
    ctx.fillText('Dengan Hormat,', leftMargin, y); y += lineHeight * 1.4;
    ctx.fillText('Saya yang bertanda tangan di bawah ini:', leftMargin, y); y += lineHeight * 1.4;

    // Personal data
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

    // Helper function for justified text
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

    // Reason intro
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

    // Main reason
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

    // Closing
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

    // Signature section
    const signatureStartY = y;
    const hormatSayaX = baseWidth - rightMargin - 80;
    ctx.textAlign = 'center';
    ctx.fillText('Hormat Saya,', hormatSayaX, signatureStartY);
    let lineY = signatureStartY + lineHeight * 3.5;
    ctx.fillText('( ' + formData.nama + ' )', hormatSayaX, lineY);

    // Acknowledgements
    y = signatureStartY + lineHeight * 6;
    const colSpacing = (baseWidth - leftMargin - rightMargin) / 3;
    const col1X = leftMargin + colSpacing * 0.5;
    const col2X = leftMargin + colSpacing * 1.5;
    const col3X = leftMargin + colSpacing * 2.5;

    ctx.textAlign = 'center';
    ctx.fillText('Mengetahui,', col1X, y);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Pembina Kelas', col1X, y + lineHeight);
    ctx.font = '16px Times New Roman';
    lineY = y + lineHeight * 4;
    ctx.fillText('( ' + formData.pkKelas + ' )', col1X, lineY);

    ctx.fillText('Mengetahui,', col2X, y);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Judat', col2X, y + lineHeight);
    ctx.font = '16px Times New Roman';
    lineY = y + lineHeight * 4;
    ctx.fillText('( ____________________ )', col2X, lineY);

    ctx.fillText('Mengetahui,', col3X, y);
    ctx.font = 'bold 16px Times New Roman';
    ctx.fillText('Kamabigus', col3X, y + lineHeight);
    ctx.font = '16px Times New Roman';
    lineY = y + lineHeight * 4;
    ctx.fillText('( ____________________ )', col3X, lineY);

    // Set preview
    setPreviewUrl(canvas.toDataURL());
  };

  const downloadSurat = async () => {
    generatePreview();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');

    // Dynamic import for jsPDF
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
            className="px-2 py-1.5 bg-[#a1887f] text-white rounded text-xs sm:text-sm cursor-pointer hover:bg-lightBrown transition-all flex items-center gap-1"
            title="Kembali ke Form"
          >
            <i className="fas fa-arrow-left text-xs"></i>
            <span className="hidden sm:inline">Kembali</span>
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
          
          <button
            onClick={downloadSurat}
            className="w-full px-4 py-3 sm:py-3.5 bg-scoutGreen text-white rounded font-medium text-sm sm:text-base cursor-pointer hover:bg-[#388E3C] transition-all"
          >
            <i className="fas fa-download mr-1.5 sm:mr-2 text-xs sm:text-sm"></i>
            Download Surat PDF
          </button>
        </div>
      </div>
    </section>
  );
}
