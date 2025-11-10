import React, { useMemo, useRef, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { inputBase } from "./styles";
import { COUNTRIES } from "../../data/fin-data";

type Props = {
  value: string; // saved value
  onChange: (country: string) => void;
  label?: string;
};

export const CountrySelect: React.FC<Props> = ({
  value,
  onChange,
  label = "Country",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const boxRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(
    () => COUNTRIES.slice().sort((a, b) => a.localeCompare(b)),
    []
  );
  const filtered = useMemo(
    () => sorted.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [sorted, search]
  );

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function select(country: string) {
    setSearch(country);
    onChange(country);
    setOpen(false);
  }

  return (
    <div className="relative" ref={boxRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <MapPin className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(""); // reset bound value until a real pick
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search country..."
        className={`${inputBase} pl-10`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-auto rounded-lg border border-gray-200 bg-white text-gray-600 text-sm shadow-lg">
          {filtered.map((c) => (
            <li
              key={c}
              onMouseDown={() => select(c)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
