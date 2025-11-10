import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewsArticle } from "~/types";

/* ----------------------- Country Data Types ----------------------- */
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

/* ----------------------- Auth Types ----------------------- */
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

/* ----------------------- Startups Types (from component) ----------------------- */
export type FintechStartup = {
  _id?: string;          // server id (used in pending/verify/delete)
  id?: string;           // client temp id for UI
  name: string;
  country: string;
  sector: string | string[]; // component accepts string or array
  foundedYear: number;
  description?: string;
  website?: string | null;
  addedBy?: string | null;
  addedAt?: number | string | null;
  verificationStatus?: "pending" | "approved" | "rejected";
};

type CreateStartupRequest = FintechStartup; // your component posts the full object
type CreateStartupResponse = FintechStartup;

type BulkUploadRequest = { data: any[] };
type BulkUploadResponse = { message: string };

type VerifyStartupRequest = {
  id: string;
  verificationStatus: "approved" | "rejected";
  adminNotes?: string;
};
type VerifyStartupResponse = { message?: string };

type BulkVerifyRequest = {
  startupIds: string[];
  verificationStatus: "approved" | "rejected";
  adminNotes?: string;
};
type BulkVerifyResponse = { message?: string };

/* ----------------------- Config & Helpers ----------------------- */
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

/* ----------------------- API ----------------------- */
export const finApi = createApi({
  reducerPath: "finApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
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
  tagTypes: [
    "CountryData",
    "StartupCounts",
    "Years",
    "News",
    "Auth",
    "User",
    "Startups",
    "PendingStartups",
  ] as const,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: (build) => ({
    /* ---------- COUNTRY DATA ---------- */
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

    /* ---------- STARTUPS (from your component) ---------- */

    // GET /startups  (optionally allow server-side filters in future)
    getStartups: build.query<
      FintechStartup[],
      { year?: number; country?: string; sector?: string; search?: string } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.year != null) params.set("year", String(args.year));
        if (args?.country) params.set("country", args.country);
        if (args?.sector) params.set("sector", args.sector);
        if (args?.search) params.set("search", args.search);
        const qs = params.toString();
        return qs ? `startups?${qs}` : "startups";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "Startups" as const, id: s._id ?? s.id ?? "NEW" })),
              { type: "Startups" as const, id: "LIST" },
            ]
          : [{ type: "Startups" as const, id: "LIST" }],
    }),

    // GET /startups/pending  (admin)
    getPendingStartups: build.query<FintechStartup[], void>({
      query: () => "startups/pending",
      // component expects { startups: [...] }
      transformResponse: (res: any) => (Array.isArray(res?.startups) ? res.startups : []),
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "PendingStartups" as const, id: s._id ?? s.id ?? "NEW" })),
              { type: "PendingStartups" as const, id: "LIST" },
            ]
          : [{ type: "PendingStartups" as const, id: "LIST" }],
    }),

    // POST /startups  (create)
    createStartup: build.mutation<CreateStartupResponse, CreateStartupRequest>({
      query: (body) => ({ url: "startups", method: "POST", body }),
      invalidatesTags: [{ type: "Startups", id: "LIST" }],
    }),

    // DELETE /startups/:id  (admin/editor)
    deleteStartup: build.mutation<{ deletedStartup: FintechStartup }, string>({
      query: (startupId) => ({ url: `startups/${startupId}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Startups", id: "LIST" },
        { type: "PendingStartups", id: "LIST" },
      ],
    }),

    // POST /startups/bulk  (bulk upload)
    bulkUploadStartups: build.mutation<BulkUploadResponse, BulkUploadRequest>({
      query: (body) => ({ url: "startups/bulk", method: "POST", body }),
      invalidatesTags: [{ type: "Startups", id: "LIST" }],
    }),

    // PATCH /startups/:id/verify  (admin approve/reject)
    verifyStartup: build.mutation<VerifyStartupResponse, VerifyStartupRequest>({
      query: ({ id, ...body }) => ({
        url: `startups/${id}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "PendingStartups", id: "LIST" },
        { type: "Startups", id: "LIST" },
      ],
    }),

    // PATCH /startups/bulk-verify  (admin bulk approve/reject)
    bulkVerifyStartups: build.mutation<BulkVerifyResponse, BulkVerifyRequest>({
      query: (body) => ({
        url: "startups/bulk-verify",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "PendingStartups", id: "LIST" },
        { type: "Startups", id: "LIST" },
      ],
    }),

    /* ---------- NEWS ---------- */
    getNews: build.query<NewsArticle[], void>({
      query: () => "news",
      transformResponse: (res: { articles?: NewsArticle[] } | any) =>
        Array.isArray(res?.articles) ? res.articles : [],
      providesTags: [{ type: "News" as const, id: "LIST" }],
    }),

    /* ---------- AUTH ---------- */
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
      invalidatesTags: [{ type: "Auth", id: "STATE" }, { type: "User", id: "ME" }],
    }),

    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "auth/register", method: "POST", body }),
      invalidatesTags: [{ type: "Auth", id: "STATE" }],
    }),

    me: build.query<any, void>({
      query: () => "auth/me",
      providesTags: [{ type: "User", id: "ME" }],
    }),
  }),
});

/* ----------------------- Hooks ----------------------- */
export const {
  // Country & counts
  useGetAllCountryDataQuery,
  useGetCountryDataByYearQuery,
  useGetAvailableYearsQuery,
  useGetStartupCountsByYearQuery,

  // Startups
  useGetStartupsQuery,
  useGetPendingStartupsQuery,
  useCreateStartupMutation,
  useDeleteStartupMutation,
  useBulkUploadStartupsMutation,
  useVerifyStartupMutation,
  useBulkVerifyStartupsMutation,

  // News
  useGetNewsQuery,

  // Auth
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} = finApi;
