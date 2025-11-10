import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AuthMode } from "../../components/Auth/utils/types";
import { Tabs } from "../../components/Auth/Tabs";
import { LoginForm } from "../../components/Auth/LoginForm";
import { RegisterForm } from "../../components/Auth/RegisterForm";

export default function AuthPage() {
  const navigate = useNavigate();
  const [qs] = useSearchParams();
  const initialTab = (qs.get("mode") as AuthMode) ?? "login";
  const [mode, setMode] = React.useState<AuthMode>(initialTab);

  // redirect if already logged
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("fintechUser");
      if (raw) navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="w-full flex-1 flex items-start justify-center">
        <div
          className={`w-full ${mode === "login" ? "max-w-md" : "max-w-4xl"} px-6 py-10`}
        >
          <Tabs mode={mode} setMode={setMode} />
          <div className="rounded-2xl border border-[#6b341e]/30 bg-white shadow-xl p-6">
            {mode === "login" ? (
              <LoginForm onSuccess={() => navigate("/")} />
            ) : (
              <RegisterForm onSuccessSwitchToLogin={() => setMode("login")} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
