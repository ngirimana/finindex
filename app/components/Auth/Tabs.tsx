import React from "react";
import type { AuthMode } from "./utils/types";

type Props = {
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
};

export const Tabs: React.FC<Props> = ({ mode, setMode }) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex rounded-xl border border-[#6b341e]/30 bg-gray-50 p-1 text-gray-700">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition ${
              mode === m ? "bg-[#6b341e] text-white" : "hover:bg-[#6b341e]/10"
            }`}
          >
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>
    </div>
  );
};
