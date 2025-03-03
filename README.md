# Stork BOT v2

Terima kasih kepada [isansut](https://github.com/isansut/Strok-BOT).

## Persyaratan

Sebelum menjalankan skrip, pastikan Anda telah menginstal dependensi berikut:

- **Node.js** (v14 atau lebih baru)
- **Paket-paket NPM**:
  - `axios`
  - `fs`
  - `user-agents`
  - `aws-sdk`
  - `cheerio`
  - `@aws-sdk/client-cognito-identity-provider`
  - `@faker-js/faker`

Untuk menginstalnya, jalankan perintah berikut di terminal:

```sh
npm install
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

Untuk mode pengembangan dengan **hot reload**, jalankan:

```sh
npm run dev
```

## Catatan Penting

- Skrip ini berjalan dalam **loop tak terbatas**. Untuk menghentikan eksekusi, tekan `Ctrl + C`.
- Jika terjadi error seperti `403 Forbidden` atau `invalid token`, pastikan token masih valid dan endpoint API masih aktif.
- Untuk menghindari pemblokiran IP, gunakan **delay yang lebih panjang** di dalam loop utama.
