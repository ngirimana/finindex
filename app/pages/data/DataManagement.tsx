import React, { useMemo, useState } from "react";
import {
  Database,
  Trash2,
  Info,
  Calendar,
  User,
  Hash,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import type { CountryData } from "../../types";
import {
  useMeQuery,
  useGetAllCountryDataQuery,
  useDeleteCountryDataByYearMutation,
  useDeleteCountryDataByCountryMutation,
  useDeleteCountryDataSelectiveMutation,
} from "~/services/finApi";

interface DataManagementProps {
  getDataInfo: () => any;
  clearData: () => void;
  isAuthenticated: boolean;
  /** If you pass `data`, it's used; otherwise we read from finApi */
  data?: CountryData[];
  updateData?: (newData: CountryData[]) => void;
  currentUser?: any; // no longer needed for headers, kept for compatibility
}

export const DataManagement: React.FC<DataManagementProps> = ({
  getDataInfo,
  clearData,
  isAuthenticated,
  data = [],
  updateData,
}) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  // Auth/user (optional, useful if you want to gate admin)
  const { data: me } = useMeQuery();

  // Pull from API if parent didn't pass data
  const { data: apiData = [], isLoading: loadingAll } =
    useGetAllCountryDataQuery();

  // Prefer prop `data` if provided; else use API data
  const dataset: any[] = useMemo(
    () => (data?.length ? data : apiData),
    [data, apiData]
  );

  const dataInfo = getDataInfo();

  // RTK Query mutations
  const [deleteByYear, { isLoading: deletingYear }] =
    useDeleteCountryDataByYearMutation();
  const [deleteByCountry, { isLoading: deletingCountry }] =
    useDeleteCountryDataByCountryMutation();
  const [deleteSelective, { isLoading: deletingSelective }] =
    useDeleteCountryDataSelectiveMutation();

  if (!isAuthenticated) return null;

  // Unique years/countries from dataset
  const availableYears = useMemo(
    () => [...new Set(dataset.map((item) => item.year))].sort((a, b) => b - a),
    [dataset]
  );
  const availableCountries = useMemo(
    () => [...new Set(dataset.map((item) => item.name))].sort(),
    [dataset]
  );

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all stored data? This action cannot be undone."
      )
    ) {
      // This is still client-side clear (no backend endpoint for "clear all")
      clearData?.();
      setShowDeleteOptions(false);
    }
  };

  const handleDeleteByYear = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete all data for year ${selectedYear}? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await deleteByYear(selectedYear).unwrap();
      alert(
        `Successfully deleted ${res.deletedCount ?? 0} records for year ${selectedYear}`
      );

      if (updateData) {
        const remaining = dataset.filter((item) => item.year !== selectedYear);
        updateData(remaining);
      }
      setShowDeleteOptions(false);
    } catch (e: any) {
      alert(
        `Failed to delete data by year: ${e?.data?.message || e?.message || "Unknown error"}`
      );
    }
  };

  const handleDeleteByCountry = async () => {
    if (!selectedCountry) return;
    if (
      !window.confirm(
        `Are you sure you want to delete all data for ${selectedCountry}? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await deleteByCountry(selectedCountry).unwrap();
      alert(
        `Successfully deleted ${res.deletedCount ?? 0} records for ${selectedCountry}`
      );

      if (updateData) {
        const remaining = dataset.filter(
          (item) => item.name !== selectedCountry
        );
        updateData(remaining);
      }
      setShowDeleteOptions(false);
    } catch (e: any) {
      alert(
        `Failed to delete data by country: ${e?.data?.message || e?.message || "Unknown error"}`
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRecords.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRecords.length} selected records? This action cannot be undone.`
      )
    )
      return;

    // Map UI selections like "Kenya-2023" -> record._id
    const ids = selectedRecords
      .map((rid) => {
        const [name, yearStr] = rid.split("-");
        const year = parseInt(yearStr, 10);
        const record = dataset.find((d) => d.name === name && d.year === year);
        return record?._id;
      })
      .filter(Boolean) as string[];

    if (ids.length === 0) {
      alert("No valid records found to delete");
      return;
    }

    try {
      const res = await deleteSelective({ ids }).unwrap();
      alert(`Successfully deleted ${res.deletedCount ?? 0} selected records`);

      if (updateData) {
        const remaining = dataset.filter(
          (item) => !selectedRecords.includes(`${item.name}-${item.year}`)
        );
        updateData(remaining);
      }
      setSelectedRecords([]);
      setShowDeleteOptions(false);
    } catch (e: any) {
      alert(
        `Failed to delete selected records: ${e?.data?.message || e?.message || "Unknown error"}`
      );
    }
  };

  const toggleRecordSelection = (recordId: string) =>
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );

  const selectAllRecords = () =>
    setSelectedRecords(dataset.map((item) => `${item.name}-${item.year}`));
  const clearSelection = () => setSelectedRecords([]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Data Management
          </h3>
        </div>

        {/* Delete menu */}
        <div className="relative">
          <button
            onClick={() => setShowDeleteOptions((s) => !s)}
            className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            disabled={loadingAll}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Data</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDeleteOptions && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Selective Data Deletion
                </h4>

                {/* Delete All (client-side clear) */}
                <div className="mb-4">
                  <button
                    onClick={handleClearAllData}
                    className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-red-800">
                          Delete All Data
                        </div>
                        <div className="text-xs text-red-600">
                          Remove all stored data completely (local)
                        </div>
                      </div>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                  </button>
                </div>

                {/* Delete by Year */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delete by Year
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleDeleteByYear}
                      disabled={deletingYear}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {deletingYear ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Delete by Country */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delete by Country
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select Country</option>
                      {availableCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleDeleteByCountry}
                      disabled={!selectedCountry || deletingCountry}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {deletingCountry ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Custom Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Selection
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAllRecords}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearSelection}
                        className="text-xs text-gray-600 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {dataset.map((item) => {
                      const recordId = `${item.name}-${item.year}`;
                      return (
                        <label
                          key={recordId}
                          className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(recordId)}
                            onChange={() => toggleRecordSelection(recordId)}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-700">
                            {item.name} ({item.year})
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedRecords.length === 0 || deletingSelective}
                    className="w-full mt-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {deletingSelective
                      ? "Deleting..."
                      : `Delete Selected (${selectedRecords.length})`}
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteOptions(false)}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      {dataInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Last Updated
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {dataInfo.lastUpdated
                ? `${new Date(dataInfo.lastUpdated).toLocaleDateString()} at ${new Date(
                    dataInfo.lastUpdated
                  ).toLocaleTimeString()}`
                : "Date not available"}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Updated By
              </span>
            </div>
            <p className="text-sm text-green-700">
              {dataInfo.updatedBy || "Unknown"}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Total Records
              </span>
            </div>
            <p className="text-sm text-purple-700">{dataInfo.recordCount}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Available Years
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              {Array.isArray(dataInfo.years) ? dataInfo.years.join(", ") : "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {loadingAll
              ? "Loading data..."
              : "No stored data information available"}
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Data Persistence Info:
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Data is automatically saved to browser storage when uploaded</p>
          <p>• Data persists across browser sessions for up to 30 days</p>
          <p>• Only authenticated admins can modify data</p>
          <p>• All data changes are tracked with timestamps and user info</p>
          <p>
            • Selective deletion allows removing specific years, countries, or
            records
          </p>
        </div>
      </div>
    </div>
  );
};
