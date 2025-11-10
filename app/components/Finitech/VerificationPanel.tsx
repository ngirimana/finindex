// src/components/fintech/startups/VerificationPanel.tsx
import React from "react";

type PendingStartup = {
  _id: string;
  name: string;
  country: string;
  sector: string | string[];
  foundedYear: number;
  addedAt?: number;
  addedBy?: string;
};

type Notice = { type: "success" | "error"; message: string } | null;

type Props = {
  isAdmin: boolean;
  pending: PendingStartup[];
  loading: boolean;
  notice: Notice;
  onVerifyAll: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, notes?: string) => void;
  pendingDisplayCount: number;
  setPendingDisplayCount: (n: number) => void;
};

const VerificationPanel: React.FC<Props> = ({
  isAdmin,
  pending,
  loading,
  notice,
  onVerifyAll,
  onApprove,
  onReject,
  pendingDisplayCount,
  setPendingDisplayCount,
}) => {
  if (!isAdmin) return null;

  return (
    <div className="panel-soft border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-600 rounded-lg grid place-items-center text-white text-xs">
            ✓
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            Startup Verification
          </h3>
        </div>
        {pending.length > 0 && (
          <button
            onClick={onVerifyAll}
            className="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700 text-xs font-medium"
          >
            ✅ Verify All ({pending.length})
          </button>
        )}
      </div>

      {notice && (
        <div
          className={`mb-3 p-2 rounded text-xs ${notice.type === "success" ? "chip-cream" : "chip-sand"}`}
        >
          {notice.message}
        </div>
      )}

      {loading ? (
        <p className="text-brand-600 text-sm">Loading pending startups...</p>
      ) : pending.length === 0 ? (
        <p className="text-brand-600 text-sm">
          No startups pending verification.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">{pending.length}</span> startup(s)
            awaiting verification
            {pending.length > 3 && (
              <span className="ml-2 text-brand-600">
                (Showing {Math.min(pendingDisplayCount, pending.length)} of{" "}
                {pending.length})
              </span>
            )}
          </p>

          {pending.slice(0, pendingDisplayCount).map((startup) => (
            <div
              key={startup._id}
              className="border border-gray-200 rounded p-2 bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {startup.name}
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>📍 {startup.country}</p>
                    <p>
                      🏢{" "}
                      {Array.isArray(startup.sector)
                        ? startup.sector.join(", ")
                        : startup.sector}
                    </p>
                    <p>📅 Founded: {startup.foundedYear}</p>
                    {startup.addedAt && (
                      <p>
                        📤 Added:{" "}
                        {new Date(startup.addedAt).toLocaleDateString()}
                      </p>
                    )}
                    {startup.addedBy && <p>👤 By: {startup.addedBy}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(startup._id)}
                    className="px-2 py-1 bg-brand-600 text-white rounded hover:bg-brand-700 text-xs font-medium"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => {
                      const notes =
                        prompt("Rejection reason (optional):") || "";
                      onReject(startup._id, notes);
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2 justify-center">
            {pending.length > pendingDisplayCount && (
              <button
                onClick={() => setPendingDisplayCount(pendingDisplayCount + 3)}
                className="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700 text-xs font-medium"
              >
                Show More ({pending.length - pendingDisplayCount} more)
              </button>
            )}
            {pendingDisplayCount > 3 && (
              <button
                onClick={() => setPendingDisplayCount(3)}
                className="px-3 py-1 btn-outline rounded text-xs font-medium"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPanel;
