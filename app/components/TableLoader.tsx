// src/components/TableLoader.tsx
import React from "react";

type TableLoaderProps = {
  rows?: number;
  cols?: number;
  height?: number;
};

export const TableLoader: React.FC<TableLoaderProps> = ({
  rows = 10,
  cols = 6,
  height = 500,
}) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden"
      style={{ minHeight: height }}
    >
      {/* header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-40 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* column titles */}
      <div
        className="px-6 py-3 border-b border-gray-100 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-100 rounded animate-pulse w-3/4"
          />
        ))}
      </div>

      {/* rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="px-6 py-4 grid items-center"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((__, cIdx) => (
              <div key={cIdx} className="animate-pulse">
                <div
                  className={`h-4 rounded ${cIdx === 0 ? "w-4/5" : cIdx === cols - 1 ? "w-2/3" : "w-3/4"} bg-gray-200`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
