const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");

const REFERRAL = readline.question("File Name: ");
const TOKEN_FILE = path.join(__dirname, `../data/${REFERRAL}.json`);
const REFF_FILE = path.join(__dirname, `../data/${REFERRAL}.txt`);

const saveToken = (email, token, refreshToken) => {
  let tokens = [];

  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const fileContent = fs.readFileSync(TOKEN_FILE, "utf8");
      tokens = JSON.parse(fileContent);
    }
  } catch (err) {
    console.error("❌ Gagal membaca file token:", err);
  }

  tokens.push({ email, token, refreshToken });

  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    console.log(`📁 Token untuk ${email} berhasil disimpan!`);
  } catch (err) {
    console.error("❌ Gagal menyimpan token:", err);
  }
};

const readAccounts = () => {
  try {
    const data = fs.readFileSync(REFF_FILE, "utf8");
    return data
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [email, password] = line.split("||");
        return { email: email.trim(), password: password.trim() };
      });
  } catch (err) {
    console.error("❌ Gagal membaca file:", err);
    return [];
  }
};

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAuthToken = async (email, password) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  let authToken = null;

  page.on("response", async (response) => {
    try {
      const url = response.url();
      const tokenData = JSON.parse(await response.text());

      if (
        url === "https://cognito-idp.ap-northeast-1.amazonaws.com/" &&
        tokenData.AuthenticationResult
      ) {
        authToken = tokenData.AuthenticationResult;
      }
    } catch (error) {}
  });

  await page.goto(
    "https://app.stork.network/login?redirect_uri=https%3A%2F%2Fknnliglhgkmlblppdejchidfihjnockl.chromiumapp.org%2F",
    { waitUntil: "networkidle2" }
  );

  await page.type("#amplify-id-\\:r2\\:", email);
  await delay(1000);
  await page.type("#amplify-id-\\:r5\\:", password);
  await delay(1000);
  await page.keyboard.press("Enter");

  await delay(3000);
  await browser.close();

  return authToken;
};

(async () => {
  const accounts = readAccounts();

  console.log(`\n📃 Total akun: ${accounts.length}\n`);

  for (const account of accounts) {
    console.log(`🔄 Memproses akun: ${account.email}`);

    const token = await getAuthToken(account.email, account.password);

    if (token.AccessToken && token.RefreshToken) {
      saveToken(account.email, token.AccessToken, token.RefreshToken);
    } else {
      console.error(`❌ Gagal mendapatkan token untuk ${account.email}`);
    }
  }

  console.log("✅ Selesai memproses semua akun.");
})();
