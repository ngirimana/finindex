import React from "react";

type Props = { open: boolean; onClose: () => void };

const UploadGuideModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              📋 Bulk Upload Guide
            </h3>
            <button
              onClick={onClose}
              className="text-brand-600 hover:underline text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-700">
            Supported: Excel (.xlsx, .xls) or CSV. Max 10MB. The first sheet is
            processed. Required columns (case-insensitive):{" "}
            <b>Organization Name</b>, <b>Headquarters Location</b>,{" "}
            <b>Industries</b>, <b>Founded Date</b>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadGuideModal;
