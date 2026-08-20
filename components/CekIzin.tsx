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
    <div className="border border-scoutBrown-200 rounded-xl bg-white overflow-hidden">
      <div className="bg-scoutKhaki-50 border-b border-scoutBrown-200 px-5 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-scoutBrown-900">Riwayat Izin</h2>
          <p className="text-scoutBrown-500 text-xs mt-0.5">NIS: {nis}</p>
        </div>
        <button
          onClick={loadIzinData}
          disabled={loading}
          className="px-3 py-1.5 bg-white border border-scoutBrown-200 hover:bg-scoutKhaki-50 text-scoutBrown-600 rounded-lg transition-colors text-xs font-medium disabled:opacity-50"
        >
          <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
          <span className="ml-1.5">Refresh</span>
        </button>
      </div>

      <div className="p-5">
        {loading ? (
          <Loading />
        ) : izinList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-scoutKhaki-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-scoutBrown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-scoutBrown-800 font-semibold text-sm">Belum Ada Riwayat</p>
            <p className="text-scoutBrown-400 text-xs mt-1">Anda belum pernah mengajukan izin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {izinList.map((izin) => (
              <div key={izin.id} className="border border-scoutBrown-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-scoutKhaki-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === izin.id ? null : izin.id)}
                >
                  <span className="shrink-0 px-2 py-0.5 rounded-md text-xs font-semibold bg-scoutGreen-100 text-scoutGreen-700">
                    Terkirim
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-scoutBrown-900 text-sm truncate">{izin.nama}</p>
                    <p className="text-xs text-scoutBrown-500">
                      {izin.kelas} • Absen {izin.absen} • {izin.sangga || '-'}
                    </p>
                  </div>
                  <span className="hidden sm:block text-xs text-scoutBrown-400">
                    {formatDate(izin.created_at)}
                  </span>
                  <button className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-scoutBrown-100 transition-colors">
                    <span className={`text-scoutBrown-400 text-xs transition-transform duration-200 ${expandedId === izin.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                </div>

                {expandedId === izin.id && (
                  <div className="border-t border-scoutBrown-100 bg-scoutKhaki-50 p-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-scoutBrown-400">Tanggal</p>
                        <p className="font-medium text-scoutBrown-800">{formatDate(izin.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-400">Waktu</p>
                        <p className="font-medium text-scoutBrown-800">{formatTime(izin.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-400">No. Absen</p>
                        <p className="font-medium text-scoutBrown-800">{izin.absen || '-'}</p>
                      </div>
                      <div>
                        <p className="text-scoutBrown-400">PK Kelas</p>
                        <p className="font-medium text-scoutBrown-800 truncate">{izin.pk_kelas || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-scoutBrown-400 text-xs mb-1">Alasan Izin</p>
                      <p className="text-xs text-scoutBrown-800 bg-white rounded-lg p-3 border border-scoutBrown-100">
                        {izin.alasan}
                      </p>
                    </div>
                    <a
                      href={`/verify/${izin.id}`}
                      className="block w-full text-center px-4 py-2 bg-scoutBrown-700 text-white rounded-lg hover:bg-scoutBrown-800 transition-colors text-xs font-medium"
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
