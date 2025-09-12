import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyAccessToken } from "./jwt";
import { hasRole, Role } from "./roles";

export type AuthContext = {
  userId: string;
  role: Role;
  username: string;
  email?: string;
  provider?: string;
};

export async function getAuthContext(
  req: NextRequest
): Promise<AuthContext | null> {
  const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return {
      userId: payload.sub,
      role: payload.role,
      username: payload.username,
      email: payload.email,
      provider: payload.provider,
    };
  } catch (e) {
    return null;
  }
}

export function requireRole(allowed: Role | Role[]) {
  return async (req: NextRequest): Promise<AuthContext | Response> => {
    const ctx = await getAuthContext(req);
    if (!ctx || !hasRole(ctx.role, allowed)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }
    return ctx;
  };
}

// Helper: send JSON
export function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}
