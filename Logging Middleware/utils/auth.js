import dotenv from "dotenv";
dotenv.config();

let cachedToken = null;
let tokenExpiry = null;

export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000); // in seconds

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("http://20.244.56.144/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "rehanpathan8012@gmail.com",
      name: "Pathan Rehan Shakil Khan",
      rollNo: "12210067",
      accessCode: "CZypQK",
      clientID: "886913d8-4939-48ea-b04e-2f731c0f6b0e",
      clientSecret: "XMfnUgMctaHqymNx",
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.statusText}`);
  }

  const data = await response.json();
  cachedToken = data["access_token"];
  tokenExpiry = data["expires_in"]; // Already epoch time

  return cachedToken;
}
