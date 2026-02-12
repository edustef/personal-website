const SESSION_COOKIE_NAME = "booking_session";
const SESSION_MAX_AGE = 2 * 60 * 60; // 2 hours in seconds

export function setSessionCookie(sessionId: string) {
	const expires = new Date();
	expires.setTime(expires.getTime() + SESSION_MAX_AGE * 1000);

	const cookieValue = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax${
		process.env.NODE_ENV === "production" ? "; Secure" : ""
	}`;

	document.cookie = cookieValue;
}

export function getSessionCookie(): string | null {
	if (typeof document === "undefined") return null;

	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === SESSION_COOKIE_NAME) {
			return value || null;
		}
	}
	return null;
}

export function clearSessionCookie() {
	document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
