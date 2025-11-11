import React, { useState } from "react";
import CountrySelect from "./CountrySelect";

type Role = "viewer" | "editor" | "admin";

export default function RegisterForm({
  creating,
  onValidateError,
  onSubmit,
}: {
  creating: boolean;
  onValidateError: (title: string, message: string) => void;
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    country: string;
    organization?: string;
    jobTitle?: string;
    phoneNumber?: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    organization: "",
    jobTitle: "",
    phoneNumber: "",
    role: "viewer" as Role,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      onValidateError("Passwords don’t match", "Please retype them.");
      return;
    }
    if (!form.firstName || !form.lastName || !form.country) {
      onValidateError(
        "Missing required fields",
        "First name, last name, and country are required."
      );
      return;
    }
    await onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      country: form.country,
      organization: form.organization || undefined,
      jobTitle: form.jobTitle || undefined,
      phoneNumber: form.phoneNumber || undefined,
    });
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      organization: "",
      jobTitle: "",
      phoneNumber: "",
      role: "viewer",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-[#E5B97C]/40 rounded-lg flex items-center justify-center mr-3">
          <span className="text-[#6B3A1E] font-bold text-sm">+</span>
        </div>
        <h4 className="text-lg font-semibold text-[#6B3A1E]">
          Register New User
        </h4>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              First Name <span className="text-[#8B4A2A]">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Last Name <span className="text-[#8B4A2A]">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Enter last name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Email Address <span className="text-[#8B4A2A]">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        {/* Country & Org */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CountrySelect
            value={form.country}
            onChange={(country) => setForm({ ...form, country })}
          />
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Organization
            </label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Company or organization"
            />
          </div>
        </div>

        {/* Job & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Your role"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="+1234567890"
            />
          </div>
        </div>

        {/* Password & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Password <span className="text-[#8B4A2A]">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Confirm Password <span className="text-[#8B4A2A]">*</span>
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              placeholder="Confirm password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
              Role <span className="text-[#8B4A2A]">*</span>
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
              className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
              required
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="bg-[#6B3A1E] text-[#FCEFD6] rounded-lg px-8 py-3 hover:bg-[#8B4A2A] transition-colors font-semibold text-base shadow-sm disabled:opacity-60"
        >
          {creating ? "Registering..." : "Register User"}
        </button>
      </form>
    </div>
  );
}
