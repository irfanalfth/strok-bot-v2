const axios = require("axios");

const getVerificationCode = async (email) => {
  const url = `https://api.internal.temp-mail.io/api/v3/email/${email}/messages`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "application-name": "web",
    "sec-ch-ua-platform": '"Windows"',
    "application-version": "4.0.0",
    "x-cors-header": "iaWg3pchvFx48fY",
    "sec-ch-ua":
      '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133")',
    "sec-ch-ua-mobile": "?0",
    "content-type": "application/json",
    origin: "https://temp-mail.io",
    "sec-fetch-site": "same-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://temp-mail.io/",
    "accept-language": "id-ID,id;q=0.9",
    priority: "u=1, i",
    Cookie:
      "_ga=GA1.1.1920310232.1741024496; _ga_3DVKZSPS3D=GS1.1.1741024495.1.1.1741025397.60.0.0",
  };

  try {
    const response = await axios.get(url, { headers });

    if (response.data.length === 0) {
      return null;
    }

    const latestMessage = response.data[0]; // Ambil pesan terbaru
    const match = latestMessage.body_text.match(/\b\d{6}\b/); // Cari kode 6 digit

    if (match) {
      return match[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "❌ Terjadi kesalahan saat mengambil pesan:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const getTempEmail = async () => {
  const url = "https://api.internal.temp-mail.io/api/v3/email/new";

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Content-Type": "application/json",
    "application-name": "web",
    "sec-ch-ua-platform": '"Windows"',
    "application-version": "4.0.0",
    "x-cors-header": "iaWg3pchvFx48fY",
    "sec-ch-ua":
      '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133")',
    "sec-ch-ua-mobile": "?0",
    origin: "https://temp-mail.io",
    "sec-fetch-site": "same-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://temp-mail.io/",
    "accept-language": "id-ID,id;q=0.9",
    priority: "u=1, i",
    Cookie:
      "_ga=GA1.1.1920310232.1741024496; _ga_3DVKZSPS3D=GS1.1.1741024495.1.1.1741025397.60.0.0",
  };

  const data = { min_name_length: 10, max_name_length: 10 };

  try {
    const response = await axios.post(url, data, { headers, http2: true });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Terjadi kesalahan saat membuat email sementara:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

module.exports = { getVerificationCode, getTempEmail };
