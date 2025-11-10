import React, { useEffect, useState } from "react";
import FiniTechStartups from "~/components/Finitech/FintechStartups";
import { User } from "~/types";

export default function About() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("fintechUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  return <FiniTechStartups currentUser={currentUser} />;
}
