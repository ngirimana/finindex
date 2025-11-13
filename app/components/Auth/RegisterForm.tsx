import React from "react";
import { Mail } from "lucide-react";
import { inputBase } from "./styles";
import { CountrySelect } from "./CountrySelect";
import { PasswordInput } from "./PasswordInput";
import { useEmailValidation } from "./hooks/useEmailValidation";
import { useRegisterMutation } from "~/services/finApi";
import type { RegisterRole, AuthForm } from "./utils/types";

type Props = {
  onSuccessSwitchToLogin: () => void;
};

// ✅ helper: normalize CountrySelect value to string
function toCountryString(input: unknown): string {
  if (typeof input === "string") return input;
  if (input && typeof input === "object" && "value" in (input as any)) {
    const v = (input as any).value;
    return typeof v === "string" ? v : "";
  }
  return "";
}

export const RegisterForm: React.FC<Props> = ({ onSuccessSwitchToLogin }) => {
  const [form, setForm] = React.useState<AuthForm>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    organization: "",
    country: "",
    phoneNumber: "",
    jobTitle: "",
  });
  const [registerRole, setRegisterRole] =
    React.useState<RegisterRole>("viewer");
  const [message, setMessage] = React.useState<{
    type: "" | "success" | "error";
    text: string;
  }>({ type: "", text: "" });

  const emailCheck = useEmailValidation(form.email);
  const [register, { isLoading }] = useRegisterMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const country = form.country.trim();
    const email = form.email.trim();

    // ✅ Check for required fields
    if (!firstName || !lastName || !country) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setMessage({
        type: "error",
        text: "Password and confirmation are required",
      });
      return;
    }

    if (form.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (emailCheck.status !== "valid") {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    try {
      await register({
        email,
        password: form.password,
        name: `${firstName} ${lastName}`,
        phoneNumber: form.phoneNumber.trim(),
        country,
        organization: form.organization.trim(),
        jobTitle: form.jobTitle.trim(),
        role: registerRole,
        isVerified: false,
      }).unwrap();

      setMessage({
        type: "success",
        text: "Registration successful. Wait for admin verification.",
      });

      localStorage.setItem("pendingUserEmail", email);

      // Redirect to login
      onSuccessSwitchToLogin();
    } catch (err: any) {
      const text =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.message || "Something went wrong.";
      setMessage({ type: "error", text });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Email + Country */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
              placeholder="you@example.com"
              className={`${inputBase} pl-10`}
            />
          </div>
          {emailCheck.status === "invalid" && (
            <p className="mt-1 text-xs text-red-600">
              {emailCheck.reason || "Invalid email"}
            </p>
          )}
        </div>

        <CountrySelect
          value={form.country}
          onChange={(v) =>
            setForm((f) => ({ ...f, country: toCountryString(v) }))
          }
        />
      </div>

      {/* Passwords same row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <PasswordInput
          label="Password"
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
          required
        />
        <PasswordInput
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
          withIcon={false}
          required
        />
      </div>

      {/* Names same row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
            required
            placeholder="First name"
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastName: e.target.value }))
            }
            required
            placeholder="Last name"
            className={inputBase}
          />
        </div>
      </div>

      {/* Org + Job same row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Organization
          </label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) =>
              setForm((f) => ({ ...f, organization: e.target.value }))
            }
            placeholder="Company"
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, jobTitle: e.target.value }))
            }
            placeholder="Your role"
            className={inputBase}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={form.phoneNumber}
          onChange={(e) =>
            setForm((f) => ({ ...f, phoneNumber: e.target.value }))
          }
          placeholder="+1234567890"
          className={inputBase}
        />
      </div>

      {/* Role (viewer/editor) */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={registerRole}
          onChange={(e) => setRegisterRole(e.target.value as any)}
          className={inputBase}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      {/* Success or error message */}
      {message.text && (
        <div
          className={`text-sm rounded-lg p-3 ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[#6b341e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#532917] transition"
      >
        {isLoading ? "Processing..." : "Register"}
      </button>
    </form>
  );
};
