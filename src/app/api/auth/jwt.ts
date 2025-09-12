import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";
const ISSUER = "your-app";
const AUDIENCE = "your-app-clients";
const TOKEN_COOKIE = "token";

export const JWT_COOKIE_NAME = TOKEN_COOKIE;
function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return new TextEncoder().encode(secret);
}

export type JwtPayload = {
  sub: string; // userId
  role: "Admin" | "Author" | "User";
  username: string;
  email?: string; 
  provider?: string;
};

export async function signAccessToken(payload: JwtPayload, expiresIn = "1d") {
  // expiresIn examples: '1h', '1d'. Jose accepts numeric seconds too.
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({
    role: payload.role,
    username: payload.username,
    email: payload.email || "",
    provider: payload.provider || "credentials",
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(expiresIn)
    .sign(getSecretKey());
  return token;
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  return payload as unknown as JwtPayload & { iat: number; exp: number };
}

export function buildAuthCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  return `${JWT_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${
    isProd ? "Secure;" : ""
  }`;
}

export function clearAuthCookie() {
  const isProd = process.env.NODE_ENV === "production";
  return `${JWT_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${
    isProd ? "Secure;" : ""
  }`;
}