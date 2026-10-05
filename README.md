<p align="center">
  <img src="public/assets/logo-diporani.png" alt="DIPORANI" width="80">
</p>

<h1 align="center">Surat Izin Pramuka</h1>

<p align="center">
  Sistem pengajuan izin digital Ambalan Diporani Tirto, SMAN 1 Kasihan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase" alt="Supabase">
</p>

---

## Tentang

Aplikasi web untuk siswa mengajukan izin tidak mengikuti kegiatan pramuka. Siswa masuk dengan NIS, data diri terisi otomatis dari database, lalu surat izin PDF bisa langsung di-download. Setiap pengajuan tercatat lengkap dengan waktu, alamat IP, dan perangkat yang dipakai.

Data siswa, kelas, dan pendamping kelas dibaca langsung dari database Supabase yang sama dengan [dashboard admin](https://github.com/diporanitirto/dashboard), jadi pembaruan data cukup dilakukan di satu tempat.

## Fitur

- Masuk dengan NIS; nama, kelas, dan nomor absen terisi otomatis dari database.
- Pembina kelas dipilih dari daftar pendamping kelas yang bersangkutan, namanya tercetak di surat.
- Pilihan sangga menyesuaikan jenis kelamin (putra: Pendobrak, Penegas; putri: Perintis, Pencoba, Pelaksana).
- Surat izin PDF 2 rangkap: satu diserahkan ke gerbang, satu ditinggal di kelas.
- Riwayat izin per NIS, dengan tautan ke surat yang pernah dibuat.
- Halaman verifikasi di `/verify/[id]`: header merah (belum diverifikasi) / hijau (sudah diverifikasi). Juru Adat login sebagai admin lalu bisa approve; setelah diverifikasi tombol verifikasi hilang.
- QR Code di surat (kolom kanan, logo DIPORANI di tengah) otomatis mengarah ke halaman verifikasi. Bisa dipindai dari dashboard admin yang sudah login.
- Pencatatan metadata pengajuan: alamat IP, user-agent, dan ringkasan perangkat (ua-parser-js).
- Notifikasi Telegram tersedia di kode, saat ini dinonaktifkan.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | Supabase (PostgreSQL) |
| PDF | jsPDF (render via canvas) |
| Lainnya | ua-parser-js |

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi variabelnya
npm run dev
```

Buka http://localhost:3000.

### Environment Variables

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key Supabase |
| `TELEGRAM_BOT_TOKEN` | Opsional, untuk notifikasi Telegram |
| `TELEGRAM_CHAT_ID` | Opsional, tujuan chat notifikasi |
| `AUTH_SECRET` | Secret acak untuk sesi login admin |

### Struktur Database (Supabase)

Relasi: `siswa.kelas_id` & `pendamping.kelas_id` → `kelas`. Tabel `izin` menyimpan tiap pengajuan (snapshot nama/kelas/sangga/alasan + `status`, `verified_by`, `verified_at`). `admin_users` untuk login admin.

Tabel: `kelas`, `siswa`, `pendamping`, `izin`, `admin_users`. Kolom verifikasi & metadata perangkat ditambahkan via migrasi ALTER TABLE.

## Terkait

- [diporanitirto/dashboard](https://github.com/diporanitirto/dashboard): dashboard admin untuk memantau pengajuan izin dari aplikasi ini.
