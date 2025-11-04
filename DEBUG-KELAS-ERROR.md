# 🔍 Debug: Error "Kelas tidak valid"

## Status Perbaikan

✅ **Normalisasi kelas sudah ditambahkan**
✅ **Logging sudah ditambahkan**
⏳ **Menunggu test untuk lihat log**

## Logging Points

### 1. Form Submit (Browser Console)
```
🔍 Form Submit Debug: {
  originalKelas: "X-1" atau "X1" ?
  normalizedKelas: "X1" ?
  fullData: { ... }
}
```

### 2. API Request (Browser Console)
```
📤 Sending to API: { kelas: "X1", ... }
📥 DB Response status: 200 atau 400?
```

### 3. Server Side (Terminal/Server Log)
```
DEBUG - Kelas validation: {
  original: "X1" ?
  normalized: "X1" ?
  isValid: true atau false?
  allowedKelas: ["X1", "X2", ...]
}
```

## Testing Steps

1. **Buka Browser Console** (F12)
2. **Input NIS** di modal (misal: 11803)
3. **Isi form izin:**
   - Nama: (otomatis terisi)
   - Absen: (otomatis terisi)
   - Kelas: (otomatis terisi)
   - Sangga: pilih salah satu
   - PK: pilih salah satu
   - Alasan: isi alasan
4. **Klik "Buat Surat"**
5. **Perhatikan Console Log** - cari emoji:
   - 🔍 Form Submit Debug
   - 📤 Sending to API
   - 📥 DB Response status
   - DEBUG - Kelas validation

## Expected vs Actual

### ✅ Expected (Berhasil)
```javascript
🔍 Form Submit Debug: {
  originalKelas: "X-1",
  normalizedKelas: "X1",
  fullData: { kelas: "X1", nama: "...", ... }
}

📤 Sending to API: { kelas: "X1", ... }
📥 DB Response status: 200

DEBUG - Kelas validation: {
  original: "X1",
  normalized: "X1",
  isValid: true,
  allowedKelas: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8"]
}
```

### ❌ Actual (Error)
```javascript
🔍 Form Submit Debug: {
  originalKelas: "???",  // <-- Cek ini
  normalizedKelas: "???", // <-- Dan ini
  fullData: { kelas: "???", ... }
}

📤 Sending to API: { kelas: "???", ... }
📥 DB Response status: 400

DEBUG - Kelas validation: {
  original: "???",       // <-- Value yang diterima API
  normalized: "???",     // <-- Hasil normalisasi
  isValid: false,        // <-- Kenapa false?
  allowedKelas: [...]
}
```

## Kemungkinan Issues

### Issue 1: Kelas masih ada dash
**Symptom:**
```javascript
normalizedKelas: "X-1"  // ❌ Masih ada dash
```

**Fix:** Sudah diperbaiki dengan `.replace(/-/g, '')`

### Issue 2: Kelas lowercase
**Symptom:**
```javascript
normalized: "x1"  // ❌ Lowercase
```

**Fix:** API sudah handle dengan `.toUpperCase()`

### Issue 3: Kelas undefined/null
**Symptom:**
```javascript
originalKelas: undefined
```

**Fix:** Cek siswaData di page.tsx

### Issue 4: Database Migration belum dijalankan
**Symptom:** Error di database level

**Fix:** Jalankan `/izin/supabase-migration-verification.sql`

## Quick Test (Manual)

Buka Browser Console dan test manual:
```javascript
// Test normalisasi
const kelas = "X-1";
const normalized = kelas.replace(/-/g, '');
console.log('Test:', { kelas, normalized }); 
// Expected: { kelas: "X-1", normalized: "X1" }
```

## Next Steps

1. **Submit form dan screenshot console log**
2. **Copy paste semua log** (🔍 📤 📥 DEBUG)
3. **Check server terminal** untuk log DEBUG
4. **Jika masih error**, periksa:
   - sessionStorage data
   - siswaData structure
   - Database schema

## Files Modified

- ✅ `/components/SuratForm.tsx` - Added logging & normalize
- ✅ `/app/page.tsx` - Added logging
- ✅ `/app/api/database/route.ts` - Added validation logging
- ✅ `/supabase-migration-verification.sql` - Updated migration

## Contact Points

Jika masih error setelah cek log:
1. Screenshot console log lengkap
2. Copy error message
3. Check database table structure di Supabase
