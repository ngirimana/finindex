import React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { inputBase } from "./styles";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  withIcon?: boolean;
  name?: string;
};

export const PasswordInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  withIcon = true,
  name,
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {withIcon && (
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className={`${inputBase} ${withIcon ? "pl-10" : ""} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
