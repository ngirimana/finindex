import React from "react";

/** A single card skeleton that mirrors StartupCard’s layout */
export const StartupCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-white flex flex-col animate-pulse">
      {/* Title block */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      {/* “chips” row */}
      <div className="flex gap-2 mb-6 h-7">
        <div className="h-7 w-20 bg-gray-200 rounded-full" />
        <div className="h-7 w-16 bg-gray-200 rounded-full" />
        <div className="h-7 w-24 bg-gray-200 rounded-full" />
      </div>
      {/* Description block (3 lines) */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-10/12" />
      </div>
      {/* Info row */}
      <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 mb-4">
        <div className="space-y-2">
          <div className="h-3 w-14 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Buttons row */}
      <div className="flex gap-3 mt-auto">
        <div className="h-10 bg-gray-200 rounded-lg flex-1" />
        <div className="h-10 bg-gray-200 rounded-lg w-28" />
      </div>
    </div>
  );
};

/** A grid of skeleton cards */
export const StartupGridSkeleton: React.FC<{ count?: number }> = ({
  count = 6,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <StartupCardSkeleton key={i} />
      ))}
    </div>
  );
};
