import React, { useState } from "react";
import { href, Link, useLocation } from "react-router-dom";
import { Menu, User, X } from "lucide-react";
import type { User as U } from "../types";
import { Label } from "recharts";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Financial News", href: "/news" },
  { label: "Startups", href: "/startups" },
  { label: "Sign In", href: "/login" },
  { label: "User Management", href: "/user-management" },
  { label: "Data Management", href: "/data-management" },
];

export function SiteNavbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-[#71391C] text-white">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 h-14">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight">
            African Fintech Index
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition ${
                isActive(item.href)
                  ? "text-orange-200"
                  : "text-white hover:text-orange-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded hover:bg-[#8b4d2e]/30 transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[#71391C] border-t border-[#8b4d2e]">
          <div className="flex flex-col px-6 py-3 space-y-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded px-3 py-2 text-sm transition ${
                  isActive(item.href)
                    ? "bg-[#8b4d2e]/50 text-orange-200"
                    : "text-white hover:bg-[#8b4d2e]/40"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
