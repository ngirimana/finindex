import React from "react";
import type { AppUser } from "~/services/finApi";

export default function UnverifiedUsers({
  loading,
  users,
  onVerify,
}: {
  loading: boolean;
  users: AppUser[];
  onVerify: (userId: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#6B3A1E] mb-1">
            Unverified Users
          </h3>
          <p className="text-[#6B3A1E]/70 text-sm">
            Users pending verification
          </p>
        </div>
        <div className="bg-[#E5B97C] text-[#6B3A1E] px-3 py-1 rounded-full text-sm font-medium">
          {users.length} pending
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6B3A1E]/30 border-b-[#6B3A1E]" />
          <span className="ml-3 text-[#6B3A1E]/70">
            Loading unverified users...
          </span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-[#6B3A1E]/30 text-6xl mb-4">✓</div>
          <p className="text-[#6B3A1E]/70 text-lg">All users are verified!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-lg border border-[#D9CBBE] hover:bg-white transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E5B97C]/40 rounded-full flex items-center justify-center">
                  <span className="text-[#6B3A1E] font-semibold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#6B3A1E]">{user.email}</p>
                  <p className="text-sm text-[#6B3A1E]/70 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-[#6B3A1E] text-[#FCEFD6] rounded-lg hover:bg-[#8B4A2A] transition-colors font-medium text-sm"
                onClick={() => onVerify(user._id)}
              >
                Verify User
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
