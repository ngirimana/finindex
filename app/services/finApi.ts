// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { NewsArticle } from "~/types";

// export type CountryYearRowAPI = {
//   _id: string;
//   id: string; // ISO3 from API
//   name: string;
//   literacyRate: number | null;
//   digitalInfrastructure: number | null;
//   investment: number | null;
//   finalScore: number | null;
//   year: number;
//   population: number | null;
//   gdp: number | null;
// };

// /** Normalized shape (id is ISO_A2; sorted by name) */
// export type CountryYearRow = CountryYearRowAPI & {
//   id: string; // ISO_A2 after normalization
// };

// export type StartupCount = {
//   country: string; // e.g., "Nigeria"
//   count: number;   // e.g., 18
// };




// const BASE_URL =
//   "https://fintechindex-gfbebbdzhfbva0cb.switzerlandnorth-01.azurewebsites.net";

// const isoA3toA2: Record<string, string> = {
//   DZA: "DZ", AGO: "AO", BEN: "BJ", BWA: "BW", BFA: "BF", BDI: "BI", CMR: "CM", CPV: "CV",
//   CAF: "CF", TCD: "TD", COM: "KM", COG: "CG", COD: "CD", DJI: "DJ", EGY: "EG", GNQ: "GQ",
//   ERI: "ER", ETH: "ET", GAB: "GA", GMB: "GM", GHA: "GH", GIN: "GN", GNB: "GW", CIV: "CI",
//   KEN: "KE", LSO: "LS", LBR: "LR", LBY: "LY", MDG: "MG", MWI: "MW", MLI: "ML", MRT: "MR",
//   MUS: "MU", MAR: "MA", MOZ: "MZ", NAM: "NA", NER: "NE", NGA: "NG", RWA: "RW", STP: "ST",
//   SEN: "SN", SYC: "SC", SLE: "SL", SOM: "SO", ZAF: "ZA", SSD: "SS", SDN: "SD", SWZ: "SZ",
//   TZA: "TZ", TGO: "TG", TUN: "TN", UGA: "UG", ZMB: "ZM", ZWE: "ZW",
// };

// /** Normalize API response to use ISO_A2 codes and sort by country name */
// function normalize(res: CountryYearRowAPI[]): CountryYearRow[] {
//   return (res ?? [])
//     .map((r) => ({ ...r, id: isoA3toA2[r.id] ?? r.id }))
//     .sort((a, b) => a.name.localeCompare(b.name));
// }

// export const finApi = createApi({
//   reducerPath: "finApi",
//   baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
//    tagTypes: ["CountryData", "StartupCounts", "Years","News"] as const,
//   refetchOnFocus: true,
//   refetchOnReconnect: true,
//   keepUnusedDataFor: 60,
//   endpoints: (build) => ({
    
//     getAllCountryData: build.query<CountryYearRowAPI[], void>({
//       query: () => "country-data",
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map((r) => ({
//                 type: "CountryData" as const,
//                 id: r._id,
//               })),
//               { type: "CountryData" as const, id: "LIST" },
//             ]
//           : [{ type: "CountryData" as const, id: "LIST" }],
//     }),

//     getCountryDataByYear: build.query<CountryYearRow[], number>({
//       query: (year) => `country-data?year=${year}`,
//       transformResponse: normalize,
//       providesTags: (_result, _err, year) => [
//         { type: "CountryData", id: `YEAR-${year}` },
//       ],
//     }),

//     getAvailableYears: build.query<number[], void>({
//       query: () => "country-data/years",
//       providesTags: [{ type: "Years", id: "LIST" }],
//     }),

//     getStartupCountsByYear: build.query<StartupCount[], number>({
//       query: (year) => `startups/counts?year=${year}`,
//       providesTags: (_res, _err, year) => [
//         { type: "StartupCounts" as const, id: `YEAR-${year}` },
//       ],
//     }),
//     getNews: build.query<NewsArticle[], void>({
//   query: () => "news", 
//   transformResponse: (res: { articles?: NewsArticle[] } | any) =>
//     Array.isArray(res?.articles) ? res.articles : [],
//   providesTags: [{ type: "News" as const, id: "LIST" }],
// }),

//   }),
// });

// export const { useGetAllCountryDataQuery, useGetCountryDataByYearQuery, useGetAvailableYearsQuery, useGetStartupCountsByYearQuery,useGetNewsQuery } = finApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewsArticle } from "~/types";

export type CountryYearRowAPI = {
  _id: string;
  id: string; // ISO3 from API
  name: string;
  literacyRate: number | null;
  digitalInfrastructure: number | null;
  investment: number | null;
  finalScore: number | null;
  year: number;
  population: number | null;
  gdp: number | null;
};

export type CountryYearRow = CountryYearRowAPI & {
  id: string; // ISO_A2 after normalization
};

export type StartupCount = {
  country: string;
  count: number;
};

type LoginRequest = { email: string; password: string };
type LoginResponse = { token: string; user: any };

type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  country: string;
  organization?: string;
  jobTitle?: string;
  role: "viewer" | "editor";
  isVerified?: boolean;
};
type RegisterResponse = { message: string } | { success: boolean; message?: string };

const BASE_URL =
  "https://fintechindex-gfbebbdzhfbva0cb.switzerlandnorth-01.azurewebsites.net";

const isoA3toA2: Record<string, string> = {
  DZA: "DZ", AGO: "AO", BEN: "BJ", BWA: "BW", BFA: "BF", BDI: "BI", CMR: "CM", CPV: "CV",
  CAF: "CF", TCD: "TD", COM: "KM", COG: "CG", COD: "CD", DJI: "DJ", EGY: "EG", GNQ: "GQ",
  ERI: "ER", ETH: "ET", GAB: "GA", GMB: "GM", GHA: "GH", GIN: "GN", GNB: "GW", CIV: "CI",
  KEN: "KE", LSO: "LS", LBR: "LR", LBY: "LY", MDG: "MG", MWI: "MW", MLI: "ML", MRT: "MR",
  MUS: "MU", MAR: "MA", MOZ: "MZ", NAM: "NA", NER: "NE", NGA: "NG", RWA: "RW", STP: "ST",
  SEN: "SN", SYC: "SC", SLE: "SL", SOM: "SO", ZAF: "ZA", SSD: "SS", SDN: "SD", SWZ: "SZ",
  TZA: "TZ", TGO: "TG", TUN: "TN", UGA: "UG", ZMB: "ZM", ZWE: "ZW",
};

function normalize(res: CountryYearRowAPI[]): CountryYearRow[] {
  return (res ?? [])
    .map((r) => ({ ...r, id: isoA3toA2[r.id] ?? r.id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const finApi = createApi({
  reducerPath: "finApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    // Attach JWT automatically if present
    prepareHeaders: (headers) => {
      try {
        const raw = localStorage.getItem("fintechUser");
        if (raw) {
          const parsed = JSON.parse(raw);
          const token: string | undefined = parsed?.token;
          if (token) headers.set("authorization", `Bearer ${token}`);
        }
      } catch {}
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["CountryData", "StartupCounts", "Years", "News", "Auth", "User"] as const,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: (build) => ({
    // ---------- DATA ----------
    getAllCountryData: build.query<CountryYearRowAPI[], void>({
      query: () => "country-data",
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "CountryData" as const, id: r._id })),
              { type: "CountryData" as const, id: "LIST" },
            ]
          : [{ type: "CountryData" as const, id: "LIST" }],
    }),

    getCountryDataByYear: build.query<CountryYearRow[], number>({
      query: (year) => `country-data?year=${year}`,
      transformResponse: normalize,
      providesTags: (_result, _err, year) => [{ type: "CountryData", id: `YEAR-${year}` }],
    }),

    getAvailableYears: build.query<number[], void>({
      query: () => "country-data/years",
      providesTags: [{ type: "Years", id: "LIST" }],
    }),

    getStartupCountsByYear: build.query<StartupCount[], number>({
      query: (year) => `startups/counts?year=${year}`,
      providesTags: (_res, _err, year) => [{ type: "StartupCounts" as const, id: `YEAR-${year}` }],
    }),

    getNews: build.query<NewsArticle[], void>({
      query: () => "news",
      transformResponse: (res: { articles?: NewsArticle[] } | any) =>
        Array.isArray(res?.articles) ? res.articles : [],
      providesTags: [{ type: "News" as const, id: "LIST" }],
    }),

    // ---------- AUTH ----------
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
      invalidatesTags: [{ type: "Auth", id: "STATE" }, { type: "User", id: "ME" }],
    }),

    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "auth/register", method: "POST", body }),
      invalidatesTags: [{ type: "Auth", id: "STATE" }],
    }),

    // Optional: profile endpoint if your API supports it
    me: build.query<any, void>({
      query: () => "auth/me",
      providesTags: [{ type: "User", id: "ME" }],
    }),
  }),
});

export const {
  useGetAllCountryDataQuery,
  useGetCountryDataByYearQuery,
  useGetAvailableYearsQuery,
  useGetStartupCountsByYearQuery,
  useGetNewsQuery,
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} = finApi;
