type Listener = () => void;

const KEY = "fintechUser";
const listeners = new Set<Listener>();

export function getAuthUser(): any | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: any) {
  localStorage.setItem(KEY, JSON.stringify(user));
  listeners.forEach((l) => l());
}

export function clearAuthUser() {
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: Listener) {
  listeners.add(listener);
  // Also listen to cross-tab changes (and some libs dispatch 'storage' manually)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
