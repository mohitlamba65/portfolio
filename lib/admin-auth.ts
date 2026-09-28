import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

/** Server-only: admin password from environment (never hardcode defaults). */
export function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value ? value : null;
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword() !== null;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  const expected = getAdminPassword();
  if (!expected || !token) return false;
  const provided = Buffer.from(token.trim());
  const secret = Buffer.from(expected);
  if (provided.length !== secret.length) return false;
  return timingSafeEqual(provided, secret);
}

export function isAuthorizedAdminRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return verifyAdminToken(token);
}
