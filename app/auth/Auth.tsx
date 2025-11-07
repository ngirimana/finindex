import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  MapPin,
  Building,
  Phone,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "~/services/finApi";

type RegisterRole = "viewer" | "editor";

const COUNTRIES = [
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

const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#d4a373] focus:border-transparent";

export default function AuthPage() {
  const navigate = useNavigate();
  const [qs] = useSearchParams();
  const initialTab = (qs.get("mode") as "login" | "register") ?? "login";

  const [mode, setMode] = useState<"login" | "register" | "admin-create">(
    initialTab
  );
  const [form, setForm] = useState({
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
  const [registerRole, setRegisterRole] = useState<RegisterRole>("viewer");
  const [message, setMessage] = useState<{
    type: "" | "success" | "error";
    text: string;
  }>({
    type: "",
    text: "",
  });

  // Password visibility toggles
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const isSubmitting = isLoginLoading || isRegisterLoading;

  // Country search
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const sortedCountries = useMemo(
    () => COUNTRIES.slice().sort((a, b) => a.localeCompare(b)),
    []
  );
  const filteredCountries = useMemo(
    () =>
      sortedCountries.filter((c) =>
        c.toLowerCase().includes(countrySearch.toLowerCase())
      ),
    [sortedCountries, countrySearch]
  );

  const countryBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!countryBoxRef.current) return;
      if (!countryBoxRef.current.contains(e.target as Node))
        setCountryOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function selectCountry(country: string) {
    setCountrySearch(country);
    setForm((f) => ({ ...f, country }));
    setCountryOpen(false);
  }

  // Email validation
  const [emailCheck, setEmailCheck] = useState<{
    status: "idle" | "checking" | "valid" | "invalid";
    reason?: string;
  }>({ status: "idle" });
  const emailTimer = useRef<number | null>(null);
  useEffect(() => {
    const email = form.email.trim();
    if (emailTimer.current) window.clearTimeout(emailTimer.current);
    emailTimer.current = window.setTimeout(() => {
      if (!email) return setEmailCheck({ status: "idle" });
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailCheck(
        re.test(email)
          ? { status: "valid" }
          : { status: "invalid", reason: "Invalid email" }
      );
    }, 250);
    return () => {
      if (emailTimer.current) window.clearTimeout(emailTimer.current);
    };
  }, [form.email]);

  function persistAuth(user: any, token: string) {
    try {
      localStorage.setItem("fintechUser", JSON.stringify({ ...user, token }));
    } catch {}
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      if (mode === "login") {
        const data = await login({
          email: form.email,
          password: form.password,
        }).unwrap();
        persistAuth(data.user, data.token);
        navigate("/");
        return;
      }

      if (
        !form.firstName ||
        !form.lastName ||
        !(form.country || countrySearch)
      ) {
        setMessage({
          type: "error",
          text: "Please fill in all required fields",
        });
        return;
      }
      if (form.password !== form.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return;
      }
      if (emailCheck.status !== "valid") {
        setMessage({
          type: "error",
          text: "Please enter a valid email address",
        });
        return;
      }

      await register({
        email: form.email,
        password: form.password,
        name: `${form.firstName} ${form.lastName}`,
        phoneNumber: form.phoneNumber,
        country: form.country || countrySearch,
        organization: form.organization,
        jobTitle: form.jobTitle,
        role: registerRole,
        isVerified: false,
      }).unwrap();

      setMessage({
        type: "success",
        text: "Registration successful. Wait for admin verification.",
      });
      setMode("login");
    } catch (err: any) {
      const text =
        typeof err?.data?.message === "string"
          ? err.data.message
          : err?.message || "Something went wrong.";
      setMessage({ type: "error", text });
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fintechUser");
      if (raw) navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}

      <main className="w-full flex-1 flex items-start justify-center">
        <div
          className={`w-full ${mode === "login" ? "max-w-md" : "max-w-4xl"} px-6 py-10`}
        >
          {/* Tabs */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-xl border border-[#6b341e]/30 bg-gray-50 p-1 text-gray-700">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
                    mode === m
                      ? "bg-[#6b341e] text-white"
                      : "hover:bg-[#6b341e]/10"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#6b341e]/30 bg-white shadow-xl p-6">
            {mode === "login" ? (
              // --- SIGN IN ---
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
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
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
                      type={showLoginPwd ? "text" : "password"}
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
                      onClick={() => setShowLoginPwd((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      {showLoginPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

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
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#6b341e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#532917] transition"
                >
                  {isSubmitting ? "Processing..." : "Sign In"}
                </button>
              </form>
            ) : (
              // --- REGISTER ---
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Email + Country on same row */}
                <div className="grid sm:grid-cols-2 gap-4" ref={countryBoxRef}>
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
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <MapPin className="absolute left-3 top-9 h-4 w-4 text-gray-400 " />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setForm((f) => ({ ...f, country: "" }));
                        setCountryOpen(true);
                      }}
                      onFocus={() => setCountryOpen(true)}
                      placeholder="Search country..."
                      className={`${inputBase} pl-10`}
                    />
                    {countryOpen && filteredCountries.length > 0 && (
                      <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-auto rounded-lg border border-gray-200 bg-white  text-gray-400  text-sm shadow-lg">
                        {filteredCountries.map((country) => (
                          <li
                            key={country}
                            onMouseDown={() => selectCountry(country)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          >
                            {country}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Passwords same row */}
                <div className="grid sm:grid-cols-2 gap-4">
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
                        placeholder="Enter password"
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
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPwd ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                        placeholder="Confirm password"
                        className={`${inputBase} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                      >
                        {showConfirmPwd ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#6b341e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#532917] transition"
                >
                  {isSubmitting ? "Processing..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
