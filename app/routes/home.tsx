import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "African Fintech Index" },
    {
      name: "description",
      content: "Financial Technology Development Across Africa",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
