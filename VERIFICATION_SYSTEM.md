# Sistem Verifikasi Izin Pramuka

## Fitur Baru

Sistem verifikasi online untuk surat izin pramuka dengan fitur:

### 1. **Sistem Verifikasi Judat** 
- Dashboard terintegrasi di `http://localhost:3001/izin`
- Judat dapat melihat semua pengajuan izin
- Input nama Judat wajib sebelum approve
- Approve dengan nama verifikator tercatat
- Info verifikator ditampilkan di tabel izin

### 2. **Cek Status Izin untuk Siswa**
- Siswa dapat mengecek status izin dengan NIS
- Melihat history semua izin yang pernah diajukan
- Tombol "Cek Izin Saya" di halaman utama (`http://localhost:3000`)

### 3. **Halaman Verifikasi dengan QR Code**
- Izin yang sudah di-approve memiliki QR Code
- Scan QR Code mengarahkan ke halaman verifikasi
- Halaman verifikasi menampilkan info lengkap + verifikator
- URL: `http://localhost:3000/verify/[id]`

### 4. **Status Izin**
- **Pending**: Menunggu verifikasi Judat
- **Approved**: Disetujui, bisa download surat
- **Rejected**: Ditolak (untuk implementasi future)

## Instalasi

### 1. Update Database Schema

Jalankan script SQL berikut di Supabase SQL Editor:

```sql
-- Lihat file: supabase-migration-verification.sql
```

### 2. Install Dependencies

```bash
cd izin
npm install qrcode.react
```

### 3. Environment Variables

Pastikan `.env.local` sudah memiliki:

**Di folder `izin`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Di folder `dashboard`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_ACTION_TOKEN=your_admin_token
```

## Struktur File

```
izin/
├── app/
│   ├── page.tsx                    # Halaman utama (+ tombol navigasi)
│   ├── verify/
│   │   └── [id]/
│   │       └── page.tsx           # Halaman verifikasi dengan QR
│   └── api/
│       ├── izin/
│       │   └── route.ts           # POST izin, GET with filter
│       ├── izin/[id]/
│       │   ├── route.ts           # GET izin by ID
│       │   └── verify/
│       │       └── route.ts       # PATCH untuk verifikasi
│       └── database/
│           └── route.ts           # Alias API (updated)
└── components/
    └── CekIzin.tsx                # Component cek izin siswa

dashboard/
├── src/
│   ├── app/
│   │   ├── izin/
│   │   │   └── page.tsx          # Dashboard Judat (updated)
│   │   └── api/
│   │       └── izin/
│   │           └── [id]/
│   │               └── route.ts   # PATCH approve (updated)
│   ├── components/
│   │   ├── IzinTable.tsx         # Table izin (updated)
│   │   └── StatusBadge.tsx       # Badge status (updated)
│   └── lib/
│       └── supabase.ts           # Type Izin (updated)
```

## API Endpoints

### 1. POST /api/izin
Submit izin baru (status: pending)

**Request Body:**
```json
{
  "nama": "John Doe",
  "absen": "12",
  "kelas": "X1",
  "sangga": "Mawar",
  "pkKelas": "Jane Doe",
  "alasan": "Sakit"
}
```

### 2. GET /api/izin?status=pending&nis=12
Get list izin dengan filter

**Query Parameters:**
- `status`: pending | approved | rejected | all
- `nis`: Nomor Induk Siswa

### 3. GET /api/izin/[id]
Get detail izin by ID

### 4. PATCH /api/izin/[id] (Dashboard)
Approve izin dengan verifikator

**Headers:**
- `x-action-token`: Admin token
- `Content-Type`: application/json

**Request Body:**
```json
{
  "verifiedBy": "Nama Judat"
}
```

## User Flow

### Flow Siswa:
1. Siswa mengisi form izin di `http://localhost:3000`
2. Submit → Status: **pending**
3. Cek status via "Cek Izin Saya" (input NIS)
4. Jika **approved**: Lihat surat dengan QR Code
5. Scan QR Code untuk verifikasi online

### Flow Judat:
1. Klik "Dashboard Judat" → Redirect ke `http://localhost:3001/izin`
2. Aktifkan token admin
3. Input nama Judat di header
4. Lihat list izin pending
5. Klik "Approve"
6. Izin ter-update dengan nama verifikator & timestamp

### Flow Verifikasi:
1. Scan QR Code di surat
2. Redirect ke `/verify/[id]`
3. Tampil info lengkap siswa + verifikator
4. Validasi keaslian surat

## Keamanan

- ✅ Status default: `pending`
- ✅ Verifikasi butuh nama Judat
- ✅ Download hanya untuk status `approved`
- ✅ QR Code hanya muncul jika `approved`
- ✅ Timestamp verifikasi dicatat
- ✅ RLS Supabase untuk proteksi data

## Database Schema

```sql
CREATE TABLE izin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  absen INTEGER NOT NULL,
  kelas TEXT NOT NULL,
  sangga TEXT DEFAULT '',
  pk_kelas TEXT DEFAULT '',
  alasan TEXT NOT NULL,
  nis TEXT,
  status TEXT DEFAULT 'pending',
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Screenshots

### 1. Halaman Utama
- Tombol "Cek Izin Saya"
- Tombol "Dashboard Judat"

### 2. Dashboard Judat
- Filter status
- Input nama Judat
- List izin dengan tombol Setujui/Tolak

### 3. Cek Izin
- Input NIS
- List izin siswa
- Badge status (pending/approved/rejected)

### 4. Halaman Verifikasi
- QR Code (jika approved)
- Info lengkap siswa
- Info verifikator + timestamp

## Troubleshooting

### Error: "Konfigurasi database belum lengkap"
- Pastikan environment variables sudah benar
- Check `SUPABASE_SERVICE_ROLE_KEY`

### QR Code tidak muncul
- Pastikan status izin = `approved`
- Check browser console untuk error

### Data tidak muncul di dashboard
- Jalankan migration SQL di Supabase
- Check table `izin` memiliki kolom baru

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Credits

Developed for Gudep 12-129 XII SMA Negeri 12 Bandung
