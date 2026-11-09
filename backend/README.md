# 🗃️ Scrapbook & Receipt Jar - Backend API

Backend untuk aplikasi Scrapbook & Receipt Jar menggunakan NestJS (Modular Monolith), TypeScript, dan PostgreSQL (via Prisma ORM).

## 🚀 Fitur Utama
- **Multi-tenant Couple Context:** Menggunakan header `x-couple-id` (UUID) pada setiap request.
- **The Receipt Jar:** Manajemen tiket/struk dengan filter kategori (`food`, `transport`, `movie`, `shopping`, `travel`, `other`), tanggal, dan pencarian.
- **Scrapbook Canvas:** Menyimpan state canvas Fabric.js dalam format JSONB (`canvas.toJSON()`), tanpa binary blob langsung di database.
- **"On This Day" Flashback Engine:** Ekstraksi otomatis bulan dan tanggal (`EXTRACT(MONTH FROM event_date) = EXTRACT(MONTH FROM CURRENT_DATE)`) dengan tahun-tahun sebelumnya (`< EXTRACT(YEAR FROM CURRENT_DATE)`).
- **Storage / Media Upload:** Mendukung upload gambar receipt / thumbnail.
- **Swagger Documentation:** OpenAPI spec interaktif di `/api/docs`.

---

## 🛠️ Setup & Menjalankan

### 1. Salin Environment
Pastikan file `.env` sudah sesuai dengan konfigurasi PostgreSQL Anda:
```bash
cp .env.example .env
```
Contoh `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/scrapbook_db?schema=public"
```

### 2. Jalankan Migrasi Database
```bash
npm run prisma:migrate
# atau apply langsung jika database sudah ada:
npx prisma db push
```

### 3. Seed Data Awal (Opsional)
```bash
npm run prisma:seed
```

### 4. Jalankan Aplikasi
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 5. Akses Swagger API Docs
Buka browser dan navigasikan ke:
```
http://localhost:3000/api/docs
```
Header default untuk testing di Swagger:
- `x-couple-id`: `a0000000-0000-0000-0000-000000000001`
