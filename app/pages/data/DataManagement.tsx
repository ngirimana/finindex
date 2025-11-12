import React, { useEffect, useMemo, useState } from "react";
import { DataManagement } from "~/components/data/DataManagement";
import { FileUpload } from "~/components/data/FileUpload";
import type { CountryData } from "../../types";
import {
  useGetAllCountryDataQuery,
  useGetAvailableYearsQuery,
} from "~/services/finApi";

const DataManagementPage: React.FC = () => {
  // SSR-safe hydration flag
  const [hydrated, setHydrated] = useState(false);

  // Current user (loaded only on client)
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    setHydrated(true);
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("fintechUser")
          : null;
      setCurrentUser(stored ? JSON.parse(stored) : null);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  // Pull data & years from finApi
  const {
    data: countryData = [],
    isLoading: loadingData,
    refetch: refetchAll,
  } = useGetAllCountryDataQuery();

  const {
    data: years = [],
    isLoading: loadingYears,
    refetch: refetchYears,
  } = useGetAvailableYearsQuery();

  const selectedYear = useMemo(() => {
    if (!years.length) return null;
    const sorted = years.slice().sort((a, b) => b - a);
    return sorted[0] ?? null;
  }, [years]);

  // While not hydrated, avoid reading user/role for SSR
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <main className="flex-1 px-2 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Data Management
          </h1>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Preparing…</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Auth gate after hydration
  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "editor")
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <main className="flex-1 px-2 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 w-full">
          You do not have access to this page.
        </main>
      </div>
    );
  }

  if (loadingData || loadingYears) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <main className="flex-1 px-2 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Data Management
          </h1>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading data from database...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <main className="flex-1 px-1 py-6 sm:py-10 space-y-6 sm:space-y-10 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Data Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DataManagement
            isAuthenticated={true}
            data={countryData as CountryData[]}
            years={years}
            refetchAll={refetchAll}
            refetchYears={refetchYears}
          />

          <FileUpload
            onDataUpdate={() => {
              refetchAll();
              refetchYears();
            }}
            currentYear={selectedYear ?? 2024}
          />
        </div>
      </main>
    </div>
  );
};

export default DataManagementPage;
