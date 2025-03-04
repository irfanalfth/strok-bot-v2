const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");

console.log("File yang akan diubah harus berada sama dengan index.js");

const fileName = readline.question("Masukkan nama file : ");
const filePath = path.join(__dirname, `../${fileName}`);

if (!fs.existsSync(filePath)) {
  console.error("❌ File tidak ditemukan!");
  process.exit(1);
}

fs.readFileSync(filePath, "utf8");

// Meminta teks baru untuk menggantikan seluruh isi file
const newContent = readline.question(
  "Masukkan teks baru untuk menggantikan seluruh isi file :\n"
);

// Simpan teks baru ke file
fs.writeFileSync(filePath, newContent, "utf8");

console.log(
  "\n✅ Perubahan berhasil disimpan! Isi file telah diganti sepenuhnya."
);
