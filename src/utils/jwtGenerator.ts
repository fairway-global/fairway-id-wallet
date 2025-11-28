import { importJWK, SignJWT } from "jose";

export const generateSignedJwt = async () => {
  const {
    NEXT_APP_CLIENT_ID,
    NEXT_APP_TOKEN_ENDPOINT,
    NEXT_APP_PRIVATE_KEY_BASE64,
  } = process.env;

  if (!NEXT_APP_CLIENT_ID) {
    throw new Error("NEXT_APP_CLIENT_ID environment variable is required");
  }

  if (!NEXT_APP_TOKEN_ENDPOINT) {
    throw new Error("NEXT_APP_TOKEN_ENDPOINT environment variable is required");
  }

  if (!NEXT_APP_PRIVATE_KEY_BASE64) {
    throw new Error(
      "NEXT_APP_PRIVATE_KEY_BASE64 environment variable is required"
    );
  }

  const header = { alg: "RS256", typ: "JWT" };

  const payload = {
    iss: NEXT_APP_CLIENT_ID,
    sub: NEXT_APP_CLIENT_ID,
    aud: NEXT_APP_TOKEN_ENDPOINT,
  };

  const jwkJson = Buffer.from(NEXT_APP_PRIVATE_KEY_BASE64, "base64").toString();
  const jwk = JSON.parse(jwkJson);
  const privateKey = await importJWK(jwk, "RS256");

  return await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privateKey);
};
