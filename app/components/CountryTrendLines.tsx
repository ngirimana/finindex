"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";

/* -------------------- Types -------------------- */
export type CountryYearRow = {
  id: string; // ISO3
  name: string;
  year: number;
  literacyRate: number | null;
  digitalInfrastructure: number | null;
  investment: number | null;
  finalScore: number | null;
  population: number | null;
  gdp: number | null;
};

type Metric =
  | "finalScore"
  | "literacyRate"
  | "digitalInfrastructure"
  | "investment"
  | "population"
  | "gdp";

/* 
  -------------------- Visual constants --------------------
 */
const ACTIVE_WIDTH = 3;
const DIM_WIDTH = 2;
const DIM_OPACITY = 0.35;
const DIM_DASH = "2 4";
const DIM_DOT_R = 2;

/* 
  Bright, white-bg friendly palettes for score buckets 
*/
const GREEN_PALETTE = ["#006d2c", "#2ca25f", "#41ab5d", "#66c2a4", "#a1d99b"]; // >80
const BLUE_PALETTE = ["#08519c", "#2171b5", "#3182bd", "#6baed6", "#9ecae1"]; // >60
const YELL_PALETTE = ["#b58900", "#cfa90a", "#d8b365", "#f6e8c3", "#fee08b"]; // >50
const RED_PALETTE = ["#b2182b", "#d6604d", "#ef8a62", "#f4a582", "#fddbc7"]; // ≤50

/* -------------------- Helpers -------------------- */
const withOpacity = (hex: string, a = 1) => {
  const n = hex.replace("#", "");
  const v = parseInt(
    n.length === 3
      ? n
          .split("")
          .map((c) => c + c)
          .join("")
      : n,
    16
  );
  const r = (v >> 16) & 255,
    g = (v >> 8) & 255,
    b = v & 255;
  return `rgba(${r},${g},${b},${a})`;
};

function hashIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

function colorByScore(country: string, score: number | null | undefined) {
  if (score == null || !Number.isFinite(score)) return "#cfcfcf";
  if (score > 80)
    return GREEN_PALETTE[hashIndex(country, GREEN_PALETTE.length)];
  if (score > 60) return BLUE_PALETTE[hashIndex(country, BLUE_PALETTE.length)];
  if (score > 50) return YELL_PALETTE[hashIndex(country, YELL_PALETTE.length)];
  return RED_PALETTE[hashIndex(country, RED_PALETTE.length)];
}

function groupSeries(rows: CountryYearRow[], countries: string[]) {
  return countries.map((name) => ({
    name,
    points: rows.filter((r) => r.name === name).sort((a, b) => a.year - b.year),
  }));
}

function latestValue(points: CountryYearRow[], metric: Metric): number | null {
  for (let i = points.length - 1; i >= 0; i--) {
    const v = (points[i] as any)[metric];
    if (v != null) return v;
  }
  return null;
}

/* 
-------------------- Component -------------------- 
*/
export default function CountryTrendLine({
  rows,
  countries,
  metric = "finalScore",
}: {
  rows: CountryYearRow[];
  countries: string[];
  metric?: Metric;
}) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  /*
   keep explicit 1e-10; null truly tiny noise
  */
  const cleaned = useMemo(
    () =>
      rows.map((r) => {
        const fix = (v: any) => {
          if (v == null) return null;
          if (v === 1e-10 || String(v).toLowerCase() === "1e-10") return 1e-10;
          return typeof v === "number" && v < 1e-12 ? null : v;
        };
        return {
          ...r,
          literacyRate: fix(r.literacyRate),
          digitalInfrastructure: fix(r.digitalInfrastructure),
          investment: fix(r.investment),
          finalScore: fix(r.finalScore),
          gdp: fix(r.gdp),
          population: fix(r.population),
        };
      }),
    [rows]
  );

  const series = useMemo(
    () => groupSeries(cleaned, countries),
    [cleaned, countries]
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(series.flatMap((s) => s.points.map((p) => p.year)))
      ).sort((a, b) => a - b),
    [series]
  );

  const chartData = useMemo(() => {
    return years.map((year) => {
      const row: Record<string, any> = { year };
      series.forEach((s) => {
        const pt = s.points.find((p) => p.year === year);
        row[s.name] = pt ? (pt as any)[metric] : null;
      });
      return row;
    });
  }, [years, series, metric]);

  const lookup = useMemo(() => {
    const m = new Map<string, CountryYearRow>();
    cleaned.forEach((r) => m.set(`${r.name}__${r.year}`, r));
    return m;
  }, [cleaned]);

  // assign per-country color by latest finalScore
  const countryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    series.forEach((s) =>
      map.set(s.name, colorByScore(s.name, latestValue(s.points, "finalScore")))
    );
    return map;
  }, [series]);

  // formatters (needed by your tooltip)
  const fmt = {
    num: (v: number | null | undefined) =>
      v == null
        ? "—"
        : /e/i.test(String(v))
          ? String(v)
          : Intl.NumberFormat().format(v),
    oneDec: (v: number | null | undefined) =>
      v == null
        ? "—"
        : /e/i.test(String(v))
          ? String(v)
          : (Math.round(v * 10) / 10).toLocaleString(),
    money: (v: number | null | undefined) =>
      v == null
        ? "—"
        : /e/i.test(String(v))
          ? `$${String(v)}`
          : `$${Intl.NumberFormat().format(v)}`,
  };

  const TooltipContent = ({ active, label, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const year: number = label;
    const chosen =
      (hoveredCountry && payload.find((p: any) => p.name === hoveredCountry)) ||
      payload[0];
    const country: string = chosen?.name || chosen?.dataKey;
    const row = lookup.get(`${country}__${year}`);
    if (!row) return null;

    return (
      <div
        style={{
          background: "#fff",
          color: "#000",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 12,
          maxWidth: 360,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          {row.name} — {year}
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
          ISO3: {row.id}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 6,
          }}
        >
          {/* <span>Year</span> <b>{fmt.oneDec(row.year)}</b> */}
          <span>Final Score</span> <b>{fmt.oneDec(row.finalScore)}</b>
          <span>Literacy Rate (%)</span> <b>{fmt.oneDec(row.literacyRate)}</b>
          <span>Digital Infra (%)</span>{" "}
          <b>{fmt.oneDec(row.digitalInfrastructure)}</b>
          <span>Investment</span> <b>{fmt.oneDec(row.investment)}</b>
          <span>Population</span> <b>{fmt.num(row.population)}</b>
          <span>GDP</span> <b>{fmt.money(row.gdp)}</b>
        </div>
      </div>
    );
  };

  // build legend entries (color from score colormap)
  const legendPayload = useMemo(
    () =>
      countries.map((name) => ({
        id: name,
        type: "line",
        value: name,
        color: countryColorMap.get(name) ?? "#cfcfcf",
      })),
    [countries, countryColorMap]
  );

  const highlighted = hoveredCountry ?? selectedCountry ?? null;

  // custom legend with readable labels
  const LegendContent = ({ payload = [] as any[] }: { payload?: any[] }) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        lineHeight: 1.6,
        color: "#111",
        fontSize: 12,
        userSelect: "none",
      }}
    >
      {payload.map((entry: any) => (
        <span
          key={entry.value}
          onMouseEnter={() => setHoveredCountry(entry.value)}
          onMouseLeave={() => setHoveredCountry(null)}
          onClick={() =>
            setSelectedCountry((prev) =>
              prev === entry.value ? null : entry.value
            )
          }
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          <span
            style={{
              width: 16,
              height: 4,
              background: entry.color,
              display: "inline-block",
              border: "1px solid rgba(0,0,0,0.25)",
              borderRadius: 2,
            }}
          />
          <span style={{ color: "#111", fontWeight: 500 }}>{entry.value}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        height: 760,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        padding: 8,
      }}
    >
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          onMouseLeave={() => setHoveredCountry(null)}
          style={{ background: "#fff" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
          <XAxis dataKey="year" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip content={TooltipContent as any} />
          <Legend
            payload={legendPayload as any}
            content={(props) => <LegendContent {...props} />}
          />

          {countries.map((name) => {
            const baseColor = countryColorMap.get(name) ?? "#cfcfcf";
            const isActive = highlighted ? highlighted === name : false;
            const stroke = isActive
              ? baseColor
              : withOpacity(baseColor, DIM_OPACITY);

            return (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={stroke}
                strokeWidth={isActive ? ACTIVE_WIDTH : DIM_WIDTH}
                strokeDasharray={isActive ? undefined : DIM_DASH}
                dot={isActive ? { r: 4 } : { r: DIM_DOT_R }}
                activeDot={{
                  r: 6,
                  onMouseEnter: () => setHoveredCountry(name),
                }}
                onMouseMove={() => setHoveredCountry(name)}
                onMouseLeave={() => setHoveredCountry(null)}
                connectNulls
                isAnimationActive={false}
              >
                {isActive && (
                  <LabelList
                    valueAccessor={(entry: any) => {
                      const v = entry[name];
                      if (v == null) return null;
                      return /e/i.test(String(v))
                        ? String(v)
                        : (Math.round(v * 1000) / 1000).toLocaleString();
                    }}
                    position="top"
                    style={{
                      fontSize: 10,
                      fill: baseColor,
                      fontWeight: 600,
                      paintOrder: "stroke",
                      stroke: "white",
                      strokeWidth: 3,
                    }}
                  />
                )}
              </Line>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
