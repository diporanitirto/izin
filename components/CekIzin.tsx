'use client';

import { useState, useEffect } from 'react';
import Loading from './Loading';

interface IzinData {
  id: string;
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pk_kelas: string;
  alasan: string;
  nis: string;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

interface CekIzinProps {
  nis: string;
}

export default function CekIzin({ nis }: CekIzinProps) {
  const [izinList, setIzinList] = useState<IzinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadIzinData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nis]);

  const loadIzinData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/izin?nis=${nis}`);
      const result = await response.json();
      
      if (result.success) {
        setIzinList(result.data);
      } else {
        setIzinList([]);
      }
    } catch (error) {
      console.error('Error loading izin:', error);
      setIzinList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-scoutBrown-800 to-scoutBrown-900 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Riwayat Izin</h2>
            <p className="text-scoutBrown-200 text-sm mt-1">NIS: {nis}</p>
          </div>
          <button
            onClick={loadIzinData}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-semibold backdrop-blur-sm border border-white/20 disabled:opacity-50"
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
              <span className="text-3xl">📭</span>
            </div>
            <p className="text-scoutBrown-800 font-semibold">Belum Ada Riwayat</p>
            <p className="text-scoutBrown-500 text-sm mt-1">Anda belum pernah mengajukan izin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {izinList.map((izin) => {
              const isExpanded = expandedId === izin.id;
              
              return (
                <div 
                  key={izin.id} 
                  className="border border-scoutBrown-200 rounded-xl overflow-hidden"
                >
                  {/* Row - Always Visible */}
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-scoutKhaki-50 transition-colors"
                    onClick={() => toggleExpand(izin.id)}
                  >
                    {/* Status Badge */}
                    <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                      Terkirim
                    </span>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-scoutBrown-900 truncate">{izin.nama}</p>
                      <p className="text-sm text-scoutBrown-500">
                        {izin.kelas} • Absen {izin.absen} • {izin.sangga || '-'}
                      </p>
                    </div>

                    {/* Date */}
                    <span className="hidden sm:block text-sm text-scoutBrown-400">
                      {formatDate(izin.created_at)}
                    </span>

                    {/* Expand Button */}
                    <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-scoutBrown-100 transition-colors">
                      <span className={`text-scoutBrown-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-scoutBrown-200 bg-scoutKhaki-50/50 p-4 space-y-4">
                      {/* Info Grid */}
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

                      {/* Alasan */}
                      <div>
                        <p className="text-scoutBrown-500 text-xs mb-1">Alasan Izin</p>
                        <p className="text-sm text-scoutBrown-800 bg-white rounded-lg p-3 border border-scoutBrown-100">
                          {izin.alasan}
                        </p>
                      </div>

                      {/* Action Button */}
                      <a
                        href={`/verify/${izin.id}`}
                        className="block w-full text-center px-4 py-2.5 bg-scoutBrown-800 text-white rounded-xl hover:bg-scoutBrown-900 transition-colors text-sm font-semibold"
                      >
                        📄 Lihat & Download Surat
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
