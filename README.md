# Stork BOT v2

Terima kasih kepada [isansut](https://github.com/isansut/Strok-BOT).

## 🔹 Persyaratan

Sebelum menjalankan skrip, pastikan Anda telah menginstal dependensi berikut:

- **Node.js** (v14 atau lebih baru)
- **Paket NPM** yang diperlukan:
  - `axios`
  - `fs`
  - `user-agents`
  - `aws-sdk`
  - `cheerio`
  - `@aws-sdk/client-cognito-identity-provider`
  - `@faker-js/faker`
  - `puppeteer`
  - `inquirer`
  - `readline-sync`

Untuk menginstalnya, jalankan perintah berikut di terminal:

```sh
npm install
```

## 🔹 Cara Menjalankan Skrip

1. Pastikan Anda berada di direktori skrip.
2. Jalankan perintah berikut untuk memulai bot dengan menu interaktif:

   ```sh
   node index.js
   ```

3. Pilih salah satu opsi yang tersedia di menu:

   - **Auto Reff & Generate** → Menjalankan skrip referral otomatis.
   - **Auto Get Token** → Mengambil token secara otomatis.
   - **Auto Verify Message** → Memverifikasi pesan secara otomatis.
   - **Add Token** → Menambahkan token baru ke dalam file.
   - **Replace Semua Text** → Mengganti seluruh teks dalam file tertentu.

## 🔹 **Fitur Replace Semua Text**

Opsi **Replace Semua Text** memungkinkan pengguna untuk mengganti isi file **secara keseluruhan** atau hanya mengganti teks tertentu.

Format file yang didukung:  
✅ `.json` ✅ `.txt` ✅ `.js` ✅ File teks lainnya.

Untuk menjalankan fitur ini secara langsung tanpa menu, gunakan:

```sh
node script/replaceAll.js
```
