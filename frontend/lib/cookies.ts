const SESSION_COOKIE_NAME = "booking_session";
const SESSION_MAX_AGE = 2 * 60 * 60; // 2 hours in seconds

export function setSessionCookie(sessionId: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

export function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^| )${SESSION_COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[2] : null;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}
