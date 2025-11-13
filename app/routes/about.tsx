import React from "react";

/** ------ Theme (from your navbar screenshot) ------ */
const COLORS = {
  primary: "#63321E", // brown background / accents
  primaryDark: "#4d2717",
  textOnPrimary: "#FFFFFF", // white/cream on brown
  subText: "#f4e8e2",
  cardBorder: "#e8ded8",
  mutedText: "#7C5A45",
};

/** ------ Data types ------ */
export type TeamMember = {
  id: string;
  name: string;
  position: string;
  linkedin?: string;
  image?: string;
};

/** ------ Sample team (replace with your data) ------ */
const sampleTeam: TeamMember[] = [
  {
    id: "1",
    name: "Edith Luhanga, PhD",
    position: "Assistant Research Professor at Carnegie Mellon University",
    linkedin: "https://www.linkedin.com/in/edith-luhanga/",
    image: "/images/Luhanga.jpeg",
  },
  {
    id: "2",
    name: "Ganesh Mani,PhD",
    position: "Data Scientist",
    linkedin: "https://www.linkedin.com/in/ganeshmani/",
    image: "/images/ganesh.jpeg",
  },
  {
    id: "3",
    name: "Prof. Patrick McSharry",
    position: "Professor at Carnegie Mellon University",
    linkedin: "https://www.linkedin.com/in/mcsharry/",
    image: "/images/patrick.jpeg",
  },

  {
    id: "4",
    name: "Chimwemwe Chipeta, PhD",
    position:
      "Professor & Director: Wits Fintech Hub, University of the Witwatersrand",
    linkedin: "https://www.linkedin.com/in/chimwemwe-chipeta-ph-d-ba480736/",
    image: "/images/chipeta.jpeg",
  },
  {
    id: "5",
    name: "Karen Sowon, PhD",
    position:
      "Assitant Professor of Human Computer Interaction at Indiana University Bloomington ",
    linkedin: "https://www.linkedin.com/in/karensowon/",
    image: "/images/karen.jpeg",
  },
  {
    id: "6",
    name: "Yves Mfitumukiza Ndayisaba",
    position:
      "Graduate Research And Teaching Assistant at Cameron School of Business at UNC Wilmington ",
    linkedin: "https://www.linkedin.com/in/yves-mfitumukiza-ndayisaba/",
    image: "/images/yves.jpeg",
  },

  {
    id: "7",
    name: "Pierre Ntakirutimana",
    position: "Research Associate at Carnegie Mellon University",
    linkedin: "https://www.linkedin.com/in/pierre-ntakirutimana-b784ba186/",
    image: "/images/pierre.jpeg",
  },
];

/** ------ Helpers ------ */
function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** ------ Sections ------ */
function AboutSummary() {
  return (
    <section
      className="w-full py-14 px-6"
      style={{ backgroundColor: COLORS.primary, color: COLORS.textOnPrimary }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          About the African Fintech Index
        </h1>

        <p
          className="text-lg leading-relaxed"
          style={{ color: COLORS.subText }}
        >
          The <strong>African Fintech Index (AFI)</strong> is a research and
          data initiative developed under the <strong>FINIA</strong> project to
          measure
          <strong> digital financial readiness</strong> across African
          economies. It integrates three pillars: <strong>Investment</strong>,
          <strong> Literacy</strong>, and <strong>Infrastructure</strong> to
          benchmark countries and guide evidence based decisions.
        </p>

        <p
          className="mt-4 text-lg leading-relaxed"
          style={{ color: COLORS.subText }}
        >
          Using datasets from <strong>Crunchbase</strong>, <strong>GSMA</strong>
          , and the <strong>World Bank</strong>, AFI tracks data from 2018,
          2020, and 2023 to highlight leaders such as Seychelles, Mauritius, and
          South Africa as well as emerging improvers. Our goal is to equip
          policymakers, investors, and innovators with actionable insights that
          accelerate inclusive digital finance across the continent.
        </p>

        <p className="mt-4 italic" style={{ color: "#e6cbbf" }}>
          Presented at the ACM International Conference on AI in Finance (ICAIF
          2025) and representing a step forward in Africa’s digital finance
          research.
        </p>
      </div>
    </section>
  );
}

function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <section className="max-w-6xl mx-auto p-8">
      <header className="mb-8 text-center">
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: COLORS.primary }}
        >
          Meet Our Team
        </h2>
        <p className="mt-2" style={{ color: COLORS.mutedText }}>
          The people powering the African Fintech Index
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {team.map((m) => (
          <article
            key={m.id}
            className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
            style={{ borderColor: COLORS.cardBorder }}
          >
            {m.image ? (
              <img
                src={m.image}
                alt={m.name}
                className="w-24 h-24 rounded-full object-cover border-4 mb-4"
                style={{ borderColor: COLORS.primary }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                style={{ backgroundColor: "#D8C0B2", color: COLORS.primary }}
              >
                {initials(m.name)}
              </div>
            )}

            <h3 className="text-lg font-semibold" style={{ color: "#402015" }}>
              {m.name}
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.mutedText }}>
              {m.position}
            </p>

            {m.linkedin ? (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ backgroundColor: COLORS.primary }}
                onMouseEnter={(e) =>
                  ((
                    e.currentTarget as HTMLAnchorElement
                  ).style.backgroundColor = COLORS.primaryDark)
                }
                onMouseLeave={(e) =>
                  ((
                    e.currentTarget as HTMLAnchorElement
                  ).style.backgroundColor = COLORS.primary)
                }
                aria-label={`Open ${m.name}'s LinkedIn profile`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.3 2.4-2.2 4-2.2 4.3 0 5.1 2.7 5.1 6.2V24H17v-7.8c0-1.9 0-4.4-2.7-4.4-2.7 0-3.2 2.2-3.2 4.3V24H8V8z" />
                </svg>
                LinkedIn
              </a>
            ) : (
              <span className="text-xs italic text-gray-400">No LinkedIn</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/** ------ Page ------ */
export default function AboutPage({
  team = sampleTeam,
}: {
  team?: TeamMember[];
}) {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <AboutSummary />
      <TeamGrid team={team} />
    </main>
  );
}
