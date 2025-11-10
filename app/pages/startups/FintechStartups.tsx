import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Search } from "lucide-react";
import { useCoffeeBrandTheme } from "~/components/Finitech/brandStyles";
import HeaderActions from "~/components/Finitech/HeaderActions";
import FiltersBar from "~/components/Finitech/FiltersBar";
import AddStartupForm from "~/components/Finitech/AddStartupForm";
import VerificationPanel from "~/components/Finitech/VerificationPanel";
import StartupCard from "~/components/Finitech/StartupCard";
import UploadGuideModal from "~/components/Finitech/UploadGuideModal";
import { parseSectors } from "~/components/Finitech/utils";
import type { FintechStartup } from "~/services/finApi";

import {
  useGetStartupsQuery,
  useGetPendingStartupsQuery,
  useCreateStartupMutation,
  useDeleteStartupMutation,
  useBulkUploadStartupsMutation,
  useVerifyStartupMutation,
  useBulkVerifyStartupsMutation,
} from "~/services/finApi";
import { StartupGridSkeleton } from "~/components/Finitech/StartupCardSkeleton";

type Props = { currentUser: any; selectedYear?: number };

const FiniTechStartups: React.FC<Props> = ({ currentUser }) => {
  useCoffeeBrandTheme();

  // UI state
  const [uploadStatus, setUploadStatus] = useState("");
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [pendingDisplayCount, setPendingDisplayCount] = useState(3);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [newStartup, setNewStartup] = useState({
    name: "",
    country: "",
    sector: "",
    foundedYear: new Date().getFullYear(),
    description: "",
    website: "",
  });

  // Data
  const {
    data: startups = [],
    isLoading,
    isError,
    error,
    refetch: refetchStartups,
  } = useGetStartupsQuery();
  const {
    data: pendingStartups = [],
    isLoading: loadingPending,
    refetch: refetchPending,
  } = useGetPendingStartupsQuery(undefined, {
    skip: currentUser?.role !== "admin",
  });

  const [addStartup, { isLoading: adding }] = useCreateStartupMutation();
  const [deleteStartup] = useDeleteStartupMutation();
  const [bulkUploadStartups] = useBulkUploadStartupsMutation();
  const [verifyStartup] = useVerifyStartupMutation();
  const [bulkVerifyStartups] = useBulkVerifyStartupsMutation();

  // Derived
  const allSectors = useMemo(() => {
    const set = new Set<string>();
    startups.forEach((s: any) =>
      parseSectors(s.sector).forEach((x) => set.add(x))
    );
    return Array.from(set).sort();
  }, [startups]);

  const sectors = allSectors;
  const filteredStartups = useMemo(() => {
    const s = searchTerm.toLowerCase();
    const filtered = (startups as FintechStartup[]).filter((st) => {
      const matchesSearch =
        !searchTerm ||
        st.name.toLowerCase().includes(s) ||
        (st.description ?? "").toLowerCase().includes(s) ||
        (st.website ?? "").toLowerCase().includes(s);
      const matchesCountry = !selectedCountry || st.country === selectedCountry;
      const matchesSector =
        !selectedSector ||
        parseSectors(st.sector as any).some((sec) =>
          sec.toLowerCase().includes(selectedSector.toLowerCase())
        );
      return matchesSearch && matchesCountry && matchesSector;
    });
    return filtered.sort(
      (a, b) => Number(b.foundedYear || 0) - Number(a.foundedYear || 0)
    );
  }, [startups, searchTerm, selectedCountry, selectedSector]);

  const displayed = filteredStartups.slice(0, displayCount);
  const hasMore = filteredStartups.length > displayCount;

  useEffect(() => setPendingDisplayCount(3), [pendingStartups.length]);

  // Actions
  const handleAddStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please sign in to add startups");
      return;
    }

    try {
      await addStartup({
        ...newStartup,
        addedBy: currentUser.name || currentUser.email,
        addedAt: Date.now(),
      } as any).unwrap();

      setShowAddForm(false);
      setNewStartup({
        name: "",
        country: "",
        sector: "",
        foundedYear: new Date().getFullYear(),
        description: "",
        website: "",
      });
      refetchStartups();
      setNotice({ type: "success", message: "Startup added." });
    } catch (err: any) {
      setNotice({
        type: "error",
        message: err?.data?.error || "Failed to add startup",
      });
    } finally {
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleDeleteStartup = async (startupId: string) => {
    if (!currentUser?.role || !["admin", "editor"].includes(currentUser.role)) {
      alert("Access denied.");
      return;
    }
    if (!confirm("Delete this startup permanently?")) return;
    try {
      await deleteStartup(startupId as any).unwrap();
      refetchStartups();
      setNotice({ type: "success", message: "Startup deleted." });
    } catch (err: any) {
      setNotice({
        type: "error",
        message: err?.data?.error || "Failed to delete",
      });
    } finally {
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      setUploadStatus("Invalid file format!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("File too large! Max 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);

        const required = [
          "Organization Name",
          "Headquarters Location",
          "Industries",
          "Founded Date",
        ];
        const missing = required.filter(
          (field) =>
            !Object.keys((json[0] as any) || {}).some(
              (col) =>
                col
                  .toLowerCase()
                  .includes(field.toLowerCase().replace(/\s+/g, "")) ||
                col.toLowerCase().includes(field.toLowerCase().split(" ")[0])
            )
        );
        if (missing.length) {
          setUploadStatus(`Missing required fields: ${missing.join(", ")}`);
          return;
        }

        setUploadStatus("Uploading...");
        await (bulkUploadStartups as any)({ data: json }).unwrap();
        setUploadStatus("Upload complete");
        refetchStartups();
        if (currentUser?.role === "admin") refetchPending();
      } catch (err: any) {
        setUploadStatus(
          `Bulk upload failed: ${err?.data?.error || "Unknown error"}`
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleVerifyStartup = async (
    startupId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => {
    if (currentUser?.role !== "admin") return;
    const action = status === "approved" ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${action} this startup?`)) return;
    try {
      await (verifyStartup as any)({
        startupId,
        verificationStatus: status,
        adminNotes: notes || "",
      }).unwrap();
      refetchPending();
      refetchStartups();
      setNotice({ type: "success", message: `Startup ${status}.` });
    } catch (err: any) {
      setNotice({
        type: "error",
        message: err?.data?.error || "Failed to verify",
      });
    } finally {
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleVerifyAllStartups = async () => {
    if (
      currentUser?.role !== "admin" ||
      (pendingStartups as any[]).length === 0
    )
      return;
    if (
      !confirm(
        `Approve all ${(pendingStartups as any[]).length} pending startups?`
      )
    )
      return;
    try {
      await (bulkVerifyStartups as any)({
        startupIds: (pendingStartups as any[]).map((s) => s._id),
        verificationStatus: "approved",
        adminNotes: "Bulk approved by admin",
      }).unwrap();
      refetchPending();
      refetchStartups();
      setNotice({
        type: "success",
        message: `All ${(pendingStartups as any[]).length} startups approved.`,
      });
    } catch (err: any) {
      setNotice({
        type: "error",
        message: err?.data?.error || "Bulk verify failed",
      });
    } finally {
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const canAct = Boolean(
    currentUser && ["admin", "editor", "viewer"].includes(currentUser.role)
  );
  const canDelete = Boolean(
    currentUser && ["admin", "editor"].includes(currentUser.role)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-3 md:p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <HeaderActions
          canAct={canAct}
          adding={adding}
          onOpenAdd={() => setShowAddForm(true)}
          onFileChange={handleBulkUpload}
          onOpenGuide={() => setShowUploadGuide(true)}
        />
        <p className="text-xs sm:text-sm text-gray-600 truncate mt-2 sm:mt-0">
          {filteredStartups.length} of {startups.length} startups across Africa
          {(searchTerm || selectedCountry || selectedSector) && (
            <span className="text-brand-600 font-medium"> (filtered)</span>
          )}
        </p>
      </div>

      {/* Admin verification */}
      <VerificationPanel
        isAdmin={currentUser?.role === "admin"}
        pending={pendingStartups as any[]}
        loading={loadingPending}
        notice={notice}
        onVerifyAll={handleVerifyAllStartups}
        onApprove={(id) => handleVerifyStartup(id, "approved")}
        onReject={(id, notes) => handleVerifyStartup(id, "rejected", notes)}
        pendingDisplayCount={pendingDisplayCount}
        setPendingDisplayCount={setPendingDisplayCount}
      />

      {/* upload status */}
      {uploadStatus && (
        <div
          className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded text-xs sm:text-sm ${uploadStatus.startsWith("✅") ? "chip-cream" : "chip-sand"}`}
        >
          {uploadStatus}
        </div>
      )}

      {/* filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <FiltersBar
          searchTerm={searchTerm}
          selectedCountry={selectedCountry}
          selectedSector={selectedSector}
          sectors={sectors}
          setSearchTerm={setSearchTerm}
          setSelectedCountry={setSelectedCountry}
          setSelectedSector={setSelectedSector}
          clearAll={() => {
            setSearchTerm("");
            setSelectedCountry("");
            setSelectedSector("");
          }}
        />
      </div>

      {/* Add form */}
      {showAddForm && (
        <AddStartupForm
          newStartup={newStartup}
          setNewStartup={setNewStartup}
          onSubmit={handleAddStartup}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Grid / List */}
      {isLoading ? (
        // <div className="text-center py-8">
        //   <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        //   <p className="text-sm text-gray-600">Loading startups...</p>
        // </div>
        <StartupGridSkeleton count={6} />
      ) : isError ? (
        <div className="text-red-600 text-sm p-4 text-center">
          {(error as any)?.data?.error || "Failed to load startups"}
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="w-16 h-16 chip-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No startups found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCountry || selectedSector
              ? "Try adjusting your search terms or filters."
              : "No startups are currently available."}
          </p>
          {(searchTerm || selectedCountry || selectedSector) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("");
                setSelectedSector("");
              }}
              className="px-4 py-2 btn-primary rounded-lg"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {displayed.map((st, i) => (
              <StartupCard
                key={st.id || (st as any)._id || i}
                startup={st as FintechStartup}
                canDelete={canDelete}
                onDelete={handleDeleteStartup}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={() => setDisplayCount((p) => p + 6)}
                className="px-4 sm:px-6 py-2 sm:py-3 btn-primary rounded-lg text-sm sm:text-base font-medium"
              >
                View More ({Math.min(6, filteredStartups.length - displayCount)}{" "}
                more)
              </button>
            </div>
          )}

          {displayCount > 6 && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={() => setDisplayCount(6)}
                className="px-4 sm:px-6 py-2 sm:py-3 btn-outline rounded-lg text-sm sm:text-base font-medium"
              >
                Show Less
              </button>
            </div>
          )}
        </>
      )}

      {/* Guide modal */}
      <UploadGuideModal
        open={showUploadGuide}
        onClose={() => setShowUploadGuide(false)}
      />
    </div>
  );
};

export default FiniTechStartups;
