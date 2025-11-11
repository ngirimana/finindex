import React from "react";
import type { AppUser } from "~/services/finApi";

export default function ViewProfileModal({
  user,
  onClose,
  onEdit,
}: {
  user: AppUser | null;
  onClose: () => void;
  onEdit: (u: AppUser) => void;
}) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto border border-[#D9CBBE]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-[#6B3A1E]">User Profile</h4>
          <button
            onClick={onClose}
            className="text-[#6B3A1E]/50 hover:text-[#6B3A1E] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-[#F8F6F3] rounded-lg border border-[#D9CBBE]">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                user.isVerified ? "bg-[#6B3A1E]" : "bg-red-600"
              }`}
            >
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="text-lg font-semibold text-[#6B3A1E]">
                {user.name || "N/A"}
              </h5>
              <p className="text-[#6B3A1E]/80">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-[#E5B97C] text-[#6B3A1E]"
                      : "bg-[#F8F6F3] text-[#6B3A1E] border border-[#D9CBBE]"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isVerified
                      ? "bg-[#E5B97C] text-[#6B3A1E]"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-[#6B3A1E]">
            <div className="grid grid-cols-2 gap-4">
              {user.country && (
                <div>
                  <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                    Country
                  </label>
                  <p className="text-sm">{user.country}</p>
                </div>
              )}
              {user.organization && (
                <div>
                  <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                    Organization
                  </label>
                  <p className="text-sm">{user.organization}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {user.jobTitle && (
                <div>
                  <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                    Job Title
                  </label>
                  <p className="text-sm">{user.jobTitle}</p>
                </div>
              )}
              {user.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm">{user.phoneNumber}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                Registration Date
              </label>
              <p className="text-sm">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>

            {user.lastLogin && (
              <div>
                <label className="block text-sm font-medium text-[#6B3A1E]/70 mb-1">
                  Last Login
                </label>
                <p className="text-sm">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-[#D9CBBE]">
            <button
              className="flex-1 px-4 py-2 bg-[#6B3A1E] text-[#FCEFD6] rounded-lg hover:bg-[#8B4A2A] transition-colors font-medium text-sm"
              onClick={() => onEdit(user)}
            >
              Edit User
            </button>
            <button
              className="flex-1 px-4 py-2 bg-white text-[#6B3A1E] border border-[#D9CBBE] rounded-lg hover:bg-[#F8F6F3] transition-colors font-medium text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
