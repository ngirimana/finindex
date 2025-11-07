import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Phone,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  currentUser?: any;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "admin-create">(
    "login"
  );
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "" | "success" | "error";
    text: string;
  }>({ type: "", text: "" });
  const [emailCheck, setEmailCheck] = useState<{
    status: "idle" | "checking" | "valid" | "invalid";
    reason?: string;
  }>({ status: "idle" });
  const [registerRole, setRegisterRole] = useState<"editor" | "viewer">(
    "viewer"
  );

  const countries = [
    "Nigeria",
    "South Africa",
    "Kenya",
    "Egypt",
    "Ghana",
    "Morocco",
    "Ethiopia",
    "Tanzania",
    "Uganda",
    "Rwanda",
    "Senegal",
    "Ivory Coast",
    "Tunisia",
    "Algeria",
    "Cameroon",
    "Zimbabwe",
    "Zambia",
    "Botswana",
    "Namibia",
    "Mauritius",
    "Mali",
    "Burkina Faso",
    "Niger",
    "Chad",
    "Central African Republic",
    "Democratic Republic of Congo",
    "Republic of Congo",
    "Gabon",
    "Equatorial Guinea",
    "São Tomé and Príncipe",
    "Angola",
    "Mozambique",
    "Madagascar",
    "Malawi",
    "Lesotho",
    "Eswatini",
    "Comoros",
    "Seychelles",
    "Mauritania",
    "Western Sahara",
    "Libya",
    "Sudan",
    "South Sudan",
    "Eritrea",
    "Djibouti",
    "Somalia",
    "Other",
  ];

  // palette:
  // header/button: #6b341e, hover: #532917, focus ring: #d4a373

  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const sortedCountries = countries.slice().sort((a, b) => a.localeCompare(b));
  const filteredCountries = sortedCountries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
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
    setMessage({ type: "", text: "" });
  };

  // email format check
  const emailDebounceId = useRef<number | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const email = formData.email.trim();
    if (emailDebounceId.current) window.clearTimeout(emailDebounceId.current);
    emailDebounceId.current = window.setTimeout(() => {
      if (!email) {
        setEmailCheck({ status: "idle" });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailCheck(
        emailRegex.test(email)
          ? { status: "valid" }
          : { status: "invalid", reason: "Please enter a valid email address" }
      );
    }, 250);
    return () => {
      if (emailDebounceId.current) window.clearTimeout(emailDebounceId.current);
    };
  }, [formData.email, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const apiUrl = import.meta.env.VITE_API_URL || "/api";

    try {
      if (mode === "register" || mode === "admin-create") {
        if (
          !formData.firstName ||
          !formData.lastName ||
          !(formData.country || countrySearch)
        ) {
          setMessage({
            type: "error",
            text: "Please fill in all required fields",
          });
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" });
          setLoading(false);
          return;
        }
        if (emailCheck.status !== "valid") {
          setMessage({
            type: "error",
            text: "Please enter a valid email address",
          });
          setLoading(false);
          return;
        }
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: `${formData.firstName} ${formData.lastName}`,
            phoneNumber: formData.phoneNumber,
            country: formData.country || countrySearch,
            organization: formData.organization,
            jobTitle: formData.jobTitle,
            role: registerRole,
            isVerified: false,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setMessage({
            type: "error",
            text: data.message || "Registration failed",
          });
          setLoading(false);
          return;
        }
        setMessage({
          type: "success",
          text: "Registration successful! Your account requires admin verification before you can log in.",
        });
        setMode("login");
        setLoading(false);
        return;
      }

      if (mode === "login") {
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage({ type: "error", text: data.message || "Login failed" });
          setLoading(false);
          return;
        }
        localStorage.setItem(
          "fintechUser",
          JSON.stringify({ ...data.user, token: data.token })
        );
        onAuthSuccess({ ...data.user, token: data.token });
        onClose();
        resetForm();
        setLoading(false);
        navigate("/");
        return;
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24">
      {/* Card (white body) */}
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#6b341e]/30 bg-white shadow-2xl">
        {/* Header (brown) */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-[#6b341e] px-5 py-4 text-white flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide">
            {mode === "login" && "Sign in to African Fintech Index"}
            {mode === "register" && "Create your African Fintech Index account"}
            {mode === "admin-create" && "Create Admin Account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="px-5 pt-4">
          <div className="inline-flex rounded-xl border border-[#6b341e]/30 bg-gray-50 p-1 text-gray-700">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
                  mode === m
                    ? "bg-[#6b341e] text-white shadow-sm"
                    : "hover:bg-[#6b341e]/10"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        </div>

        {/* Form (light styling) */}
        <form
          onSubmit={handleSubmit}
          className="px-5 py-5 space-y-4 text-gray-800"
        >
          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
              />
            </div>
            {emailCheck.status === "invalid" && (
              <p className="mt-1 text-xs text-red-600">{emailCheck.reason}</p>
            )}
            {emailCheck.status === "valid" && (
              <p className="mt-1 text-xs text-emerald-700">
                Email looks deliverable.
              </p>
            )}
          </div>

          {/* Names (register/admin) */}
          {(mode === "register" || mode === "admin-create") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="First name"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Last name"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Registration block (register/admin) */}
          {(mode === "register" || mode === "admin-create") && (
            <>
              {/* Country (searchable dropdown) */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setFormData({ ...formData, country: "" });
                      setCountryDropdownOpen(true);
                    }}
                    onFocus={() => setCountryDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setCountryDropdownOpen(false), 120)
                    }
                    placeholder="Search country..."
                    autoComplete="off"
                    required
                    className="mb-2 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                  />
                  {countryDropdownOpen && filteredCountries.length > 0 && (
                    <ul className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white text-sm shadow-lg">
                      {filteredCountries.map((country) => (
                        <li
                          key={country}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                          onMouseDown={() => {
                            setCountrySearch(country);
                            setFormData({ ...formData, country });
                            setCountryDropdownOpen(false);
                          }}
                        >
                          {country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Organization
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    placeholder="Company or organization"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Job + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                    placeholder="Your role"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="+1234567890"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Role (register only) */}
              {mode === "register" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Register as
                  </label>
                  <select
                    value={registerRole}
                    onChange={(e) =>
                      setRegisterRole(e.target.value as "editor" | "viewer")
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
              />
            </div>
          </div>

          {/* Confirm Password (register/admin) */}
          {(mode === "register" || mode === "admin-create") && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="      Confirm password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {message.text && (
            <div
              className={`flex items-start space-x-2 rounded-lg p-3 text-sm border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              (mode !== "login" &&
                (emailCheck.status === "checking" ||
                  emailCheck.status === "invalid"))
            }
            className="w-full rounded-lg bg-[#6b341e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#532917] focus:outline-none focus:ring-2 focus:ring-[#d4a373] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Sign In"
                : mode === "register"
                  ? "Create Account"
                  : "Create Admin Account"}
          </button>

          {/* Footer links */}
          {mode === "login" && (
            <p className="mt-3 text-center text-xs text-gray-600">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-medium text-[#6b341e] hover:underline"
              >
                Create one
              </button>
            </p>
          )}
          {mode === "register" && (
            <p className="mt-3 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-medium text-[#6b341e] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === "admin-create" && (
            <p className="mt-3 text-center text-xs text-gray-600">
              Back to{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-medium text-[#6b341e] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
