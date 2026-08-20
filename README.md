<p align="center">
  <img src="public/assets/logo-diporani.png" alt="DIPORANI" width="80">
</p>

<h1 align="center">Surat Izin Pramuka</h1>

<p align="center">
  Sistem pengajuan izin digital untuk Penggalang Ramanda Diporani Tirto.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-2-3FCF8E?style=flat-square&logo=supabase" alt="Supabase">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" alt="Status">
</p>

---

## Tentang

Aplikasi web untuk mengajukan izin kegiatan Pramuka secara digital. Siswa mengisi form → izin dikirim ke Supabase → Judat approve lewat dashboard → surat izin bisa di-download + diverifikasi via QR Code.

## Fitur

- **Form izin** — isian otomatis berdasarkan NIS (nama, kelas, sangga terisi sendiri)
- **QR Code** — tiap izin yang di-approve punya QR unik untuk verifikasi
- **Halaman verifikasi** — scan QR → lihat detail izin + status + siapa yang approve
- **Cek status izin** — siswa bisa cek status izin pakai NIS
- **Download surat PDF** — surat izin bisa di-download langsung
- **Notifikasi Telegram** — otomatis kirim notif ke grup Telegram saat izin baru masuk
- **Integrasi dashboard** — terhubung ke dashboard admin untuk approve/hapus

## Screenshot

```
├── Form pengajuan izin
├── Preview surat izin
├── QR Code verifikasi
├── Halaman cek status
└── Notifikasi Telegram
```

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 3 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| PDF | jsPDF |
| QR Code | qrcode.react |
| Notifications | Telegram Bot API |

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100xxxxxxxxxx
```

### 3. Database

Jalankan `supabase-migration-verification.sql` di Supabase SQL Editor.

### 4. Run

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Struktur

```
├── app/
│   ├── page.tsx               # Halaman utama (form + cek izin)
│   ├── verify/[id]/page.tsx   # Verifikasi izin via QR
│   ├── workflow/page.tsx      # Workflow izin
│   └── api/
│       ├── izin/route.ts      # POST buat izin baru
│       ├── izin/[id]/route.ts # GET/PATCH/DELETE izin
│       ├── izin/[id]/verify/  # Verifikasi izin
│       └── telegram/route.ts  # Kirim notif Telegram
├── components/
│   ├── SuratForm.tsx          # Form pengajuan izin
│   ├── PreviewSection.tsx     # Preview surat + QR
│   ├── CekIzin.tsx            # Cek status izin
│   ├── NISModal.tsx           # Modal input NIS
│   └── Header.tsx / Footer.tsx
└── lib/
    ├── supabase.ts            # Client Supabase
    ├── types.ts               # Tipe data
    └── utils.ts               # Utilitas
```

## Alur Kerja

```
Siswa buka app
    ↓
Input NIS → data otomatis keisi
    ↓
Isi alasan izin → submit
    ↓
Izin tersimpan di Supabase (status: pending)
    ↓
Notif terkirim ke Telegram
    ↓
Judat buka dashboard → approve izin
    ↓
Siswa bisa download surat PDF + QR Code
    ↓
QR bisa di-scan → /verify/[id] → cek keaslian izin
```

## License

Private — untuk penggunaan internal Diporani Tirto saja.
