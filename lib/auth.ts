export interface Session {
  token: string;
  user_id: string;
  email: string;
  full_name: string;
  role: "artisan" | "designer" | "customer" | "admin";
  artisan_id: number | null;
  artisan_name: string | null;
}

const KEY = "santhai_session";
export const SESSION_CHANGED_EVENT = "santhai-session-changed";

// Client-side route changes (router.push) don't remount components like
// Navbar, so localStorage alone won't trigger a re-render after login/logout.
// Dispatching this lets any mounted component react immediately.
function notifySessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
  }
}

export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
  notifySessionChanged();
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
  notifySessionChanged();
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}
