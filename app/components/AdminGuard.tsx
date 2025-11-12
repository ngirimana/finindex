import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("fintechUser")
          : null;
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        setIsAllowed(true);
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

  if (isAllowed === null) return null; // or loading spinner
  return <>{children}</>;
};
