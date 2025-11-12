// import React, { useMemo, useState } from "react";
// import {
//   Database,
//   Trash2,
//   Info,
//   Calendar,
//   User,
//   Hash,
//   AlertTriangle,
//   ChevronDown,
// } from "lucide-react";
// import type { CountryData } from "../../types";
// import {
//   useDeleteAllCountryDataMutation,
//   useDeleteCountryDataByYearMutation,
//   useDeleteCountryDataByCountryMutation,
//   useDeleteSelectiveCountryDataMutation,
// } from "~/services/finApi";

// interface DataManagementProps {
//   isAuthenticated: boolean;
//   data?: CountryData[];
//   years?: number[];
//   refetchAll?: () => void; // refetch country data
//   refetchYears?: () => void; // refetch available years
// }

// export const DataManagement: React.FC<DataManagementProps> = ({
//   isAuthenticated,
//   data = [],
//   years = [],
//   refetchAll,
//   refetchYears,
// }) => {
//   const [showDeleteOptions, setShowDeleteOptions] = useState(false);
//   const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? 2024);
//   const [selectedCountry, setSelectedCountry] = useState<string>("");
//   const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

//   const [deleteAll, { isLoading: deletingAll }] =
//     useDeleteAllCountryDataMutation();
//   const [deleteByYear, { isLoading: deletingYear }] =
//     useDeleteCountryDataByYearMutation();
//   const [deleteByCountry, { isLoading: deletingCountry }] =
//     useDeleteCountryDataByCountryMutation();
//   const [deleteSelective, { isLoading: deletingSelective }] =
//     useDeleteSelectiveCountryDataMutation();

//   const dataInfo = useMemo(() => {
//     if (!data.length) return null;
//     const yrs = years.slice().sort((a, b) => b - a);
//     return {
//       recordCount: data.length,
//       years: yrs,
//       lastUpdated: new Date(),
//       updatedBy: "Database",
//     };
//   }, [data, years]);

//   if (!isAuthenticated) return null;

//   const availableYears = years.slice().sort((a, b) => b - a);
//   const availableCountries = useMemo(
//     () => [...new Set(data.map((item) => item.name))].sort(),
//     [data]
//   );

//   const refresh = () => {
//     refetchAll?.();
//     refetchYears?.();
//   };

//   const handleClearAllData = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to clear all stored data? This action cannot be undone."
//       )
//     )
//       return;
//     try {
//       const res: any = await deleteAll().unwrap();
//       alert(
//         `All data cleared. ${res?.deletedCount ?? 0} records deleted. Before: ${
//           res?.beforeCount ?? "—"
//         }, After: ${res?.afterCount ?? "—"}`
//       );
//       setShowDeleteOptions(false);
//       refresh();
//     } catch (e: any) {
//       alert(`Failed to clear data: ${e?.data?.message ?? e?.message ?? e}`);
//     }
//   };

//   const handleDeleteByYear = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete all data for year ${selectedYear}? This action cannot be undone.`
//       )
//     )
//       return;
//     try {
//       const res: any = await deleteByYear({ year: selectedYear }).unwrap();
//       alert(
//         `Successfully deleted ${res?.deletedCount ?? 0} records for year ${selectedYear}`
//       );
//       setShowDeleteOptions(false);
//       refresh();
//     } catch (e: any) {
//       alert(
//         `Failed to delete data by year: ${e?.data?.message ?? e?.message ?? e}`
//       );
//     }
//   };

//   const handleDeleteByCountry = async () => {
//     if (!selectedCountry) return;
//     if (
//       !window.confirm(
//         `Are you sure you want to delete all data for ${selectedCountry}? This action cannot be undone.`
//       )
//     )
//       return;
//     try {
//       const res: any = await deleteByCountry({
//         country: selectedCountry,
//       }).unwrap();
//       alert(
//         `Successfully deleted ${res?.deletedCount ?? 0} records for ${selectedCountry}`
//       );
//       setShowDeleteOptions(false);
//       refresh();
//     } catch (e: any) {
//       alert(
//         `Failed to delete data by country: ${
//           e?.data?.message ?? e?.message ?? e
//         }`
//       );
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedRecords.length === 0) return;
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedRecords.length} selected records? This action cannot be undone.`
//       )
//     )
//       return;

//     const recordIds = selectedRecords
//       .map((rid) => {
//         const [name, year] = rid.split("-");
//         const found = data.find(
//           (d) => d.name === name && d.year === Number(year)
//         );
//         return (found as any)?._id;
//       })
//       .filter(Boolean);

//     if (recordIds.length === 0) {
//       alert("No valid records found to delete");
//       return;
//     }

//     try {
//       const res: any = await deleteSelective({ ids: recordIds }).unwrap();
//       alert(`Successfully deleted ${res?.deletedCount ?? 0} selected records`);
//       setSelectedRecords([]);
//       setShowDeleteOptions(false);
//       refresh();
//     } catch (e: any) {
//       alert(
//         `Failed to delete selected records: ${
//           e?.data?.message ?? e?.message ?? e
//         }`
//       );
//     }
//   };

//   const toggleRecordSelection = (recordId: string) => {
//     setSelectedRecords((prev) =>
//       prev.includes(recordId)
//         ? prev.filter((id) => id !== recordId)
//         : [...prev, recordId]
//     );
//   };

//   const selectAllRecords = () => {
//     const allRecordIds = data.map((item) => `${item.name}-${item.year}`);
//     setSelectedRecords(allRecordIds);
//   };

//   const clearSelection = () => setSelectedRecords([]);

//   const anyDeleting =
//     deletingAll || deletingYear || deletingCountry || deletingSelective;

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <Database className="w-5 h-5 text-blue-600" />
//           <h3 className="text-lg font-semibold text-gray-900">
//             Data Management
//           </h3>
//         </div>

//         {/* Selective Delete Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setShowDeleteOptions((s) => !s)}
//             disabled={anyDeleting}
//             className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
//           >
//             <Trash2 className="w-4 h-4" />
//             <span>{anyDeleting ? "Working..." : "Delete Data"}</span>
//             <ChevronDown className="w-4 h-4" />
//           </button>

//           {showDeleteOptions && (
//             <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//               <div className="p-4">
//                 <h4 className="text-sm font-semibold text-gray-900 mb-3">
//                   Selective Data Deletion
//                 </h4>

//                 {/* Delete All */}
//                 <div className="mb-4">
//                   <button
//                     onClick={handleClearAllData}
//                     className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="font-medium text-red-800">
//                           Delete All Data
//                         </div>
//                         <div className="text-xs text-red-600">
//                           Remove all stored data completely
//                         </div>
//                       </div>
//                       <AlertTriangle className="w-4 h-4 text-red-600" />
//                     </div>
//                   </button>
//                 </div>

//                 {/* Delete by Year */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Delete by Year
//                   </label>
//                   <div className="flex space-x-2">
//                     <select
//                       value={selectedYear}
//                       onChange={(e) => setSelectedYear(Number(e.target.value))}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                     >
//                       {availableYears.map((year) => (
//                         <option key={year} value={year}>
//                           {year}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={handleDeleteByYear}
//                       className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>

//                 {/* Delete by Country */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Delete by Country
//                   </label>
//                   <div className="flex space-x-2">
//                     <select
//                       value={selectedCountry}
//                       onChange={(e) => setSelectedCountry(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                     >
//                       <option value="">Select Country</option>
//                       {availableCountries.map((country) => (
//                         <option key={country} value={country}>
//                           {country}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={handleDeleteByCountry}
//                       disabled={!selectedCountry}
//                       className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>

//                 {/* Custom Selection */}
//                 <div className="mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Custom Selection
//                     </label>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={selectAllRecords}
//                         className="text-xs text-blue-600 hover:text-blue-700"
//                       >
//                         Select All
//                       </button>
//                       <button
//                         onClick={clearSelection}
//                         className="text-xs text-gray-600 hover:text-gray-700"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   </div>

//                   <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
//                     {data.map((item) => {
//                       const recordId = `${item.name}-${item.year}`;
//                       return (
//                         <label
//                           key={recordId}
//                           className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selectedRecords.includes(recordId)}
//                             onChange={() => toggleRecordSelection(recordId)}
//                             className="rounded"
//                           />
//                           <span className="text-xs text-gray-700">
//                             {item.name} ({item.year})
//                           </span>
//                         </label>
//                       );
//                     })}
//                   </div>

//                   <button
//                     onClick={handleDeleteSelected}
//                     disabled={selectedRecords.length === 0}
//                     className="w-full mt-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Delete Selected ({selectedRecords.length})
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowDeleteOptions(false)}
//                   className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {dataInfo ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-blue-50 rounded-lg p-4">
//             <div className="flex items-center space-x-2 mb-2">
//               <Calendar className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-medium text-blue-800">
//                 Last Updated
//               </span>
//             </div>
//             <p className="text-sm text-blue-700">
//               {dataInfo.lastUpdated
//                 ? `${new Date(dataInfo.lastUpdated).toLocaleDateString()} at ${new Date(
//                     dataInfo.lastUpdated
//                   ).toLocaleTimeString()}`
//                 : "Date not available"}
//             </p>
//           </div>

//           <div className="bg-green-50 rounded-lg p-4">
//             <div className="flex items-center space-x-2 mb-2">
//               <User className="w-4 h-4 text-green-600" />
//               <span className="text-sm font-medium text-green-800">
//                 Updated By
//               </span>
//             </div>
//             <p className="text-sm text-green-700">{dataInfo.updatedBy}</p>
//           </div>

//           <div className="bg-purple-50 rounded-lg p-4">
//             <div className="flex items-center space-x-2 mb-2">
//               <Hash className="w-4 h-4 text-purple-600" />
//               <span className="text-sm font-medium text-purple-800">
//                 Total Records
//               </span>
//             </div>
//             <p className="text-sm text-purple-700">{dataInfo.recordCount}</p>
//           </div>

//           <div className="bg-yellow-50 rounded-lg p-4">
//             <div className="flex items-center space-x-2 mb-2">
//               <Info className="w-4 h-4 text-yellow-600" />
//               <span className="text-sm font-medium text-yellow-800">
//                 Available Years
//               </span>
//             </div>
//             <p className="text-sm text-yellow-700">
//               {dataInfo.years.join(", ")}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">No stored data information available</p>
//         </div>
//       )}

//       <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//         <h4 className="text-sm font-medium text-gray-900 mb-2">
//           Data Persistence Info:
//         </h4>
//         <div className="text-xs text-gray-600 space-y-1">
//           <p>• Data is stored in the backend</p>
//           <p>• Only authenticated admins/editors can modify data</p>
//           <p>• All data changes are tracked with timestamps and user info</p>
//           <p>
//             • Selective deletion allows removing specific years, countries, or
//             records
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

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
  useDeleteAllCountryDataMutation,
  useDeleteCountryDataByYearMutation,
  useDeleteCountryDataByCountryMutation,
  useDeleteSelectiveCountryDataMutation,
} from "~/services/finApi";

interface DataManagementProps {
  isAuthenticated: boolean;
  data?: CountryData[];
  years?: number[];
  refetchAll?: () => void; // refetch country data
  refetchYears?: () => void; // refetch available years
}

const COLORS = {
  primary: "#71391A", // Coffee (matches your header)
  primaryDark: "#5E2F15",
  primaryMid: "#8A4A26",
  primaryLight: "#EEDFD4", // Light coffee background
  primaryLighter: "#F6EEE7", // Even lighter panel bg
  accent: "#E6C089", // Warm accent / gold
  textDark: "#2A1C14",
  textMuted: "#6B4E3D",
  border: "#CBA98E",
};

export const DataManagement: React.FC<DataManagementProps> = ({
  isAuthenticated,
  data = [],
  years = [],
  refetchAll,
  refetchYears,
}) => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? 2024);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  const [deleteAll, { isLoading: deletingAll }] =
    useDeleteAllCountryDataMutation();
  const [deleteByYear, { isLoading: deletingYear }] =
    useDeleteCountryDataByYearMutation();
  const [deleteByCountry, { isLoading: deletingCountry }] =
    useDeleteCountryDataByCountryMutation();
  const [deleteSelective, { isLoading: deletingSelective }] =
    useDeleteSelectiveCountryDataMutation();

  const dataInfo = useMemo(() => {
    if (!data.length) return null;
    const yrs = years.slice().sort((a, b) => b - a);
    return {
      recordCount: data.length,
      years: yrs,
      lastUpdated: new Date(),
      updatedBy: "Database",
    };
  }, [data, years]);

  if (!isAuthenticated) return null;

  const availableYears = years.slice().sort((a, b) => b - a);
  const availableCountries = useMemo(
    () => [...new Set(data.map((item) => item.name))].sort(),
    [data]
  );

  const refresh = () => {
    refetchAll?.();
    refetchYears?.();
  };

  const handleClearAllData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all stored data? This action cannot be undone."
      )
    )
      return;
    try {
      const res: any = await deleteAll().unwrap();
      alert(
        `All data cleared. ${res?.deletedCount ?? 0} records deleted. Before: ${
          res?.beforeCount ?? "—"
        }, After: ${res?.afterCount ?? "—"}`
      );
      setShowDeleteOptions(false);
      refresh();
    } catch (e: any) {
      alert(`Failed to clear data: ${e?.data?.message ?? e?.message ?? e}`);
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
      const res: any = await deleteByYear({ year: selectedYear }).unwrap();
      alert(
        `Successfully deleted ${res?.deletedCount ?? 0} records for year ${selectedYear}`
      );
      setShowDeleteOptions(false);
      refresh();
    } catch (e: any) {
      alert(
        `Failed to delete data by year: ${e?.data?.message ?? e?.message ?? e}`
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
      const res: any = await deleteByCountry({
        country: selectedCountry,
      }).unwrap();
      alert(
        `Successfully deleted ${res?.deletedCount ?? 0} records for ${selectedCountry}`
      );
      setShowDeleteOptions(false);
      refresh();
    } catch (e: any) {
      alert(
        `Failed to delete data by country: ${
          e?.data?.message ?? e?.message ?? e
        }`
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

    const recordIds = selectedRecords
      .map((rid) => {
        const [name, year] = rid.split("-");
        const found = data.find(
          (d) => d.name === name && d.year === Number(year)
        );
        return (found as any)?._id;
      })
      .filter(Boolean);

    if (recordIds.length === 0) {
      alert("No valid records found to delete");
      return;
    }

    try {
      const res: any = await deleteSelective({ ids: recordIds }).unwrap();
      alert(`Successfully deleted ${res?.deletedCount ?? 0} selected records`);
      setSelectedRecords([]);
      setShowDeleteOptions(false);
      refresh();
    } catch (e: any) {
      alert(
        `Failed to delete selected records: ${
          e?.data?.message ?? e?.message ?? e
        }`
      );
    }
  };

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const selectAllRecords = () => {
    const allRecordIds = data.map((item) => `${item.name}-${item.year}`);
    setSelectedRecords(allRecordIds);
  };

  const clearSelection = () => setSelectedRecords([]);

  const anyDeleting =
    deletingAll || deletingYear || deletingCountry || deletingSelective;

  return (
    <div
      className="rounded-lg shadow-sm border p-6 mb-6"
      style={{
        backgroundColor: COLORS.primaryLighter,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5" style={{ color: COLORS.primaryMid }} />
          <h3
            className="text-lg font-semibold"
            style={{ color: COLORS.textDark }}
          >
            Data Management
          </h3>
        </div>

        {/* Selective Delete Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDeleteOptions((s) => !s)}
            disabled={anyDeleting}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
            style={{
              backgroundColor: anyDeleting
                ? COLORS.primaryDark
                : COLORS.primary,
              color: "#F8F3ED",
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span>{anyDeleting ? "Working..." : "Delete Data"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDeleteOptions && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg z-50 border"
              style={{ backgroundColor: "#fff", borderColor: COLORS.border }}
            >
              <div className="p-4">
                <h4
                  className="text-sm font-semibold mb-3"
                  style={{ color: COLORS.textDark }}
                >
                  Selective Data Deletion
                </h4>

                {/* Delete All (keep destructive red) */}
                <div className="mb-4">
                  <button
                    onClick={handleClearAllData}
                    className="w-full text-left p-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: "#FDECEC",
                      borderColor: "#F2B8B5",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: "#7F1D1D" }}
                        >
                          Delete All Data
                        </div>
                        <div className="text-xs" style={{ color: "#B91C1C" }}>
                          Remove all stored data completely
                        </div>
                      </div>
                      <AlertTriangle
                        className="w-4 h-4"
                        style={{ color: "#DC2626" }}
                      />
                    </div>
                  </button>
                </div>

                {/* Delete by Year */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.textMuted }}
                  >
                    Delete by Year
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: COLORS.border }}
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleDeleteByYear}
                      className="px-3 py-2 rounded-lg text-white transition-colors text-sm"
                      style={{ backgroundColor: COLORS.primaryMid }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete by Country */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.textMuted }}
                  >
                    Delete by Country
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: COLORS.border }}
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
                      disabled={!selectedCountry}
                      className="px-3 py-2 rounded-lg text-white transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: COLORS.primaryMid }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Custom Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: COLORS.textMuted }}
                    >
                      Custom Selection
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAllRecords}
                        className="text-xs"
                        style={{ color: COLORS.primary }}
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearSelection}
                        className="text-xs"
                        style={{ color: COLORS.textMuted }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div
                    className="max-h-32 overflow-y-auto rounded-lg p-2 border"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: "#fff",
                    }}
                  >
                    {data.map((item) => {
                      const recordId = `${item.name}-${item.year}`;
                      return (
                        <label
                          key={recordId}
                          className="flex items-center space-x-2 p-1 rounded"
                          style={{ color: COLORS.textMuted }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(recordId)}
                            onChange={() => toggleRecordSelection(recordId)}
                            className="rounded"
                          />
                          <span className="text-xs">
                            {item.name} ({item.year})
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedRecords.length === 0}
                    className="w-full mt-2 px-3 py-2 rounded-lg text-white transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: COLORS.primaryMid }}
                  >
                    Delete Selected ({selectedRecords.length})
                  </button>
                </div>

                <button
                  onClick={() => setShowDeleteOptions(false)}
                  className="w-full px-3 py-2 rounded-lg transition-colors text-sm"
                  style={{
                    backgroundColor: COLORS.primaryLight,
                    color: COLORS.textMuted,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {dataInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Last Updated */}
          <div
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Calendar
                className="w-4 h-4"
                style={{ color: COLORS.primaryMid }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.primaryDark }}
              >
                Last Updated
              </span>
            </div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {dataInfo.lastUpdated
                ? `${new Date(dataInfo.lastUpdated).toLocaleDateString()} at ${new Date(
                    dataInfo.lastUpdated
                  ).toLocaleTimeString()}`
                : "Date not available"}
            </p>
          </div>

          {/* Updated By */}
          <div
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4" style={{ color: COLORS.primaryMid }} />
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.primaryDark }}
              >
                Updated By
              </span>
            </div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {dataInfo.updatedBy}
            </p>
          </div>

          {/* Total Records */}
          <div
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4" style={{ color: COLORS.primaryMid }} />
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.primaryDark }}
              >
                Total Records
              </span>
            </div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {dataInfo.recordCount}
            </p>
          </div>

          {/* Available Years */}
          <div
            className="rounded-lg p-4 border"
            style={{
              backgroundColor: COLORS.primaryLight,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4" style={{ color: COLORS.primaryMid }} />
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.primaryDark }}
              >
                Available Years
              </span>
            </div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {dataInfo.years.join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Database
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: COLORS.border }}
          />
          <p style={{ color: COLORS.textMuted }}>
            No stored data information available
          </p>
        </div>
      )}

      <div
        className="mt-4 p-4 rounded-lg"
        style={{ backgroundColor: COLORS.primaryLight }}
      >
        <h4
          className="text-sm font-medium mb-2"
          style={{ color: COLORS.primaryDark }}
        >
          Data Persistence Info:
        </h4>
        <div className="text-xs space-y-1" style={{ color: COLORS.textMuted }}>
          <p>• Data is stored in the backend</p>
          <p>• Only authenticated admins/editors can modify data</p>
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
