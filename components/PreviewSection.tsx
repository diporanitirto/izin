'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { FormData } from '@/lib/types';

interface PreviewSectionProps {
  formData: FormData;
  onBack: () => void;
  izinId?: string | null;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function drawLetter(ctx: CanvasRenderingContext2D, formData: FormData, W: number, H: number) {
  const LM = 100, RM = 100, LH = 26;
  const maxW = W - LM - RM;
  let y = 80;

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.font = '16px Times New Roman';

  const today = new Date();
  ctx.textAlign = 'right';
  ctx.fillText(`Kasihan, ${today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, W - RM, y);
  ctx.textAlign = 'left';
  y += LH * 1.2;

  ctx.fillText('Perihal', LM, y);
  ctx.fillText(': Permohonan ijin tidak mengikuti kegiatan pramuka', LM + 80, y);
  y += LH * 1.8;

  ctx.fillText('Kepada Yth.', LM, y); y += LH;
  ctx.fillText('Kakak Dewan Ambalan', LM, y); y += LH;
  ctx.fillText('SMA Negeri 1 Kasihan', LM, y); y += LH;
  ctx.fillText('Di tempat', LM, y); y += LH * 1.8;

  ctx.fillText('Dengan Hormat,', LM, y); y += LH * 1.4;
  ctx.fillText('Saya yang bertanda tangan di bawah ini:', LM, y); y += LH * 1.4;

  const indent = LM + 40, lw = 150, di = indent + 20;
  const fields: [string, string][] = [
    ['Nama', formData.nama],
    ['Nomor Absen', formData.absen],
    ['Kelas', formData.kelas],
    ['Sangga', formData.sangga],
    ['Pembina Kelas', ''],
  ];
  for (const [label, val] of fields) {
    ctx.fillText(label, di, y);
    ctx.fillText(':', di + lw, y);
    ctx.fillText(val, di + lw + 20, y);
    y += LH;
  }
  y += LH * 0.4;

  const reasonIntro = 'Dengan ini saya ingin memberitahukan bahwa saya tidak dapat mengikuti kegiatan pramuka dengan alasan sebagai berikut:';
  for (const l of wrapText(ctx, reasonIntro, maxW)) {
    ctx.fillText(l, LM, y);
    y += LH;
  }
  y += LH * 0.2;

  for (const l of wrapText(ctx, formData.alasan, maxW)) {
    ctx.fillText(l, LM, y);
    y += LH;
  }
  y += LH * 0.6;

  const closing = 'Demikian surat ijin saya sampaikan dengan sebenar-benarnya. Atas perhatiannya saya ucapkan terima kasih.';
  for (const l of wrapText(ctx, closing, maxW)) {
    ctx.fillText(l, LM, y);
    y += LH;
  }
  y += LH * 1.2;

  const sigY = y;
  const rightX = W - RM - 80;
  ctx.textAlign = 'center';
  ctx.fillText('Hormat Saya,', rightX, sigY);
  ctx.fillText(`( ${formData.nama} )`, rightX, sigY + LH * 3.5);

  const rowY = sigY + LH * 6;
  const halfW = maxW / 2;
  const pkX = LM + halfW * 0.5;
  const judatX = LM + halfW * 1.5;

  ctx.fillText('Mengetahui,', pkX, rowY);
  ctx.font = 'bold 16px Times New Roman';
  ctx.fillText('Pembina Kelas', pkX, rowY + LH);
  ctx.font = '16px Times New Roman';
  ctx.fillText('( ____________________ )', pkX, rowY + LH * 4);

  ctx.fillText('Mengetahui,', judatX, rowY);
  ctx.font = 'bold 16px Times New Roman';
  ctx.fillText('Judat', judatX, rowY + LH);
  ctx.font = '16px Times New Roman';
  ctx.fillText('( ____________________ )', judatX, rowY + LH * 4);

  const mabY = rowY + LH * 6;
  const mabX = maxW / 2 + LM;
  ctx.fillText('Mengetahui,', mabX, mabY);
  ctx.font = 'bold 16px Times New Roman';
  ctx.fillText('Mabigus', mabX, mabY + LH);
  ctx.font = '16px Times New Roman';
  ctx.fillText('( ____________________ )', mabX, mabY + LH * 4);
}

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number, logoImg: HTMLImageElement | null) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.textAlign = 'center';
  ctx.font = 'bold 72px Times New Roman';
  ctx.fillStyle = '#7b5b46';

  const spX = 280, spY = 200;
  for (let y = 100; y < h + 100; y += spY) {
    for (let x = -100; x < w + 100; x += spX) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 8);
      const row = Math.floor((y - 100) / spY);
      const col = Math.floor((x + 100) / spX);
      if (logoImg && (row + col) % 2 === 1) {
        try {
          ctx.save();
          ctx.globalAlpha = 0.08;
          ctx.drawImage(logoImg, -40, -40, 80, 80);
          ctx.restore();
        } catch {
          ctx.fillText('DIPORANI', 0, 0);
        }
      } else {
        ctx.fillText('DIPORANI', 0, 0);
      }
      ctx.restore();
    }
  }
  ctx.restore();
}

export default function PreviewSection({ formData, onBack, izinId: propIzinId }: PreviewSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [izinId, setIzinId] = useState<string | null>(propIzinId || null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    generatePreview();
    if (!propIzinId) fetchIzinId();
  }, [formData, propIzinId]);

  useEffect(() => {
    if (propIzinId) setIzinId(propIzinId);
  }, [propIzinId]);

  const fetchIzinId = async () => {
    try {
      const res = await fetch(`/api/izin?nis=${formData.absen}`);
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        const match = result.data.find((item: any) =>
          item.nama === formData.nama && item.kelas === formData.kelas
        );
        if (match) setIzinId(match.id);
      }
    } catch {}
  };

  const generatePreview = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let logoImg: HTMLImageElement | null = null;
    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = '/assets/logo-diporani.png';
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
      logoImg = img;
    } catch {}

    const W = 794, H = 1123;
    const scale = 4000 / W;
    canvas.width = W * scale;
    canvas.height = H * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    drawWatermark(ctx, W, H, logoImg);
    drawLetter(ctx, formData, W, H);

    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
  };

  const downloadSurat = async () => {
    setIsDownloading(true);
    try {
      await generatePreview();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`Surat_Ijin_Pramuka_${formData.nama.replace(/\s/g, '_')}_${formData.kelas}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="fade-in" aria-label="Preview surat">
      <div className="border border-scoutBrown-200 rounded-xl bg-white overflow-hidden">
        <div className="bg-scoutKhaki-50 border-b border-scoutBrown-200 px-5 py-3 flex items-center justify-between">
          <span className="font-bold text-scoutBrown-800 text-sm">Preview Surat</span>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-scoutBrown-700 text-white rounded-lg text-sm cursor-pointer hover:bg-scoutBrown-800 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
        </div>

        <div className="p-5">
          <canvas ref={canvasRef} className="hidden"></canvas>

          <div className="bg-scoutKhaki-50 p-3 sm:p-5 rounded-lg text-center mb-4">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview Surat"
                width={794}
                height={1123}
                className="max-w-full h-auto border border-scoutBrown-200 rounded-lg mx-auto"
                unoptimized
              />
            )}
          </div>

          <div className="mb-4 p-4 rounded-lg bg-scoutGreen-50 border border-scoutGreen-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-scoutGreen-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <h3 className="font-bold text-scoutGreen-900 text-sm mb-1">Surat Izin Siap Didownload</h3>
                <p className="text-xs text-scoutGreen-700">
                  PDF berisi 2 rangkap surat. 1 diserahkan ke gerbang, 1 ditinggal di kelas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadSurat}
              disabled={isDownloading}
              className="flex-[2] px-4 py-3 rounded-lg font-semibold text-sm transition-all bg-scoutGreen-600 text-white cursor-pointer hover:bg-scoutGreen-700 flex items-center justify-center gap-2 relative overflow-hidden disabled:cursor-wait"
            >
              {isDownloading && (
                <span className="absolute inset-0 bg-scoutGreen-700 animate-[fillBar_1.5s_ease-in-out]" />
              )}
              <span className="relative flex items-center gap-2">
                <svg className={`w-4 h-4 ${isDownloading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isDownloading ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  )}
                </svg>
                {isDownloading ? 'Mendownload...' : 'Download PDF (2 Rangkap)'}
              </span>
            </button>
            <button
              onClick={() => window.location.href = '/?showCekIzin=true'}
              className="flex-1 px-3 py-3 rounded-lg font-medium text-sm transition-all bg-scoutBrown-100 text-scoutBrown-700 cursor-pointer hover:bg-scoutBrown-200 flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cek Izin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
