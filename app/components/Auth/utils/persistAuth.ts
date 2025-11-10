export function persistAuth(user: any, token: string) {
  try {
    localStorage.setItem("fintechUser", JSON.stringify({ ...user, token }));
  } catch {
    // ignore storage errors
  }
}
