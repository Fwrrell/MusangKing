# MusangKing API Documentation

**Base URL:** `http://localhost:3000/api`

## Authentication

API ini menggunakan **JWT (JSON Web Token)** untuk jalur Admin. Token harus dikirimkan melalui Header:
`Authorization: Bearer <your_token>`

## 1. Authentication (Auth)

Mengelola akses masuk dan pendaftaran akun administratif.

| No  | Endpoint               | Method | Akses  | Deskripsi                                  |
| :-- | :--------------------- | :----: | :----: | :----------------------------------------- |
| 1   | `/auth/admin/login`    | `POST` | Publik | Masuk ke akun Admin atau Pemerintah.       |
| 2   | `/auth/admin/register` | `POST` | Admin  | Mendaftarkan akun baru (Hanya oleh Admin). |

## 2. Category (Categories)

Mengelola jenis-jenis laporan infrastruktur.

| No  | Endpoint                   |  Method  | Akses  | Deskripsi                                             |
| :-- | :------------------------- | :------: | :----: | :---------------------------------------------------- |
| 1   | `/categories/public`       |  `GET`   | Publik | Mengambil semua kategori untuk pilihan di form warga. |
| 2   | `/categories/admin/create` |  `POST`  | Admin  | Menambah kategori baru.                               |
| 3   | `/categories/admin/:id`    | `PATCH`  | Admin  | Mengubah nama atau atribut kategori.                  |
| 4   | `/categories/admin/:id`    | `DELETE` | Admin  | Menghapus kategori tertentu.                          |

---

## 3. Laporan (Reports)

Sistem Pelaporan dan Mengelola Laporan.

### Jalur Warga (Public)

| No  | Endpoint                   | Method | Akses  | Deskripsi                                          |
| :-- | :------------------------- | :----: | :----: | :------------------------------------------------- |
| 1   | `/reports/public`          | `GET`  | Publik | Melihat daftar laporan yang sudah di-approve.      |
| 2   | `/reports/public`          | `POST` | Publik | Mengirim laporan (Wajib melampirkan file `image`). |
| 3   | `/reports/public/:id/vote` | `POST` | Publik | Memberikan upvote atau membatalkan upvote.         |

### Jalur Dashboard (Admin)

| No  | Endpoint                    | Method  | Akses | Deskripsi                                          |
| :-- | :-------------------------- | :-----: | :---: | :------------------------------------------------- |
| 1   | `/reports/admin`            |  `GET`  | Admin | Melihat semua laporan (Approved/Rejected/Pending). |
| 2   | `/reports/admin/:id/update` | `PATCH` | Admin | Mengubah status moderasi atau progres perbaikan.   |
