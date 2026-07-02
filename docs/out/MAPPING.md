# Peta Screenshot → Placeholder Dokumen

Semua screenshot diambil dari `localhost` (dev server), konten saja tanpa address bar.
Sumber: `INF2152 - Tugas Kelompok 1 - RPL.docx`. **Halaman web tidak diubah**; hanya
memotret perilaku yang sudah ada. Endpoint REST baru ditambahkan agar dokumentasi
Scalar (`/docs`) mencakup semua endpoint yang disebut di BAB 4.1.2.

Kredensial seed: `admin / admin123` (admin), `user / user123` (pengunjung).

---

## BAB 4.1.2 — Backend (placeholder `<endpoint docs scalar>`)

Path di dokumen hanya contoh; **path asli aplikasi** ada di kolom "Endpoint asli"
(perbarui teks 3.4.2 & 4.1.2 di dokumen agar sesuai). Semua screenshot di
`out/endpoint-docs-scalar/`.

| Bagian dokumen | Path di dokumen (contoh) | Endpoint asli | File screenshot |
|---|---|---|---|
| 4.1.2.1 Registrasi | `POST /register` | `POST /api/auth/register` | `01-post-api-auth-register.png` |
| 4.1.2.2 Login | `POST /login` | `POST /api/auth/login` | `02-post-api-auth-login.png` |
| 4.1.2.3 Dashboard | `GET /dashboard` | `GET /api/dashboard` | `03-get-api-dashboard.png` |
| 4.1.2.4 Coffee Shops — list | `GET /api/coffee-shops/` | `GET /api/coffee-shops` | `04-get-api-coffee-shops.png` |
| 4.1.2.4 Coffee Shops — detail | `GET /api/coffee-shops/{id}` | `GET /api/coffee-shops/{id}` | `05-…` → lihat catatan | 
| 4.1.2.4 Coffee Shops — tambah | `POST /admin/coffee/new` | `POST /api/coffee-shops` | `05-post-api-coffee-shops.png` |
| 4.1.2.4 Coffee Shops — detail | `GET /api/coffee-shops/{id}` | `GET /api/coffee-shops/{id}` | `06-get-api-coffee-shops-id.png` |
| 4.1.2.4 Coffee Shops — ubah | `POST /admin/coffee/{id}` | `PUT /api/coffee-shops/{id}` | `07-put-api-coffee-shops-id.png` |
| 4.1.2.4 Coffee Shops — hapus | `POST /admin/coffee/` | `DELETE /api/coffee-shops/{id}` | `08-delete-api-coffee-shops-id.png` |
| 4.1.2.5 Kriteria — list | `GET /api/criteria/` | `GET /api/criteria` | `09-get-api-criteria.png` |
| 4.1.2.5 Kriteria — ubah bobot | `POST /admin/kriteria/` | `PUT /api/criteria` | `10-put-api-criteria.png` |
| 4.1.2.6 Rekomendasi — opsi | `GET /rekomendasi` | `GET /api/recommendations/options` | `11-get-api-recommendations-options.png` |
| 4.1.2.6 Rekomendasi — hitung | `POST /rekomendasi` | `POST /api/recommendations` | `12-post-api-recommendations.png` |
| 4.1.2.6 Rekomendasi — hasil | `GET /rekomendasi/{id}` | `GET /api/recommendations/{id}` | `13-get-api-recommendations-id.png` |
| 4.1.2.7 Riwayat | `GET /riwayat` | `GET /api/history` | `14-get-api-history.png` |

> Urutan file 04–08 sesuai urutan yang tampil di dokumen: list, tambah, detail,
> ubah, hapus. Gunakan file bernomor sesuai kolom terakhir.

---

## BAB 4.2 — Pengujian (placeholder validasi)

Catatan penting: sebagian validasi (field wajib, format email, panjang password)
ditegakkan oleh **HTML5 di browser** (bubble native), sisanya oleh **server**
(banner merah). Keduanya adalah perilaku web yang sebenarnya.

### 4.2.1 Pengujian Pendaftaran — `out/pengujian-pendaftaran/`
Dokumen sudah punya 2 validasi (field wajib diisi, format email). Tambahan:

| File | Caption saran |
|---|---|
| `01-validasi-nama-terlalu-pendek.png` | Validasi nama minimal 2 karakter (server) |
| `02-validasi-username-terlalu-pendek.png` | Validasi username minimal 3 karakter (server) |
| `03-validasi-username-email-duplikat.png` | Validasi username/email sudah terdaftar (server) |
| `04-validasi-password-minimal-6.png` | Validasi password minimal 6 karakter (HTML5 `minLength`) |
| `05-pendaftaran-sukses-dashboard.png` | Pendaftaran berhasil → diarahkan ke dashboard pengguna |

### 4.2.2 Pengujian Login Admin — `out/pengujian-login-admin/`
| File | Caption saran |
|---|---|
| `01-kredensial-salah.png` | Login ditolak saat kredensial salah |
| `02-login-sukses-dashboard-admin.png` | Login admin berhasil → diarahkan ke dashboard admin (`/admin`) |

### 4.2.3 Pengujian Dashboard Admin — `out/pengujian-dashboard-admin/`
| File | Caption saran |
|---|---|
| `01-guard-tanpa-login-dialihkan-ke-login.png` | Akses `/admin` tanpa login → dialihkan ke `/login` (URL akhir: `/login?next=/admin`) |
| `02-tampilan-statistik.png` | Tampilan dashboard admin: jumlah coffee shop, kriteria, pengguna, sesi rekomendasi |
| `03-guard-visitor-dialihkan-ke-dashboard.png` | Pengunjung mengakses `/admin` → dialihkan ke `/dashboard` (URL akhir: `/dashboard`) |

### 4.2.4 Pengujian Pengelolaan Coffee Shop — `out/pengujian-pengelolaan-coffee-shop/`
| File | Caption saran |
|---|---|
| `01-daftar-coffee-shop.png` | Daftar coffee shop yang sudah ada |
| `02-tambah-validasi-nama.png` | Validasi nama minimal 2 karakter saat menambah data |
| `03-tambah-sukses.png` | Data baru ("Kopi Uji Coba") berhasil ditambahkan ke daftar |
| `04-ubah-sukses.png` | Data berhasil diubah ("Kopi Uji Coba (Diperbarui)", WiFi 25) |
| `05-hapus-sukses.png` | Data berhasil dihapus (baris "Kopi Uji Coba" hilang) |

### 4.2.5 Pengujian Pengaturan Kriteria — `out/pengujian-pengaturan-kriteria/`
| File | Caption saran |
|---|---|
| `01-total-tidak-100-tombol-disabled.png` | Total bobot ≠ 100% → ditandai merah & tombol Simpan nonaktif |
| `02-simpan-sukses.png` | Total 100% → bobot berhasil disimpan ("Bobot default tersimpan.") |

### 4.2.6 Pengujian Login Pengguna — `out/pengujian-login-pengguna/`
| File | Caption saran |
|---|---|
| `01-kredensial-salah.png` | Login ditolak saat kredensial salah |
| `02-login-sukses-dashboard.png` | Login pengunjung berhasil → diarahkan ke dashboard (`/dashboard`) |

### 4.2.7 Pengujian Dashboard Pengguna — `out/pengujian-dashboard-pengguna/`
| File | Caption saran |
|---|---|
| `01-guard-tanpa-login-dialihkan-ke-login.png` | Akses `/dashboard` tanpa login → dialihkan ke `/login` (URL akhir: `/login?next=/dashboard`) |
| `02-tampilan-dashboard.png` | Tampilan dashboard pengunjung (menu rekomendasi, riwayat, daftar coffee shop) |

### 4.2.8 Pengujian Detail Coffee Shop — `out/pengujian-detail-coffee-shop/`
| File | Caption saran |
|---|---|
| `01-detail-coffee-shop.png` | Detail coffee shop + tabel skor evaluasi MFEP per kriteria |
| `02-id-tidak-ada-404.png` | ID tidak ada → halaman 404 (not found) |

### 4.2.9 Pengujian Pembuatan Rekomendasi — `out/pengujian-pembuatan-rekomendasi/`
| File | Caption saran |
|---|---|
| `01-tanpa-kriteria-tombol-disabled.png` | Tidak ada kriteria dipilih → tombol nonaktif & pesan "Pilih minimal satu kriteria." |
| `02-hasil-ranking.png` | Hasil perhitungan MFEP: peringkat coffee shop beserta Total WE |

### 4.2.10 Pengujian Riwayat Rekomendasi — `out/pengujian-riwayat-rekomendasi/`
| File | Caption saran |
|---|---|
| `01-riwayat-kosong.png` | Belum ada riwayat ("Belum ada riwayat.") |
| `02-riwayat-terisi.png` | Daftar riwayat rekomendasi yang pernah dibuat |

---

## Catatan
- Screenshot Scalar memakai tema terang (light mode) agar terbaca di dokumen cetak.
  Contoh `curl` di panel kanan menampilkan `localhost:3001` (bagian dari isi dokumen API,
  bukan address bar) — ubah `servers` di `lib/openapi.ts` bila ingin URL lain.
- Redirect guard (4.2.3, 4.2.7) tidak menampilkan address bar; URL akhir dicantumkan di caption.
- `04-validasi-password-minimal-6.png` menampilkan bubble validasi bawaan browser (teks Inggris),
  karena input password memakai atribut HTML5 `minLength=6`.
- Data uji dipulihkan: coffee shop "Kopi Uji Coba" sudah dihapus, bobot kriteria kembali ke
  20/10/15/10/15/15/15. Akun pengunjung baru & 1 sesi rekomendasi tetap tersimpan sebagai
  bukti pengujian fitur pendaftaran & rekomendasi.
