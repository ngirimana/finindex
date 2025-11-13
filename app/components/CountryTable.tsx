import React, { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Download, Building2 } from "lucide-react";
import type { CountryData } from "../types";
import {
  useGetStartupCountsByYearQuery,
  type StartupCount,
} from "~/services/finApi";

interface CountryTableProps {
  data: CountryData[];
  selectedYear?: number;
}

export const CountryTable: React.FC<CountryTableProps> = ({
  data,
  selectedYear,
}) => {
  const [sortField, setSortField] = useState<keyof CountryData>("finalScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const {
    data: startupCountsData = [],
    isLoading: startupCountsLoading,
    isError: startupCountsError,
  } = useGetStartupCountsByYearQuery(selectedYear as number, {
    skip: !selectedYear,
  });

  const startupCounts = useMemo(() => {
    const map = new Map<string, number>();
    (startupCountsData as StartupCount[]).forEach((item) => {
      map.set(item.country, item.count);
    });
    return map;
  }, [startupCountsData]);

  const sortedData = [...data].sort((a, b) => {
    const aValue = (a[sortField] as number) ?? 0;
    const bValue = (b[sortField] as number) ?? 0;
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (field: keyof CountryData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Country",
        "Year",
        "Final Score",
        "Literacy Rate",
        "Digital Infrastructure",
        "Investment",
        "Fintech Companies",
        "Population",
        "GDP (Billion USD)",
      ],
      ...sortedData.map((country) => [
        country.name,
        country.year.toString(),
        country.finalScore.toFixed(1),
        country.literacyRate.toFixed(1),
        country.digitalInfrastructure.toFixed(1),
        country.investment.toFixed(1),
        country.fintechCompanies?.toString() || "N/A",
        country.population
          ? (country.population / 1000000).toFixed(1) + "M"
          : "N/A",
        country.gdp ? country.gdp.toFixed(1) : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "african-fintech-index.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: keyof CountryData }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-3 md:p-4 lg:p-6 w-full max-w-full min-w-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Country Rankings
        </h3>
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-[#71391C] text-white rounded-lg hover:bg-[#5d2f17] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full min-w-[800px] sm:min-w-0">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("finalScore")}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Final Score</span>
                  <span className="sm:hidden">Score</span>
                  <SortIcon field="finalScore" />
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("literacyRate")}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Literacy Rate</span>
                  <span className="sm:hidden">Literacy</span>
                  <SortIcon field="literacyRate" />
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("digitalInfrastructure")}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Digital Infra</span>
                  <span className="sm:hidden">Digital</span>
                  <SortIcon field="digitalInfrastructure" />
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("investment")}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Investment</span>
                  <span className="sm:hidden">Invest</span>
                  <SortIcon field="investment" />
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("fintechCompanies")}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Fintech Companies</span>
                  <span className="sm:hidden">Companies</span>
                  <SortIcon field="fintechCompanies" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((country, index) => (
              <tr
                key={`${country.id}-${country.year}`}
                className="hover:bg-gray-50"
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 1}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {country.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {country.population
                      ? `${(country.population / 1000000).toFixed(1)}M people`
                      : "Population N/A"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {country.finalScore.toFixed(1)}
                    </div>
                    <div className="ml-2 w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#71391C] h-2 rounded-full"
                        style={{ width: `${country.finalScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.literacyRate.toFixed(1)}%
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.digitalInfrastructure.toFixed(1)}%
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                  {country.investment.toFixed(1)}%
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1 sm:mr-2" />
                    {(() => {
                      const count = startupCounts.get(country.name);
                      if (startupCountsLoading) return "…";
                      if (startupCountsError) return "N/A";
                      return count || 0;
                    })()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
