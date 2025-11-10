import { useMemo, useState } from "react";
import {
  useGetAllCountryDataQuery,
  useGetAvailableYearsQuery,
  useGetCountryDataByYearQuery,
  type CountryYearRow,
} from "~/services/finApi";

import type { CountryData } from "~/types";
import CountryTrendLine from "~/components/CountryTrendLines";
import AfricaMapComplete from "~/components/AfricaMapComplete";
import { CountryTable } from "~/components/CountryTable";
import { getLocalShapefilePath } from "~/utils/shapefileProcessor";
import { CountryNames } from "~/data/fin-data";
import { TableLoader } from "~/components/TableLoader";
import { GraphLoader } from "~/components/GraphLoader";

export function Welcome() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(
    null
  );

  const {
    data: allYearsData = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetAllCountryDataQuery();

  const {
    data: yearData = [],
    isLoading: isLoadingYear,
    isError: isErrorYear,
  } = useGetCountryDataByYearQuery(selectedYear);

  const {
    data: availableYears = [],
    isLoading: isLoadingYears,
    isError: isErrorYears,
  } = useGetAvailableYearsQuery();

  // Memoize to keep references stable between renders
  const trendRows: CountryYearRow[] = useMemo(
    () => allYearsData as CountryYearRow[],
    [allYearsData]
  );

  // Derived data for the chart (no setState loop)
  const yearsRangeRows = useMemo(
    () => trendRows.filter((row) => row.year <= selectedYear),
    [trendRows, selectedYear]
  );

  // Choose which set to plot
  const chartRows = yearsRangeRows.length === 0 ? trendRows : yearsRangeRows;

  // For map/table: selected year
  const currentData: CountryData[] = yearData as CountryData[];

  const anyLoading = isLoadingAll || isLoadingYear;
  const anyError = isErrorAll || isErrorYear;

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <div className="flex justify-end px-6 py-4">
        <div className="flex items-center gap-3">
          <label htmlFor="year" className="text-sm font-medium text-gray-700">
            Year:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={isLoadingYears || isErrorYears}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoadingAll ? (
        <GraphLoader />
      ) : (
        <CountryTrendLine
          rows={chartRows}
          countries={CountryNames}
          metric="finalScore"
        />
      )}

      <div
        className="w-full flex items-center justify-center"
        style={{ minHeight: 400 }}
      >
        <AfricaMapComplete
          data={currentData}
          shapefilePath={getLocalShapefilePath()}
          width={1600}
          height={600}
          hoveredCountry={hoveredCountry}
          onCountryHover={setHoveredCountry}
          selectedYear={selectedYear}
          guardSSR
        />
      </div>

      {isLoadingYear ? (
        <TableLoader />
      ) : (
        <div className="px-1 w-full max-w-full min-w-0 overflow-hidden">
          <CountryTable data={currentData} selectedYear={selectedYear} />
        </div>
      )}
    </div>
  );
}
