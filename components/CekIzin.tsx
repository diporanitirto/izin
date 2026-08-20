'use client';

import { useState, useEffect } from 'react';
import Loading from './Loading';
import type { IzinData } from '@/lib/types';

interface CekIzinProps {
  nis: string;
}

export default function CekIzin({ nis }: CekIzinProps) {
  const [izinList, setIzinList] = useState<IzinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadIzinData();
  }, [nis]);

  const loadIzinData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/izin?nis=${nis}`);
      const result = await res.json();
      setIzinList(result.success ? result.data : []);
    } catch {
      setIzinList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-scoutBrown-800 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Riwayat Izin</h2>
            <p className="text-scoutBrown-200 text-sm mt-1">NIS: {nis}</p>
          </div>
          <button
            onClick={loadIzinData}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-semibold disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            <span className="ml-2">Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <Loading />
        ) : izinList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-scoutKhaki-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-scoutBrown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-scoutBrown-800 font-semibold">Belum Ada Riwayat</p>
            <p className="text-scoutBrown-500 text-sm mt-1">Anda belum pernah mengajukan izin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {izinList.map((izin) => (
              <div key={izin.id} className="border border-scoutBrown-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-scoutKhaki-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === izin.id ? null : izin.id)}
                >
                  <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                    Terkirim
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-scoutBrown-900 truncate">{izin.nama}</p>
                    <p className="text-sm text-scoutBrown-500">
                      {izin.kelas} • Absen {izin.absen} • {izin.sangga || '-'}
                    </p>
                  </div>
                  <span className="hidden sm:block text-sm text-scoutBrown-400">
                    {formatDate(izin.created_at)}
                  </span>
                  <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-scoutBrown-100 transition-colors">
                    <span className={`text-scoutBrown-400 transition-transform duration-200 ${expandedId === izin.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                </div>

                {expandedId === izin.id && (
                  <div className="border-t border-scoutBrown-200 bg-scoutKhaki-50/50 p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-scoutBrown-500 text-xs">Tanggal</p>
                        <p className="font-medium text-scoutBrown-800">{formatDate(izin.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-500 text-xs">Waktu</p>
                        <p className="font-medium text-scoutBrown-800">{formatTime(izin.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-500 text-xs">No. Absen</p>
                        <p className="font-medium text-scoutBrown-800">{izin.absen || '-'}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-500 text-xs">PK Kelas</p>
                        <p className="font-medium text-scoutBrown-800 truncate">{izin.pk_kelas || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-scoutBrown-500 text-xs mb-1">Alasan Izin</p>
                      <p className="text-sm text-scoutBrown-800 bg-white rounded-lg p-3 border border-scoutBrown-100">
                        {izin.alasan}
                      </p>
                    </div>
                    <a
                      href={`/verify/${izin.id}`}
                      className="block w-full text-center px-4 py-2.5 bg-scoutBrown-800 text-white rounded-xl hover:bg-scoutBrown-900 transition-colors text-sm font-semibold"
                    >
                      Lihat & Download Surat
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
