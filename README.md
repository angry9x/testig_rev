# 🍈 Lanjar Mulia - Greenhouse Melon Premium

**Aplikasi Web UMKM untuk Greenhouse Melon Premium**

Lanjar Mulia adalah aplikasi web e-commerce berbasis **Python Flask** yang dikembangkan untuk memenuhi tugas mata kuliah **Pemrograman Web**. Aplikasi ini dikhususkan untuk UMKM Greenhouse Lanjar Mulia yang bergerak di bidang budidaya dan penjualan melon premium. Aplikasi ini memungkinkan pelanggan untuk melihat produk, melakukan pemesanan, dan melakukan pembayaran secara online, serta menyediakan dashboard admin yang lengkap untuk mengelola produk, pesanan, kategori, dan laporan penjualan.

---
## 🌐 Deployment Link

Aplikasi Lanjar Mulia telah di-deploy dan dapat diakses secara online melalui tautan berikut:

### 🔗 Link Deployment

**[🔗 Klik di sini untuk mengakses Lanjar Mulia](https://lanjarmuliagreenhouse.pythonanywhere.com//)**

---

## 👥 Anggota Kelompok 

| No | Nama | NIM | Peran Utama | Fokus Jobdesk |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Ardian Gymnatiar** | L200240156 | Backend Developer | Fokus pada Database, Route Backend, serta membantu beberapa implementasi HTML di sisi User dan Admin. |
| **2** | **Irfan Yudhistira** | L200240161 | Backend Developer | Fokus pada Route Backend, serta membantu beberapa implementasi HTML di sisi User dan Admin. |
| **3** | **Fais Bayu Saputra** | L200240171 | Frontend Stylesheet | Fokus pada penataan gaya menggunakan CSS Native, Tailwind CSS, dan manajemen aset gambar (*image*). |
| **4** | **Imam Ahmad Fauzi** | L200240153 | Frontend Developer | Fokus pada pengembangan struktur dan komponen beberapa halaman HTML di bagian Frontend. |
| **5** | **Eaezar Nararya Athaya Arkananta** | L200240146 | Frontend Developer | Fokus pada pengembangan struktur dan komponen beberapa halaman HTML di bagian Frontend. |
| **6** | **Hilal Nurul Fahmi** | L200240179 | Frontend Interaction | Fokus pada interaksi Javascript, konfigurasi DOM, pembuatan *Pop-up*, dan animasi. |
---

## ✅ Fitur Sesuai Ketentuan Tugas

### Fitur Wajib (Umum)

| No | Fitur | Status | Keterangan |
|----|-------|--------|-----------|
| 1 | **Halaman Beranda (Home)** | ✅ | Profil singkat UMKM, foto banner hero, alamat lengkap di footer, typing effect dinamis |
| 2 | **Basis Data MySQL** | ✅ | 7 tabel berelasi dengan foreign key dan query JOIN, tanpa ORM |
| 3 | **Halaman Login Admin** | ✅ | Route `/login` dengan hash password bcrypt, manajemen session |
| 4 | **Panel Admin** | ✅ | Dashboard, CRUD produk, kategori, pesanan, upload gambar |
| 5 | **Kontak via WhatsApp** | ✅ | Tombol WhatsApp di footer `https://wa.me/6289653557426` |

### Fitur Spesifik UMKM (Minimal 3 dari 7)

| No | Fitur | Status | Keterangan |
|----|-------|--------|-----------|
| 1 | **Katalog Produk** | ✅ | Daftar produk lengkap dengan foto, deskripsi, harga, dan stok |
| 2 | **Keranjang Belanja & Pemesanan** | ✅ | Pelanggan dapat memesan produk; admin mengelola pesanan dari panel |
| 3 | **Galeri & Testimoni** | ✅ | pada bagian tetang page testimoni dan galeri dapat dilhat oleh user |
| 4 | **Blog / Artikel** | - | (Belum diimplementasikan) |
| 5 | **Pencarian & Filter Produk** | ✅ | Filter berdasarkan kategori dan pencarian kata kunci real-time |
| 6 | **Laporan Penjualan** | ✅ | Rekap pesanan per periode, dapat diekspor ke Excel (.xlsx) |
| 7 | **WhatsApp Integration** | ✅ | Tombol chat WhatsApp di footer dan halaman kontak |


---

## ✨ Fitur Utama

### 💻 Sisi Pelanggan (Public)
- **Landing Page** — Halaman utama dengan hero section dinamis (typing effect), statistik animasi, dan CTA.
- **Katalog Produk** — Menampilkan semua produk melon dengan fitur pencarian real-time (debounce) dan filter berdasarkan kategori.
- **Detail Produk** — Halaman detail dengan informasi lengkap, animasi 3D tilt pada kartu produk, dan tombol "Tambah ke Keranjang".
- **Keranjang Belanja** — Dikelola sepenuhnya via `localStorage`, memungkinkan pengguna mengubah kuantitas dan menghapus item.
- **Checkout** — Form pemesanan yang wajib diisi setelah login. Menampilkan ringkasan pesanan + ongkos kirim Rp 15.000.
- **Upload Bukti Pembayaran** — Pelanggan dapat mengupload bukti transfer setelah melakukan pemesanan.
- **Riwayat Pesanan** — Pelanggan dapat melihat semua pesanan yang pernah dilakukan.
- **Autentikasi** — Registrasi dan login dengan password yang di-hash menggunakan bcrypt.
- **Halaman Informasi** — Halaman "Tentang Kami" dan "Kontak" dengan alamat lengkap.

### 👨‍💼 Sisi Admin
- **Dashboard** — Menampilkan statistik: total produk, total pesanan, total pelanggan, total pendapatan, pesanan pending, pesanan terbaru, dan produk dengan stok rendah.
- **Manajemen Produk** — CRUD produk lengkap dengan upload gambar dan pengaturan kategori (many-to-many).
- **Manajemen Kategori** — CRUD kategori produk.
- **Manajemen Pesanan** — Melihat daftar pesanan, detail pesanan (termasuk bukti pembayaran), dan mengubah status pesanan (pending → processing → completed / cancelled).
- **Laporan & Analitik** — Laporan penjualan dan ekspor laporan ke Excel (`.xlsx`).
- **Sidebar Responsif** — Navigasi admin dengan toggle untuk perangkat mobile.

### 🎨 UI/UX
- **Tailwind CSS** — Styling modern, utility-first, responsif.
- **Material Symbols** — Icons dari Google Fonts.
- **Animasi** — Scroll reveal, typing effect, floating badges, counter animasi, page loader, toast notification, cursor glow (desktop).
- **Flashed Messages** — Notifikasi sukses/error dengan auto-hide.

---

## 🛠 Tech Stack

| Layer | Teknologi | Peran |
|-------|-----------|-------|
| **Frontend** | HTML, CSS, JavaScript | Struktur halaman, tampilan, dan interaktivitas |
| **Framework CSS** | Tailwind CSS (CDN) | Utility-first CSS framework |
| **Icons** | Google Material Symbols | Ikon antarmuka |
| **Font** | Plus Jakarta Sans (Google Fonts) | Tipografi |
| **Backend** | Python 3 + Flask | Logika server dan routing |
| **Database** | MySQL | Basis data relasional |
| **Koneksi DB** | PyMySQL (tanpa ORM) | Query SQL langsung |
| **Autentikasi** | bcrypt | Hashing password |
| **Session** | Flask-Session (filesystem) | Manajemen sesi |
| **Laporan Excel** | pandas + openpyxl | Ekspor laporan |
| **File Upload** | Werkzeug (secure_filename) | Upload file aman |
| **Environment** | python-dotenv | Konfigurasi env |

---

## 📁 Struktur Proyek

```
lanjar-mulia/
├── .env.example                 # Template konfigurasi environment
├── .gitignore                   # File yang diabaikan Git
├── README.md                    # Dokumentasi proyek
├── requirements.txt             # Dependencies Python (pip freeze)
├── run.py                       # Entry point aplikasi Flask
│
├── app/                         # Direktori utama aplikasi
│   ├── __init__.py              # Factory function create_app()
│   │
│   ├── models/                  # Layer model/database (query SQL langsung)
│   │   ├── database.py          # Koneksi database & helper query (PyMySQL, DictCursor)
│   │   ├── category.py          # Model Category (CRUD)
│   │   ├── order.py             # Model Order (CRUD + payment proof)
│   │   ├── product.py           # Model Product (CRUD + search/filter)
│   │   └── user.py              # Model User (registrasi, login, bcrypt)
│   │
│   ├── routes/                  # Route handlers (controllers)
│   │   ├── public.py            # Route publik (produk, keranjang, checkout, dll.)
│   │   ├── auth.py              # Route autentikasi (login, register, logout)
│   │   └── admin.py             # Route admin (dashboard, manajemen, laporan)
│   │
│   ├── templates/               # Template Jinja2
│   │   ├── base.html            # Template dasar (navbar, footer, flash messages)
│   │   ├── index.html           # Halaman utama (Home)
│   │   ├── produk.html          # Katalog produk
│   │   ├── detail.html          # Detail produk
│   │   ├── keranjang.html       # Halaman keranjang
│   │   ├── checkout.html        # Form checkout
│   │   ├── payment_confirmation.html  # Konfirmasi pembayaran
│   │   ├── order_success.html   # Sukses pemesanan
│   │   ├── riwayat.html         # Riwayat pesanan pelanggan
│   │   ├── tentang.html         # Halaman tentang kami
│   │   ├── kontak.html          # Halaman kontak
│   │   ├── login.html           # Halaman login
│   │   ├── register.html        # Halaman registrasi
│   │   │
│   │   └── admin/               # Template khusus admin (dilindungi login)
│   │       ├── base_admin.html       # Template dasar admin (sidebar + navbar)
│   │       ├── dashboard.html        # Dashboard admin
│   │       ├── products.html         # Daftar produk
│   │       ├── product_form.html     # Form tambah/edit produk
│   │       ├── categories.html       # Manajemen kategori
│   │       ├── orders.html           # Daftar pesanan
│   │       ├── order_detail.html     # Detail pesanan + bukti bayar
│   │       └── reports.html          # Laporan penjualan
│   │
│   ├── static/                  # File statis
│   │   ├── css/
│   │   │   ├── main.css         # CSS global (animasi, navbar, mobile menu)
│   │   │   ├── index.css        # CSS khusus halaman index
│   │   │   ├── detail.css       # CSS khusus halaman detail
│   │   │   └── produk.css       # CSS khusus halaman produk
│   │   │
│   │   ├── js/
│   │   │   ├── script.js        # JavaScript utama (gabungan semua halaman)
│   │   │   ├── config.js        # Konfigurasi Tailwind CSS
│   │   │   ├── main.js          # Fungsi global
│   │   │   ├── index.js         # Script halaman index
│   │   │   ├── produk.js        # Script halaman produk
│   │   │   ├── detail.js        # Script halaman detail produk
│   │   │   ├── keranjang.js     # Script halaman keranjang
│   │   │   ├── checkout.js      # Script halaman checkout
│   │   │   └── login.js         # Script halaman login
│   │   │
│   │   └── images/
│   │       ├── home.webp                    # Gambar hero section
│   │       ├── tentang-1.webp               # Gambar halaman tentang
│   │       ├── tentang-2.webp               # Gambar halaman tentang
│   │       ├── 20260606013412_Lavender_premium.png  # Gambar produk
│   │       ├── 20260606013433_Lavender_Reguler.png  # Gambar produk
│   │       ├── 20260606013448_SweetNet_Premium.png  # Gambar produk
│   │       ├── 20260606013511_SweetNet_Reguler.png  # Gambar produk
│   │       └── bukti_pembayaran/                   # Folder upload bukti bayar
│   │
│   └── database/                # Skema database
│       ├── schema.sql           # DDL (CREATE TABLE) - 7 tabel
│       └── seed.sql             # DML (INSERT data awal)
```

---



## 🚀 Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal:

### 1. Clone Repositori

```bash
git clone <url-repo>
cd lanjar-mulia
```

### 2. Buat Virtual Environment (Direkomendasikan)

```bash
python -m venv venv
source venv/bin/activate       # macOS / Linux
# atau
venv\Scripts\activate          # Windows
```

### 3. Install Dependensi

```bash
pip install -r requirements.txt
```

### 4. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian edit file `.env` dan sesuaikan dengan konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=lanjar_mulia_db
SECRET_KEY=buat_secret_key_acak_yang_aman
```

### 5. Setup Database MySQL

Buat database baru di MySQL:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lanjar_mulia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Import skema tabel (DDL):

```bash
mysql -u root -p lanjar_mulia_db < database/schema.sql
```

Import data awal (DML / seed):

```bash
mysql -u root -p lanjar_mulia_db < database/seed.sql
```

### 6. Jalankan Aplikasi

```bash
python run.py
```

Aplikasi akan berjalan di **http://localhost:5000** atau **http://0.0.0.0:5000**.


### Akun Default untuk Testing

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lanjarmulia.com | (telah di-hash bcrypt - tanyakan ke developer atau buat baru via registrasi) |


---

## 👥 Role dan Hak Akses

### Customer (Pengunjung)
- Melihat produk di katalog
- Menambahkan produk ke keranjang (localStorage)
- Melakukan checkout (wajib login — guest checkout tidak tersedia)
- Melihat riwayat pesanan
- Upload bukti pembayaran
- Menghubungi via WhatsApp

### Admin (Pengelola UMKM)
- **Dashboard** — Melihat statistik keseluruhan UMKM
- **Manajemen Produk** — CRUD produk dengan upload gambar
- **Manajemen Kategori** — CRUD kategori
- **Manajemen Pesanan** — Update status pesanan + lihat bukti bayar
- **Laporan** — Laporan penjualan + ekspor Excel
- **Akses** — Semua halaman admin dilindungi oleh decorator `@admin_required`

---

## 🔒 Fitur Keamanan

1. **Password Hashing** — Password di-hash menggunakan **bcrypt** (`bcrypt.hashpw()`) sebelum disimpan.
2. **Session Management** — Menggunakan **Flask-Session** (filesystem) untuk menyimpan sesi login.
3. **File Upload Aman** — Menggunakan `secure_filename` dari Werkzeug untuk mencegah path traversal.
4. **Validasi Kepemilikan** — Setiap akses detail pesanan memvalidasi kepemilikan user.
5. **Decorator Admin** — `@admin_required` melindungi semua route admin; redirect ke login jika belum login.
6. **Environment Variables** — Semua konfigurasi sensitif di file `.env` (tidak di-commit).
7. **Guest Checkout Dinonaktifkan** — Semua pembelian wajib login.
8. **Flash Messages** — Notifikasi sukses/error di halaman.

---

## 🌟 Fitur UMKM yang Diimplementasikan

### 1. Katalog Produk ✅
- Grid produk dengan foto, deskripsi, harga, dan stok
- Data diambil dari database (tabel `products`)
- Dilengkapi animasi 3D tilt pada kartu produk

### 2. Keranjang Belanja & Pemesanan ✅
- Keranjang via localStorage (tanpa registrasi untuk menambahkan)
- Checkout wajib login
- Admin dapat mengelola status pesanan (pending → processing → completed / cancelled)
- Upload bukti pembayaran oleh pelanggan

### 3. Pencarian & Filter Produk ✅
- Filter berdasarkan kategori (dropdown)
- Pencarian kata kunci real-time dengan debounce (600ms)
- Query SQL dengan `LIKE` dan filter `WHERE`

### 4. Laporan Penjualan ✅
- Statistik di dashboard admin
- Filter berdasarkan tanggal (start_date, end_date)
- Ekspor ke Excel (.xlsx) menggunakan pandas + openpyxl
- Format kolom: Order ID, Nama Customer, Email, Telepon, Total, Metode Bayar, Status, Tanggal

### 5. WhatsApp Integration ✅
- Tombol WhatsApp di footer: `https://wa.me/6289653557426`
- Mudah ditemukan oleh pengunjung

---



<p align="center">
  <strong>🍈 Lanjar Mulia — Greenhouse Melon Premium 🍈</strong><br>
  <em>Manis, segar, dan langsung dari petani ke meja makanmu</em><br><br>
  <strong>HIFA Team</strong><br>
  Hilal · Irfan · Fais · Ardian · Imam · Eaezar 
</p>