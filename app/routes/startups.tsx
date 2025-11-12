import React, { useEffect, useState } from "react";
import FiniTechStartups from "~/pages/startups/FintechStartups";
import { User } from "~/types";

export default function About() {
  const [currentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("fintechUser");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  return <FiniTechStartups currentUser={currentUser} />;
}
