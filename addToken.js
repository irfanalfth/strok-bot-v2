const fs = require("fs");
const readline = require("readline-sync");

const FILE_NAME = "token.json";

// Cek apakah file token.json ada, jika tidak buat file baru
if (!fs.existsSync(FILE_NAME)) {
  fs.writeFileSync(FILE_NAME, "[]", "utf-8");
}

// Baca data dari token.json
const rawData = fs.readFileSync(FILE_NAME, "utf-8");
let tokens = JSON.parse(rawData);

// Ambil input dari pengguna
const token = readline.question("Masukkan token: ");
const refreshToken = readline.question("Masukkan refreshToken: ");

// Tambahkan token baru ke array
tokens.push({ token, refreshToken });

// Simpan kembali ke token.json
fs.writeFileSync(FILE_NAME, JSON.stringify(tokens, null, 2), "utf-8");

console.log("Token berhasil disimpan!");
