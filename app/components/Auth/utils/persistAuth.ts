
import { setAuthUser } from "~/utils/authStore";
export function persistAuth(user: any, token: string) {
  try {
    setAuthUser({ ...user, token });
    // localStorage.setItem("fintechUser", JSON.stringify({ ...user, token }));
  } catch {
    // ignore storage errors
  }
}
