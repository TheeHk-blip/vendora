import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export const getMpesaAccessToken = async () => {
  const currentTime = Date.now();

  if (cachedToken && currentTime < tokenExpiry - 60000) {
    console.log("using cached M-Pesa token");
    return cachedToken;
  }

  console.log ("Fetching new M-Pesa token from Safaricom...")
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",      
      { headers: { Authorization: `Basic ${auth}`} }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = currentTime + parseInt(response.data.expires_in) * 1000;

    return cachedToken;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("M-Pesa Auth Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Safaricom", error);
  }
}