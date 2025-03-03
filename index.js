const axios = require("axios");
const fs = require("fs");
const userAgent = require("user-agents");
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const API_BASE_URL = "https://app-api.jp.stork-oracle.network/v1";
const CLIENT_ID = "5msns4n49hmg3dftp2tp1t2iuh";
const REGION = "ap-northeast-1"; // Pastikan region sesuai dengan AWS Cognito Anda

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

const readTokens = () =>
  JSON.parse(fs.readFileSync("token.json", "utf-8").trim());

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateHeaders = (authToken) => ({
  Authorization: `Bearer ${authToken.replace("Bearer ", "").trim()}`,
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  "User-Agent": new userAgent().toString(),
  "Content-Type": "application/json",
});

const updateTokenJson = (oldToken, newToken) => {
  try {
    const filePath = "token.json";
    const tokens = readTokens();

    let tokenFound = false;
    const updatedTokens = tokens.map((tokenObj) =>
      tokenObj.token === oldToken
        ? ((tokenFound = true), { ...tokenObj, token: newToken })
        : tokenObj
    );

    if (!tokenFound) return console.log(`Token ${oldToken} tidak ditemukan!`);

    fs.writeFileSync(filePath, JSON.stringify(updatedTokens, null, 2), "utf-8");
    console.log(`🔄 Token diperbarui: ${oldToken} ➝ ${newToken}`);
  } catch (error) {
    console.error("Gagal memperbarui token:", error);
  }
};

const fetchMe = async (authToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: generateHeaders(authToken),
    });

    return {
      email: response.data.data.email || "Unknown Email",
      validCount:
        response.data.data.stats?.stork_signed_prices_valid_count || 0,
    };
  } catch (error) {
    console.error(
      "❌ Error fetching user info:",
      error.response?.data || error.message
    );
    throw new Error("Token expired or invalid");
  }
};

const getNewToken = async (refreshToken) => {
  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: { REFRESH_TOKEN: refreshToken },
  };

  try {
    console.log("🔄 Refreshing token...");
    const command = new InitiateAuthCommand(params);
    const result = await cognitoClient.send(command);

    console.log("✅ Token refreshed successfully!");
    return result.AuthenticationResult.AccessToken;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    throw error;
  }
};

const fetchPrices = async (authToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stork_signed_prices`, {
      headers: generateHeaders(authToken),
    });

    const data = response.data.data;
    const firstAssetKey = Object.keys(data)[0];
    return data[firstAssetKey]?.timestamped_signature?.msg_hash;
  } catch (error) {
    console.error(
      "❌ Error fetching prices:",
      error.response?.data || error.message
    );
    return null;
  }
};

const validatePrice = async (authToken, msgHash) => {
  try {
    await axios.post(
      `${API_BASE_URL}/stork_signed_prices/validations`,
      { msg_hash: msgHash, valid: true },
      { headers: generateHeaders(authToken) }
    );

    console.log("✅ Validate success");
  } catch (error) {
    console.error(
      "❌ Error validating data:",
      error.response?.data || error.message
    );
  }
};

const runAccount = async (authToken, refreshToken, index) => {
  console.log(`\n---- Account Ke-${index + 1} ------`);

  try {
    const { email, validCount } = await fetchMe(authToken);
    console.log(`📧 ${email}`);
    console.log("⏳ Mengambil data sign...");
    const msgHash = await fetchPrices(authToken);

    if (msgHash) {
      console.log(`🔹 Validating`);
      await validatePrice(authToken, msgHash);
    }

    console.log(`✅ Verified messages: ${validCount}`);
  } catch (error) {
    if (error.message.includes("Token expired")) {
      console.log("🔄 Token expired, refreshing...");
      try {
        const newToken = await getNewToken(refreshToken);
        updateTokenJson(authToken, newToken);
        await runAccount(newToken, refreshToken, index);
      } catch (refreshError) {
        console.error("❌ Gagal mendapatkan token baru, melewati akun ini.");
      }
    }
  }

  console.log(`---- End of Account ${index + 1} ------`);
};

(async () => {
  while (true) {
    const tokens = readTokens();

    for (let i = 0; i < tokens.length; i++) {
      await runAccount(tokens[i].token, tokens[i].refreshToken, i);
      await delay(3500);
    }
  }
})();
