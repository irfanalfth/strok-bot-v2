# Stork BOT v2

Thanks to [isansut](https://github.com/isansut/Strok-BOT)

## Deskripsi

Skrip ini digunakan untuk mengambil harga terbaru dari API Stork Oracle, melakukan validasi harga, dan memperbarui token jika sudah kedaluwarsa. Skrip ini berjalan secara otomatis dan akan menangani beberapa akun yang terdapat dalam file `token.json`.

## Persyaratan

Sebelum menjalankan skrip, pastikan Anda telah menginstal beberapa dependensi berikut:

- Node.js (v14 atau lebih baru)
- Paket-paket NPM:
  - `axios`
  - `fs`
  - `user-agents`
  - `aws-sdk`

Untuk menginstalnya, jalankan perintah berikut di terminal:

```sh
npm install axios fs user-agents aws-sdk
```

## Konfigurasi

Sebelum menjalankan skrip, pastikan file `token.json` berisi data token dalam format berikut:

```json
[
  { "token": "TOKEN_1", "refreshToken": "REFRESH_TOKEN_1" },
  { "token": "TOKEN_2", "refreshToken": "REFRESH_TOKEN_2" }
]
```

## Cara Menjalankan Skrip

1. Pastikan Anda berada di direktori skrip.
2. Jalankan perintah berikut di terminal:
   ```sh
   npm start
   ```
3. Skrip akan mulai berjalan dan secara otomatis menangani validasi harga serta pembaruan token jika diperlukan.

## Catatan

- Skrip ini berjalan dalam **loop tak terbatas**, jadi jika ingin menghentikan eksekusi, gunakan kombinasi tombol `Ctrl + C`.
- Jika terjadi error seperti `403 Forbidden` atau `invalid token`, pastikan token masih valid dan endpoint API masih aktif.
- Untuk menghindari pemblokiran IP, Anda dapat **menggunakan delay yang lebih panjang** di dalam loop utama.
