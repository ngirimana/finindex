import React from "react";
import type { AppUser } from "~/services/finApi";

export default function AllUsersList({
  loading,
  users,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
}: {
  loading: boolean;
  users: AppUser[];
  search: string;
  onSearch: (v: string) => void;
  onView: (u: AppUser) => void;
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6B3A1E]/30 border-b-[#6B3A1E]" />
        <span className="ml-3 text-[#6B3A1E]/70">Loading users...</span>
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#6B3A1E]/30 text-6xl mb-4">👥</div>
        <p className="text-[#6B3A1E]/70 text-lg">No users found</p>
      </div>
    );
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="w-full pl-10 pr-4 py-3 border border-[#D9CBBE] rounded-lg focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent bg-white text-[#6B3A1E]"
          placeholder="Search users by email or name..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-[#6B3A1E]/40">🔍</span>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-lg border border-[#D9CBBE] hover:bg-white transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  user.isVerified ? "bg-[#E5B97C]/60" : "bg-red-100"
                }`}
              >
                <span
                  className={`font-semibold text-sm ${
                    user.isVerified ? "text-[#6B3A1E]" : "text-red-700"
                  }`}
                >
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-[#6B3A1E]">{user.email}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#6B3A1E]/70 capitalize">
                    {user.role}
                  </span>
                  {user.isVerified ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5B97C] text-[#6B3A1E]">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      ✕ Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 bg-white text-[#6B3A1E] border border-[#D9CBBE] rounded-lg hover:bg-[#F8F6F3] transition-colors font-medium text-sm"
                onClick={() => onView(user)}
              >
                View
              </button>
              <button
                className="px-4 py-2 bg-[#6B3A1E] text-[#FCEFD6] rounded-lg hover:bg-[#8B4A2A] transition-colors font-medium text-sm"
                onClick={() => onEdit(user)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                onClick={() => onDelete(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
