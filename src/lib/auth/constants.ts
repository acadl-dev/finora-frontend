export const ACCESS_TOKEN_COOKIE = "finora_access_token";
export const REFRESH_TOKEN_COOKIE = "finora_refresh_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};