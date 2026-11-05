# JEJAK · Jelajah Etika, Jejak, dan Aksi Kampanye digital

Web pembelajaran **Modul 3 Informatika & KKA Kelas IX** (gabungan) SMP Labschool Jakarta.
Satu web untuk 6 pertemuan, berisi kegiatan interaktif, tugas, pre/post-test, dan tiket keluar. Semua jawaban murid masuk ke **Google Sheet** guru.

Penyusun: Ramli Jainal Muttaqin, S.Pd.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Seluruh web (tampilan, data kegiatan, logika). Cukup satu file. |
| `apps-script/Code.gs` | Kode penerima jawaban di Google Sheet + rekap untuk mode guru. |
| `README.md` | Panduan ini. |

## Status pertemuan

| Pertemuan | Judul | Status |
|---|---|---|
| P1 | Jejakku, Citraku | **Lengkap**: pre-test, sortir 24 Jam Raka, Detektif Jejak, Jadi Algoritma, Audit Jejakku, post-test, tiket keluar, wawancara keluarga |
| P2 | Jejak Positif & Brief Kreatif | Kerangka + tiket keluar |
| P3 | Stop Perundungan Digital | Kerangka + tiket keluar |
| P4 | Produksi Audio & Video | Kerangka + tiket keluar |
| P5 | Integrasi & Peer Review | Kerangka + tiket keluar |
| P6 | Luncurkan Kampanye | Kerangka + tiket keluar |

Kegiatan berlabel "Segera" diisi bertahap.

---

## Langkah 1 · Siapkan Google Sheet dan Apps Script

1. Buka **sheets.google.com** dengan akun Google Bapak (disarankan akun pribadi/gmail, karena akun sekolah kadang membatasi akses "Siapa saja").
2. Buat spreadsheet kosong, beri nama **JEJAK Modul 3 – Jawaban Murid**.
3. Menu **Ekstensi → Apps Script**. Tab baru terbuka.
4. Hapus semua isi `Code.gs`, lalu tempel seluruh isi file `apps-script/Code.gs`.
5. Pada baris `const KUNCI_GURU = 'ganti-dengan-kunci-rahasia';` ganti isinya dengan kata sandi pilihan Bapak, misalnya `'labschool-jejak-2026'`. **Jangan bagikan ke murid.**
5b. Buat tab baru bernama **Murid** di Google Sheet dengan kolom `Kelas | Absen | Nama` (contoh: `IX-A | 1 | Raka Pratama`), lalu salin daftar murid dari daftar hadir. **Jangan menaruh daftar murid di GitHub** karena repo bersifat publik.
6. Tekan ikon **Simpan** (disket).
7. Di bilah atas, pilih fungsi **siapkan**, lalu tekan **Jalankan**.
   - Muncul jendela izin → **Tinjau izin** → pilih akun Bapak → **Lanjutan** → **Buka JEJAK (tidak aman)** → **Izinkan**. Ini normal untuk skrip buatan sendiri.
   - Kembali ke spreadsheet: sekarang ada tab **Jawaban** dan tab **KodeKelas** berisi kode 4 huruf untuk tiap kelas (dibuat otomatis dari tab Murid). Jika menambah kelas baru di tab Murid, jalankan `siapkan` lagi.

## Langkah 2 · Terapkan sebagai Aplikasi Web

1. Di Apps Script, tekan **Terapkan → Deployment baru**.
2. Tekan ikon roda gigi di samping "Pilih jenis" → pilih **Aplikasi web**.
3. Isi:
   - Deskripsi: `JEJAK v1`
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
4. Tekan **Terapkan**, lalu **salin URL aplikasi web** (berakhiran `/exec`).
5. Uji: tempel URL itu di tab baru. Jika muncul `{"ok":true,"pesan":"JEJAK aktif"}`, berarti berhasil.

> **Penting:** setiap kali `Code.gs` diubah, buka **Terapkan → Kelola deployment → ikon pensil → Versi: Versi baru → Terapkan**. URL tetap sama.

## Langkah 3 · Sambungkan web ke Sheet

1. Buka `index.html` dengan editor teks (Notepad / VS Code).
2. Cari baris:
   ```js
   const CONFIG = { APPS_SCRIPT_URL: '' };
   ```
3. Tempel URL dari Langkah 2 di antara tanda kutip:
   ```js
   const CONFIG = { APPS_SCRIPT_URL: 'https://script.google.com/macros/s/XXXX/exec' };
   ```
4. Simpan.

Selama URL masih kosong, web berjalan dalam **mode coba**: jawaban hanya tersimpan di perangkat yang dipakai.

## Langkah 4 · Terbitkan di GitHub Pages

1. Masuk ke **github.com** (akun `ramli-labs`), tekan **New repository**, beri nama `jejak`, pilih **Public**, lalu **Create repository**.
2. Tekan **uploading an existing file**, seret `index.html`, `README.md`, dan folder `apps-script`, lalu **Commit changes**.
3. Buka **Settings → Pages**. Di "Branch", pilih `main` dan folder `/ (root)`, lalu **Save**.
4. Tunggu 1–2 menit. Web aktif di `https://ramli-labs.github.io/jejak/`.
5. Bagikan tautan itu (atau QR-nya) ke murid lewat Google Classroom atau PID.

## Langkah 5 · Uji sebelum dipakai di kelas

1. Buka web, pilih kelas IX-A, ketik kode kelas IX-A (lihat tab KodeKelas atau tombol **Kode kelas** di mode guru), tekan **Tampilkan daftar nama**, lalu pilih satu nama.
2. Kerjakan satu kegiatan (misalnya Tiket Keluar) lalu tekan **Kirim ke guru**. Harus muncul tulisan hijau "Terkirim ke guru".
3. Buka Google Sheet → sheet **Jawaban**: baris baru harus muncul.
4. Di web, tekan **Guru** (pojok kanan atas) → isi URL dan kunci guru → pilih kelas IX-A, P1, kegiatan yang tadi → **Tampilkan rekap**.
5. Hapus baris uji di Sheet bila sudah selesai.

---

## Cara pakai di kelas

**Murid**
- Guru menayangkan kode kelas di PID (mode guru → **Kode kelas**).
- Murid membuka tautan, memilih kelas, mengetik kode kelas, menekan **Tampilkan daftar nama**, lalu memilih namanya sendiri dan nomor kelompok.
- Jika nama tidak ada atau internet bermasalah, ada pilihan **Namaku tidak ada** untuk mengisi nama dan absen secara manual.
- Pilih pertemuan → kerjakan kegiatan berurutan → tekan **Kirim ke guru** di setiap kegiatan.
- Kegiatan **kelompok** cukup dikirim oleh satu anggota. Pengirim **mencentang nama teman sekelompoknya**, lalu jawaban otomatis tercatat untuk semua anggota. Di komputer anggota lain muncul tanda "Sudah dikirim oleh kelompokmu".
- Komputer lab dipakai bergantian: setelah selesai, tekan nama di pojok kanan atas → **Ganti murid**.
- Jika internet putus, jawaban disimpan dan dikirim ulang otomatis. Tombol oranye "belum terkirim" bisa ditekan untuk mengirim ulang.

**Guru**
- Tombol **Guru** → pilih kelas, pertemuan, kegiatan → **Tampilkan rekap**.
- Centang **Tampilan besar (PID)** untuk menayangkan rekap di papan interaktif.
- Rekap menampilkan kiriman **terbaru** tiap murid, rerata skor, (untuk Audit) jumlah murid per zona, dan daftar **Belum mengerjakan** bila satu kelas dipilih.
- Tombol **Kode kelas** menampilkan kode tiap kelas dalam huruf besar untuk ditayangkan.
- **Post-test** dan **wawancara** dinilai manual: isi kolom **Skor** langsung di Google Sheet; rekap ikut berubah.

## Privasi

- **Audit Jejakku**: jawaban tiap butir tidak pernah dikirim atau disimpan. Yang dikirim hanya skor, zona, jalur, dan rencana tindakan.
- Akun @raka.ix, nama Raka, dan "SMP Harapan Bangsa" adalah fiktif.
- Web tidak meminta data selain nama, kelas, absen, dan nomor kelompok.
- Daftar nama murid hanya tersimpan di Google Sheet guru dan hanya bisa diambil dengan kode kelas yang benar. NIS/NISN tidak dipakai.

## Mengubah isi

Semua data ada di bagian `DATA MODUL` di `index.html`:
- `PERTEMUAN` – judul, tujuan, daftar kegiatan tiap pertemuan. Kegiatan tanpa `r:` tampil sebagai "Segera".
- `KARTU`, `POSTS`, `LOG`, `KANDIDAT`, `AUDIT` – isi kegiatan Pertemuan 1.
- `KELAS` – daftar kelas (`IX-A` … `IX-G`) untuk formulir identitas dan mode guru.
