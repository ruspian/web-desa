# 🇮🇩 Sistem Informasi Desa & Layanan Mandiri

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

Aplikasi web desa modern dan terintegrasi yang dibangun untuk mendigitalkan pelayanan administrasi desa, transparansi anggaran, dan promosi potensi lokal. Aplikasi ini dirancang dengan fokus pada kecepatan, keamanan data, dan kemudahan penggunaan bagi perangkat desa maupun warga.

## ✨ Fitur Unggulan

### 🌍 Halaman Publik (Warga)

1.  **Profil Desa Interaktif**
    - Sejarah Desa.
    - Visi & Misi.
    - Struktur Organisasi.
    - Peta Wilayah .
    - Data Demografi.
2.  **Layanan Mandiri**
    - **Buat Surat Online:** Warga mengisi form, sistem otomatis generate file Word (.docx) siap cetak sesuai template desa.
    - **Cek Bansos:** Pengecekan penerima bantuan berbasis NIK demi transparansi.
    - **Pengaduan Masyarakat:** Pelaporan masalah desa dengan fitur upload bukti foto dan tracking status tiket.
    - **Riwayat Layanan:** Pantau status pengajuan surat dan download dokumen yang sudah disetujui.
    - **Validasi Dokumen QR Code:** Scan QR Code pada surat untuk memverifikasi keaslian dokumen secara instan.
3.  **Informasi & Publikasi**
    - Berita & Artikel Terkini.
    - Jadwal Agenda Kegiatan Desa.
    - Galeri Foto Kegiatan.
    - Potensi Desa.
4.  **Transparansi Anggaran**
    - Grafik Realisasi Anggaran (Pendapatan & Belanja) yang update otomatis saat admin mencatat transaksi kas.

### 🔐 Admin Panel

1.  **Dashboard Eksekutif:** Ringkasan statistik penduduk, surat pending, dan saldo kas terkini.
2.  **Manajemen Kependudukan:**
    - Data Penduduk Lengkap.
    - Kartu Keluarga.
    - Mutasi Warga yang otomatis mengupdate status penduduk.
3.  **Layanan Surat Menyurat:**
    - **Verifikasi:** Setujui/Tolak permohonan warga.
    - **One-Click Generation:** Admin bisa membuat surat dalam format `.docx` secara otomatis, upload ke cloud, dan kirim notifikasi WA ke warga.
    - **Template Manager:** Upload template surat sendiri (format Word) dan atur variabel input dinamis.
4.  **Keuangan Desa:**
    - Input Pagu Anggaran APBDes.
    - Buku Kas Umum dengan bukti kwitansi.
    - Otomatis update realisasi anggaran saat transaksi dicatat.
5.  **CMS Konten:** Kelola Berita, Agenda, Galeri, dan Potensi Desa.
6.  **Pengaturan Sistem:**
    - Ubah Identitas Desa (Nama, Alamat, Kontak).
    - Ganti Logo & Favicon.
    - Manajemen Akun Admin.

---

## 🛠️ Tech Stack (Teknologi)

- **Frontend Framework:** [Next.js 16](https://nextjs.org/) (App Router).
- **Language:** JavaScript / React 19.
- **Styling:** Tailwind CSS v4 + Shadcn UI.
- **Icons:** Lucide React.
- **Database:** PostgreSQL (via Neon Tech).
- **ORM:** Prisma.
- **Authentication:** NextAuth.js (v5).
- **File Storage:** Cloudinary.
- **Document Generator:** Docxtemplater & PizZip.
- **Charts:** Recharts.
- **Editor:** Tiptap.

---

## ⚙️ Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### 1. Clone Repository

```bash
git clone https://github.com/ruspian/web-desa.git
cd web-desa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Aplikasi

Buat file `.env` di root folder proyek dan isi dengan kredensial berikut:

```env
# Database (PostgreSQL Connection String)
DATABASE_URL="postgresql://user:password@host:5432/db_name?sslmode=require"

# NextAuth (Authentication)
AUTH_SECRET="generate_random_string_disini_bisa_pake_openssl"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Untuk Upload Foto & Dokumen)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama_cloud_anda"
CLOUDINARY_API_KEY="api_key_anda"
CLOUDINARY_API_SECRET="api_secret_anda"
```

### 4. Setup Database

Jalankan perintah berikut untuk membuat tabel di database:

```bash
npm run migrate
# Atau: npx dotenv -e .env -- npx prisma migrate dev --name init
```

### 5. Jalankan Server Development

```bash
npm run dev
```

Buka browser dan akses http://localhost:3000.

---

## 📝 Variable Word Template

Berikut adalah daftar variabel yang sudah otomatis terinput dalam template Word:

| Variabel          | Deskripsi            |
| ----------------- | -------------------- |
| `{nama}`          | Nama warga           |
| `{nik}`           | NIK warga            |
| `{jk}`            | Jenis kelamin warga  |
| `{nomor_surat}`   | Nomor surat          |
| `{tanggal_surat}` | Tanggal surat dibuat |
| `{%qr_code}`      | QR Code              |

untuk data lainnya, silakan tambahkan variabel-variabel lainnya di template Word sesuai kebutuhan.

---

## 📂 Struktur Folder

Berikut adalah gambaran struktur folder utama proyek ini:

```
web-desa/
├── app/
│   ├── (public)/           # Halaman untuk warga (Home, Berita, Layanan)
│   │   ├── layout.jsx      # Layout khusus publik (Navbar + Footer)
│   │   └── ...
│   ├── admin/              # Halaman khusus Admin (Protected)
│   │   ├── layout.jsx      # Layout khusus admin (Sidebar)
│   │   └── ...
│   ├── api/                # API Routes (Backend Logic)
│   ├── login/              # Halaman Login
│   └── not-found.jsx       # Custom 404 Page
├── components/
│   ├── client/             # Client Components (Interaktif, State, Effect)
│   ├── ui/                 # Reusable UI Components (Button, Modal, Input)
│   ├── form/               # Komponen Form Admin
│   └── Sidebar.jsx         # Sidebar Admin
├── lib/                    # Utility functions (Prisma, Auth, Date Format)
├── prisma/
│   └── schema.prisma       # Definisi Database
└── public/                 # Aset statis
```

---

## 🛡️ Keamanan & Privasi Data (Security Features)

Sistem ini dibangun dengan standar keamanan modern (_Defense in Depth_) untuk melindungi data warga dan integritas sistem:

### 1. Proteksi Infrastruktur & Jaringan

- **Rate Limiting:** Middleware khusus yang membatasi jumlah permintaan (request) dari satu IP address untuk mencegah serangan _Brute Force_ dan _DDoS_ pada API publik (Cek Bansos, Pengaduan dan Pencarian).
- **HTTP Security Headers:** Implementasi header keamanan ketat di `next.config.mjs` (HSTS, X-Frame-Options, X-Content-Type-Options) untuk mencegah serangan _Clickjacking_ dan _MIME Sniffing_.

### 2. Validasi & Sanitasi Data

- **Zod Validation:** Seluruh input data ke API divalidasi ketat menggunakan library **Zod**. Sistem menolak data yang tidak sesuai format (misal: NIK mengandung huruf, script berbahaya) sebelum menyentuh database.
- **Anti-XSS (Cross-Site Scripting):** Konten berita/artikel yang menggunakan _Rich Text_ disanitasi menggunakan **Isomorphic DOMPurify** untuk mencegah penyisipan script jahat.

### 3. Autentikasi & Otorisasi

- **Secure Session:** Menggunakan **NextAuth.js v5** dengan strategi JWT terenkripsi.
- **Middleware Protection:** Proteksi rute berbasis server yang memblokir akses ilegal ke halaman Admin dan memastikan pemisahan hak akses antara `ADMIN` dan `WARGA`.

### 4. Keamanan Database

- **Anti-SQL Injection:** Penggunaan **Prisma ORM** menjamin semua query database ter-parameterisasi secara otomatis, menutup celah serangan injeksi SQL klasik.
- **Data Privacy:** API publik (seperti Cek Bansos) tidak pernah mengirimkan data sensitif secara massal. Data hanya dikirim jika NIK cocok 100% (Exact Match), dan NIK ditampilkan dalam format tersensor (_Masked_).

---

## 🔑 Akun Admin Default

Karena aplikasi ini tidak memiliki halaman register untuk Admin (demi keamanan), Anda harus mengubah role user pertama secara manual lewat database.

1. Daftar akun baru lewat halaman `/register`.
2. Buka Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. Masuk ke tabel `User`
4. Ubah kolom role `user` tersebut dari `USER` menjadi `ADMIN`
5. Logout dan login kembali

---

## 🚀 Deployment

Aplikasi ini sangat direkomendasikan untuk di-deploy menggunakan Vercel.

1. Push kode ke GitHub.
2. Import project di Vercel.
3. Masukkan semua Environment Variables (DATABASE_URL, AUTH_SECRET, dll) di pengaturan Vercel.
4. Deploy!

---

## 📝 Lisensi & Kontribusi

Project ini didistribusikan di bawah MIT License, yang berarti kode sumber terbuka untuk umum. Namun, kami menerapkan kebijakan Satu Pintu Pengembangan demi menjaga standar keamanan dan kualitas sistem bagi desa-desa pengguna.

#### Ketentuan Pengembangan:

1. **Modifikasi & Fitur Baru:** Jika Anda ingin memodifikasi, memperbaiki bug, atau menambahkan fitur baru pada aplikasi ini, Anda **DIHARUSKAN** melakukan Pull Request ke repositori resmi ini:
   [![GitHub pull requests](https://img.shields.io/github/issues-pr/ruspian/web-desa?style=for-the-badge&logo=github&label=Pull%20Requests&color=black)](https://github.com/ruspian/web-desa/pulls)

2. **Larangan Fork Tertutup:** Dilarang keras mendistribusikan ulang aplikasi ini dalam bentuk tertutup (closed source) atau mengklaim kepemilikan penuh tanpa memberikan kredit ke repositori asli.

3. **Kolaborasi:** Kami sangat terbuka dengan kontribusi! Mari bangun ekosistem digital desa Indonesia bersama-sama melalui repositori pusat ini.

Dengan menggunakan source code ini, Anda menyetujui untuk berkontribusi balik demi kemajuan bersama.

---

Dibuat dengan ❤️ untuk Desa Digital Indonesia.
