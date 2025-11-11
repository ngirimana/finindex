import React, { useMemo, useState } from "react";
import { COUNTRIES } from "~/data/fin-data";

export default function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (country: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const countries = useMemo(
    () => [...COUNTRIES].sort((a, b) => a.localeCompare(b)),
    []
  );
  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-semibold text-[#6B3A1E] mb-2">
        Country <span className="text-[#8B4A2A]">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={value || query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(""); // reset until user picks
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          placeholder="Search for a country..."
          className="w-full px-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
          autoComplete="off"
          required
        />
        {open && filtered.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-auto bg-white border border-[#D9CBBE] rounded-lg shadow-lg z-20">
            {filtered.map((country) => (
              <li
                key={country}
                className="px-4 py-3 cursor-pointer hover:bg-[#F8F6F3] transition-colors text-[#6B3A1E]"
                onMouseDown={() => {
                  onChange(country);
                  setQuery(country);
                  setOpen(false);
                }}
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
