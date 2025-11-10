import React from "react";
import { Mail, Lock } from "lucide-react";
import { inputBase } from "./styles";
import { useLoginMutation } from "~/services/finApi";
import { persistAuth } from "./utils/persistAuth";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  onSuccess: () => void;
};

export const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [message, setMessage] = React.useState<{
    type: "" | "success" | "error";
    text: string;
  }>({ type: "", text: "" });
  const [showPwd, setShowPwd] = React.useState(false);

  const [login, { isLoading }] = useLoginMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const data = await login({
        email: form.email,
        password: form.password,
      }).unwrap();
      persistAuth(data.user, data.token);
      onSuccess();
    } catch (err: any) {
      const text =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.message || "Something went wrong.";
      setMessage({ type: "error", text });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            placeholder="you@example.com"
            className={`${inputBase} pl-10`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
            placeholder="Enter your password"
            className={`${inputBase} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            {showPwd ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`text-sm rounded-lg p-3 ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[#6b341e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#532917] transition"
      >
        {isLoading ? "Processing..." : "Sign In"}
      </button>
    </form>
  );
};
