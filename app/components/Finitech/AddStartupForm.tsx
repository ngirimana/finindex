import React from "react";
import { COUNTRIES } from "./constants";

type NewStartup = {
  name: string;
  country: string;
  sector: string;
  foundedYear: number;
  description: string;
  website: string;
};

type Props = {
  newStartup: NewStartup;
  setNewStartup: (s: NewStartup) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const AddStartupForm: React.FC<Props> = ({
  newStartup,
  setNewStartup,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 panel-soft rounded-lg border border-gray-200">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        Add New Fintech Startup
      </h3>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4"
      >
        <input
          type="text"
          placeholder="Startup Name"
          value={newStartup.name}
          onChange={(e) =>
            setNewStartup({ ...newStartup, name: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
          required
        />
        <select
          value={newStartup.country}
          onChange={(e) =>
            setNewStartup({ ...newStartup, country: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
          required
        >
          <option value="">Select Country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Sectors (e.g., Payments, Mobile Money, Lending)"
          value={newStartup.sector}
          onChange={(e) =>
            setNewStartup({ ...newStartup, sector: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
          required
        />
        <input
          type="number"
          placeholder="Founded Year"
          value={newStartup.foundedYear}
          onChange={(e) =>
            setNewStartup({
              ...newStartup,
              foundedYear: parseInt(e.target.value),
            })
          }
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
          min="1990"
          max={new Date().getFullYear()}
          required
        />
        <input
          type="url"
          placeholder="Website (optional)"
          value={newStartup.website}
          onChange={(e) =>
            setNewStartup({ ...newStartup, website: e.target.value })
          }
          className="sm:col-span-2 w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
        />
        <textarea
          placeholder="Description"
          value={newStartup.description}
          onChange={(e) =>
            setNewStartup({ ...newStartup, description: e.target.value })
          }
          className="sm:col-span-2 w-full px-3 sm:px-4 py-2 border border-gray-300 text-black rounded-lg text-sm"
          rows={3}
          required
        />
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="px-3 sm:px-4 py-2 btn-primary rounded-lg text-black text-sm font-medium"
          >
            Add Startup
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 btn-outline rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStartupForm;
