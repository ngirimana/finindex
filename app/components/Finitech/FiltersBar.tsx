import React from "react";
import { Search } from "lucide-react";
import { COUNTRIES } from "./constants";

type Props = {
  searchTerm: string;
  selectedCountry: string;
  selectedSector: string;
  sectors: string[];
  setSearchTerm: (v: string) => void;
  setSelectedCountry: (v: string) => void;
  setSelectedSector: (v: string) => void;
  clearAll: () => void;
};

const FiltersBar: React.FC<Props> = ({
  searchTerm,
  selectedCountry,
  selectedSector,
  sectors,
  setSearchTerm,
  setSelectedCountry,
  setSelectedSector,
  clearAll,
}) => {
  return (
    <>
      {(searchTerm || selectedCountry || selectedSector) && (
        <div className="col-span-full flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs text-gray-600 font-medium">
            Active filters:
          </span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs chip-sand">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-brand-600 hover:underline"
              >
                ×
              </button>
            </span>
          )}
          {selectedCountry && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs chip-sand">
              Country: {selectedCountry}
              <button
                onClick={() => setSelectedCountry("")}
                className="ml-1 text-brand-600 hover:underline"
              >
                ×
              </button>
            </span>
          )}
          {selectedSector && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs chip-sand">
              Sector: {selectedSector}
              <button
                onClick={() => setSelectedSector("")}
                className="ml-1 text-brand-600 hover:underline"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-brand-600" />
        <input
          type="text"
          placeholder="Search startups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-0 text-sm bg-white text-black placeholder-gray-400"
        />
      </div>

      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 text-sm bg-white text-black appearance-none"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-brand-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 text-sm bg-white text-black appearance-none"
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-brand-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default FiltersBar;
