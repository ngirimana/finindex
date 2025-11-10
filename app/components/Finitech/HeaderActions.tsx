import React from "react";
import { Plus, Building2 } from "lucide-react";

type Props = {
  canAct: boolean;
  adding: boolean;
  onOpenAdd: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGuide: () => void;
};

const HeaderActions: React.FC<Props> = ({
  canAct,
  adding,
  onOpenAdd,
  onFileChange,
  onOpenGuide,
}) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 rounded-lg flex items-center justify-center">
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
          Fintech Startups
        </h2>
        {/* subtitle left to parent */}
      </div>

      {canAct && (
        <div className="ml-auto flex flex-col sm:flex-row gap-2">
          <button
            onClick={onOpenAdd}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 btn-primary rounded-lg text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{adding ? "Adding…" : "Add Startup"}</span>
          </button>

          <label className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 cursor-pointer text-sm">
            <span>Bulk Upload (.xlsx, .csv)</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </label>

          <button
            onClick={onOpenGuide}
            className="px-3 sm:px-4 py-2 btn-outline rounded-lg text-sm"
            title="View upload requirements"
          >
            📋 Guide
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderActions;
