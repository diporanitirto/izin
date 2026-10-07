'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PreviewSection from '@/components/PreviewSection';
import Loading from '@/components/Loading';
import { getWhatsAppShareUrl } from '@/lib/utils';

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
                  readOnly
                  className="w-full border border-scoutBrown-200 rounded-lg px-3 py-2 text-sm bg-scoutKhaki-50"
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
            )}

            {izin.status === 'approved' && (
              <div className="mt-4">
                {verifyMsg && <p className="text-xs text-scoutBrown-600 mb-2">{verifyMsg}</p>}
                <a
                  href={getWhatsAppShareUrl(izin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors bg-scoutGreen-600 hover:bg-scoutGreen-700 text-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Bagikan ke WhatsApp
                </a>
              </div>
            )}

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
