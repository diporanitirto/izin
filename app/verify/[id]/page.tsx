'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PreviewSection from '@/components/PreviewSection';
import Loading from '@/components/Loading';

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

export default function VerifyPage() {
  const params = useParams();
  const id = params.id as string;
  const [izin, setIzin] = useState<IzinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [verifiedBy, setVerifiedBy] = useState('');
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (id) fetchIzin();
    const t = new URLSearchParams(window.location.search).get('t');
    if (t) {
      fetch('/api/auth/handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      })
        .then((r) => {
          if (r.ok) {
            setAuthenticated(true);
            window.history.replaceState(null, '', window.location.pathname);
            fetch('/api/auth/session').then((s) => s.json()).then((d) => {
              if (d.username && !verifiedBy) setVerifiedBy(d.username);
            });
          }
        })
        .finally(() => setAuthLoading(false));
    } else {
      fetch('/api/auth/session')
        .then((r) => r.json())
        .then((d) => {
          setAuthenticated(!!d.authenticated);
          if (d.username && !verifiedBy) setVerifiedBy(d.username);
        })
        .finally(() => setAuthLoading(false));
    }
  }, [id]);

  const fetchIzin = async () => {
    try {
      const res = await fetch(`/api/izin/${id}`);
      const result = await res.json();
      if (result.success) {
        setIzin(result.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const handleVerify = async (status: 'approved' | 'rejected') => {
    if (!verifiedBy.trim()) {
      setVerifyMsg('Nama verifikator harus diisi.');
      return;
    }
    setVerifyLoading(true);
    setVerifyMsg(null);
    const res = await fetch(`/api/izin/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, verifiedBy }),
    });
    setVerifyLoading(false);
    if (res.ok) {
      const d = await res.json();
      setIzin(d.data);
      setVerifyMsg(status === 'approved' ? 'Izin disetujui.' : 'Izin ditolak.');
    } else {
      const d = await res.json().catch(() => ({}));
      setVerifyMsg(d.error ?? 'Gagal memverifikasi.');
    }
  };

  if (loading) return <Loading />;

  if (!izin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-scoutBrown-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-xl font-bold text-scoutBrown-900 mb-1">Data Tidak Ditemukan</h1>
          <p className="text-scoutBrown-500 text-sm">Izin yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scoutKhaki-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-scoutBrown-200 overflow-hidden">
          <div className={`px-6 py-5 text-white ${izin.status === 'approved' || izin.status === 'rejected' ? 'bg-green-700' : 'bg-red-700'}`}>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-1">Surat Izin Pramuka</h1>
              <p className="text-xs opacity-90">
                Dewan Ambalan DIPORANI • Gudep 3089/3090 • SMA Negeri 1 Kasihan
              </p>
              <p className="text-xs font-semibold mt-1">
                {izin.status === 'approved'
                  ? 'Status: DISETUJUI'
                  : izin.status === 'rejected'
                    ? 'Status: DITOLAK'
                    : 'Status: BELUM DIVERIFIKASI'}
              </p>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-base font-bold text-scoutBrown-900 mb-3">Data Siswa</h2>

            <div className="space-y-2">
              {[
                ['Nama', izin.nama],
                ['NIS', izin.nis],
                ['Absen', izin.absen],
                ['Kelas', izin.kelas],
                ['Sangga', izin.sangga || '-'],
                ['PK', izin.pk_kelas || '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex text-sm border-b border-scoutBrown-100 pb-2 last:border-0">
                  <span className="text-scoutBrown-500 font-medium w-24">{label}:</span>
                  <span className="text-scoutBrown-900">{value}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-scoutBrown-900 mt-4 mb-2">Alasan Izin</h3>
            <div className="bg-scoutKhaki-50 border border-scoutKhaki-200 rounded-lg p-3">
              <p className="text-sm text-scoutBrown-700 whitespace-pre-wrap">{izin.alasan}</p>
            </div>

            {izin.verified_by && (
              <div className="mt-4 bg-scoutKhaki-50 border border-scoutKhaki-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-scoutBrown-700">Diverifikasi oleh: {izin.verified_by}</p>
                {izin.verified_at && (
                  <p className="text-xs text-scoutBrown-500 mt-1">{formatDate(izin.verified_at)}</p>
                )}
              </div>
            )}

            <div className="mt-4 text-center text-xs text-scoutBrown-400">
              <p>Dibuat: {formatDate(izin.created_at)}</p>
            </div>

            <div className="mt-4">
              <p className="text-xs text-scoutBrown-500 mb-1">
                Status: <span className="font-semibold text-scoutBrown-900">{izin.status}</span>
              </p>
            </div>

            {izin.status !== 'approved' && izin.status !== 'rejected' && !authLoading && authenticated && (
              <div className="mt-4 border border-scoutBrown-200 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-bold text-scoutBrown-900">Verifikasi Izin</h3>
                <input
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  placeholder="Nama verifikator (mis. Juru Adat)"
                  className="w-full border border-scoutBrown-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleVerify('approved')}
                  disabled={verifyLoading}
                  className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-scoutGreen-600 text-white hover:bg-scoutGreen-700 disabled:opacity-50"
                >
                  Approve
                </button>
                {verifyMsg && <p className="text-xs text-scoutBrown-600">{verifyMsg}</p>}
              </div>
            ))}

            {!showPreview && (
              <button
                onClick={() => setShowPreview(true)}
                className="w-full mt-4 px-4 py-3 rounded-lg text-sm font-semibold transition-colors bg-scoutBrown-600 hover:bg-scoutBrown-700 text-white"
              >
                Lihat Preview Surat
              </button>
            )}
          </div>
        </div>

        {showPreview && (
          <div className="mt-4">
            <PreviewSection
              formData={{
                nama: izin.nama,
                absen: izin.absen,
                kelas: izin.kelas,
                sangga: izin.sangga || '',
                alasan: izin.alasan,
                pk: izin.pk_kelas || '',
              }}
              onBack={() => setShowPreview(false)}
              izinId={izin.id}
            />
          </div>
        )}

        <a
          href="/"
          className="block mt-4 w-full px-4 py-3 bg-scoutBrown-700 text-white rounded-lg hover:bg-scoutBrown-800 transition-colors text-sm font-semibold text-center"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
