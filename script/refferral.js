const fs = require("fs");
const path = require("path");
const axios = require("axios");
const readline = require("readline-sync");
const { getTempEmail, getVerificationCode } = require("../utils/tempMail");

const API_BASE_URL = "https://cognito-idp.ap-northeast-1.amazonaws.com";
const CLIENT_ID = "5msns4n49hmg3dftp2tp1t2iuh";

const PASSWORD = readline.question("Password Akun : ");
const REFERRAL = readline.question("Reff : ");
const MAX_ACCOUNTS = parseInt(readline.question("Jumlah Reff : "), 10);

const ACCOUNTS_FILE = path.join(__dirname, `../res/${REFERRAL}.txt`);

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getHeaders = (target) => ({
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "x-amz-user-agent":
    "aws-amplify/6.12.1 auth/2 framework/2 Authenticator ui-react/6.9.0",
  "sec-ch-ua-platform": '"Windows"',
  "cache-control": "no-store",
  "sec-ch-ua":
    '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133")',
  "sec-ch-ua-mobile": "?0",
  "x-amz-target": target,
  "content-type": "application/x-amz-json-1.1",
  origin: "https://app.stork.network",
  "sec-fetch-site": "cross-site",
  "sec-fetch-mode": "cors",
  "sec-fetch-dest": "empty",
  referer: "https://app.stork.network/",
  "accept-language": "en-US,en;q=0.9",
  priority: "u=1, i",
});

const registration = async (email) => {
  const data = {
    Username: email,
    Password: PASSWORD,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "custom:referral_code", Value: REFERRAL },
    ],
    ClientId: CLIENT_ID,
  };

  try {
    const response = await axios.post(API_BASE_URL, data, {
      headers: getHeaders("AWSCognitoIdentityProviderService.SignUp"),
      http2: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error saat registrasi:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const confirmSignUp = async (username, confirmationCode) => {
  const data = {
    Username: username,
    ConfirmationCode: confirmationCode,
    ClientId: CLIENT_ID,
  };

  try {
    const response = await axios.post(API_BASE_URL, data, {
      headers: getHeaders("AWSCognitoIdentityProviderService.ConfirmSignUp"),
    });
    console.log("✅ Konfirmasi sukses");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error saat konfirmasi:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const resendCode = async (email) => {
  const data = { Username: email, ClientId: CLIENT_ID };

  try {
    const response = await axios.post(API_BASE_URL, data, {
      headers: getHeaders(
        "AWSCognitoIdentityProviderService.ResendConfirmationCode"
      ),
      http2: true,
    });
    console.log("✅ Kode verifikasi berhasil dikirim ulang");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error saat mengirim ulang kode:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const saveAccount = (email, password) => {
  const accountData = `${email} || ${password}\n`;

  fs.appendFile(ACCOUNTS_FILE, accountData, (err) => {
    if (err) {
      console.error("❌ Gagal menyimpan akun:", err);
    } else {
      console.log(`📁 Akun berhasil disimpan:`, email);
    }
  });
};

(async () => {
  for (let i = 0; i < MAX_ACCOUNTS; i++) {
    console.log(`\n📃 Reff : ${REFERRAL}`);
    try {
      let tempMail = await getTempEmail();
      console.log(`📩 Email : ${tempMail.email}`);

      const resRegistration = await registration(tempMail.email);
      console.log("✅ Registrasi sukses");

      if (!resRegistration) {
        console.log("⏭️ Gagal registrasi, coba lagi...");
        continue;
      }

      await delay(2000);

      let otpStatus = true;
      let attempts = 0;

      while (otpStatus && attempts < 10) {
        let otpCode = await getVerificationCode(tempMail.email);

        if (otpCode) {
          otpStatus = false;
          console.log(`✅ OTP ditemukan: ${otpCode}`);

          await confirmSignUp(tempMail.email, otpCode);

          saveAccount(tempMail.email, PASSWORD);
          await delay(1000);
        } else {
          console.log("⌛ Menunggu OTP...");
          await delay(5000);
          attempts++;
        }

        if (attempts >= 10) {
          console.log("🔄 OTP tidak ditemukan, mengirim ulang kode...");
          await resendCode(tempMail.email);
          attempts = 0;
        }
      }
    } catch (error) {
      console.error("⚠️ Error dalam proses registrasi:", error.message);
    }

    await delay(3500);
  }
})();
