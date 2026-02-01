interface JwtPayload {
  exp?: number;
  sub?: string | number;
  id?: string | number;
  userId?: number;
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const parseUserId = (value: string | number | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export const getUserIdFromToken = (token: string): number | null => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return parseUserId(payload.userId ?? payload.sub ?? payload.id);
};
