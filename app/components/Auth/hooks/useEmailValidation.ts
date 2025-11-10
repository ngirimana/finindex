import { useEffect, useRef, useState } from "react";

type State =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid" }
  | { status: "invalid"; reason?: string };

export function useEmailValidation(email: string) {
  const [state, setState] = useState<State>({ status: "idle" });
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const value = email.trim();
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!value) return setState({ status: "idle" });
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setState(re.test(value) ? { status: "valid" } : { status: "invalid", reason: "Invalid email" });
    }, 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [email]);

  return state;
}
