import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { getAuthUser, subscribeAuth, clearAuthUser } from "~/utils/authStore";

type Role = "viewer" | "editor" | "admin" | null;

const BASE_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Financial News", href: "/news" },
  { label: "Fintech Companies", href: "/startups" },
];

const ADMIN_NAV = [
  { label: "User Management", href: "/user-management" },
  { label: "Data Management", href: "/data-management" },
];

export function SiteNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // subscribe to auth changes (instant after login/logout)
  useEffect(() => {
    setUser(getAuthUser());
    const unsubscribe = subscribeAuth(() => setUser(getAuthUser()));
    return unsubscribe;
  }, []);

  const isAdmin = user?.role === "admin";
  const isLoggedIn = Boolean(user);

  const navItems = useMemo(() => {
    const items = [...BASE_NAV];
    if (isAdmin) items.push(...ADMIN_NAV);
    if (!isLoggedIn) items.push({ label: "Sign In", href: "/login" });
    return items;
  }, [isAdmin, isLoggedIn]);

  const handleLogout = () => {
    clearAuthUser();
    navigate("/");
  };

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
          {navItems.map((item) => (
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

          {isLoggedIn && (
            <div className="flex items-center gap-3 border-l border-[#8b4d2e] pl-3">
              <button
                onClick={handleLogout}
                className="text-sm font-medium flex items-center gap-1 text-white hover:text-orange-200 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded hover:bg-[#8b4d2e]/30 transition"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[#71391C] border-t border-[#8b4d2e]">
          <div className="flex flex-col px-6 py-3 space-y-2">
            {navItems.map((item) => (
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

            {isLoggedIn && (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#8b4d2e]/40 rounded"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
