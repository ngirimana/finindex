import React from "react";

export default function EditUserModal({
  user,
  form,
  setForm,
  onClose,
  onSave,
}: {
  user: { _id: string } | null;
  form: { name: string; role: string; isVerified: boolean };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onClose: () => void;
  onSave: () => void | Promise<void>;
}) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 border border-[#D9CBBE]">
        <h4 className="text-lg font-semibold mb-4 text-[#6B3A1E]">Edit User</h4>
        <div className="mb-2 text-sm text-[#6B3A1E]">
          <span className="font-medium">Name:</span> {form.name || "N/A"}
        </div>
        <label className="block mb-2 text-[#6B3A1E]">
          Role
          <select
            className="w-full border border-[#D9CBBE] rounded px-2 py-1 focus:ring-2 focus:ring-[#6B3A1E] focus:border-transparent"
            name="role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="block mb-4 text-[#6B3A1E]">
          Verified
          <input
            type="checkbox"
            checked={!!form.isVerified}
            onChange={(e) =>
              setForm((f) => ({ ...f, isVerified: e.target.checked }))
            }
            className="ml-2 accent-[#6B3A1E]"
          />
        </label>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-white text-[#6B3A1E] border border-[#D9CBBE] rounded hover:bg-[#F8F6F3]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-[#6B3A1E] text-[#FCEFD6] rounded hover:bg-[#8B4A2A]"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
