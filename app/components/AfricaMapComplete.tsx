import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { CountryData } from "../types";
import {
  processShapefileData,
  matchCountryData,
  coordinatesToPath,
  getCountryColor,
  createSimplifiedMapData,
  type ProcessedGeoData,
  type ShapefileFeature,
} from "../utils/shapefileProcessor";
import {
  useGetStartupCountsByYearQuery,
  type StartupCount,
} from "../services/finApi";

export interface AfricaMapProps {
  /** full data array (already normalized, e.g., from parent RTK query) */
  data: CountryData[];
  onCountryHover?: (country: CountryData | null) => void;
  hoveredCountry?: CountryData | null;
  shapefilePath?: string;
  width?: number;
  height?: number;
  selectedYear?: number;
  guardSSR?: boolean;
}

function validateShapefilePath(path: string): boolean {
  return path.endsWith(".geojson") || path.endsWith(".json");
}

const AfricaMapComplete: React.FC<AfricaMapProps> = ({
  data,
  onCountryHover,
  hoveredCountry,
  shapefilePath,
  width = 1000,
  height = 1000,
  selectedYear = 2024,
  guardSSR = true,
}) => {
  /** SSR safety check */
  const [isClient, setIsClient] = useState(!guardSSR);
  useEffect(() => {
    if (guardSSR) setIsClient(typeof window !== "undefined");
  }, [guardSSR]);

  const [geoData, setGeoData] = useState<ProcessedGeoData | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ✅ Only fetch startup counts */
  const {
    data: startupCountsRaw = [],
    isLoading: isStartupLoading,
    isError: isStartupError,
  } = useGetStartupCountsByYearQuery(selectedYear);

  /** Convert startup array to a Map(country → count) */
  const startupCounts = useMemo(() => {
    const m = new Map<string, number>();
    (startupCountsRaw as StartupCount[]).forEach((r) =>
      m.set(r.country, r.count)
    );
    return m;
  }, [startupCountsRaw]);

  /** Build a country map (ISO_A2 → feature + data) */
  const [countryMap, setCountryMap] = useState<
    Map<string, { feature: ShapefileFeature; data: CountryData | null }>
  >(new Map());

  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /** Load shapefile, then match to passed data */
  const loadShapefileData = useCallback(async () => {
    if (!shapefilePath) {
      const simplifiedData = createSimplifiedMapData();
      setGeoData(simplifiedData);
      setCountryMap(matchCountryData(simplifiedData.features, data));
      return;
    }

    if (!validateShapefilePath(shapefilePath)) {
      setError("Invalid shapefile path");
      return;
    }

    setGeoLoading(true);
    setError(null);
    try {
      const processed = await processShapefileData(shapefilePath);
      setGeoData(processed);
      setCountryMap(matchCountryData(processed.features, data));
      setGeoLoading(false);
    } catch {
      setError("Failed to load shapefile data");
      setGeoLoading(false);
      const fallback = createSimplifiedMapData();
      setGeoData(fallback);
      setCountryMap(matchCountryData(fallback.features, data));
    }
  }, [shapefilePath, data]);

  useEffect(() => {
    loadShapefileData();
  }, [loadShapefileData]);

  useEffect(() => {
    if (!geoData) return;
    setCountryMap(matchCountryData(geoData.features, data));
  }, [geoData, data]);

  const handleCountryClick = useCallback(
    (isoCode: string) => {
      const c = countryMap.get(isoCode);
      if (c?.data) setSelectedCountry(c.data);
    },
    [countryMap]
  );

  const handleCountryHoverLocal = useCallback(
    (isoCode: string, e: React.MouseEvent) => {
      const c = countryMap.get(isoCode);
      if (c?.data) {
        setSelectedCountry(c.data);
        setMousePosition({ x: e.clientX, y: e.clientY });
        onCountryHover?.(c.data);
      }
    },
    [countryMap, onCountryHover]
  );

  const handleCountryLeave = useCallback(() => {
    setSelectedCountry(null);
    setMousePosition(null);
    onCountryHover?.(null);
  }, [onCountryHover]);

  const renderCountryPath = (feature: ShapefileFeature, isoCode: string) => {
    const c = countryMap.get(isoCode);
    const color = getCountryColor(c?.data || null);

    let d = "";
    if (feature.geometry.type === "Polygon") {
      d = coordinatesToPath(feature.geometry.coordinates as number[][][]);
    } else if (feature.geometry.type === "MultiPolygon") {
      const multi = feature.geometry.coordinates as number[][][][];
      d = multi.map((p) => coordinatesToPath(p)).join(" ");
    }
    if (!d) return null;

    return (
      <path
        key={isoCode}
        d={d}
        fill={color}
        stroke="#ffffff"
        strokeWidth="0.5"
        className="cursor-pointer transition-all duration-200 hover:opacity-80"
        onMouseEnter={(e) => handleCountryHoverLocal(isoCode, e)}
        onMouseLeave={handleCountryLeave}
        onClick={() => handleCountryClick(isoCode)}
      />
    );
  };

  const isLoading = geoLoading || isStartupLoading;
  const hasError = !!error || isStartupError;

  if (hasError || !geoData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Error loading map</p>
          <p className="text-xs text-gray-500">{error || "Data unavailable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
    >
      <div className="w-full max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#71391C] rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                African Fintech Index Map
              </h2>
              <p className="text-sm text-gray-600">
                {selectedYear
                  ? `Data for ${selectedYear}`
                  : "Interactive visualization of fintech development across Africa"}
              </p>
            </div>
          </div>
        </div>

        {/* Map and legend layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-[70%_30%] items-start"
          style={{ gap: 50 }}
        >
          {/* SVG Map */}
          <div className="w-full relative overflow-hidden" style={{ height }}>
            <svg
              ref={svgRef}
              viewBox="0 0 1000 900"
              width="100%"
              height="100%"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ background: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              {geoData.features.map((feature) => {
                const iso = feature.properties.ISO_A2;
                return renderCountryPath(feature, iso);
              })}
            </svg>
          </div>

          {/* Legend */}
          <aside className="w-full">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Fintech Index Score Ranges
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {[
                  ["#065f46", "Excellent (90+)"],
                  ["#10b981", "Very High (80–89)"],
                  ["#34d399", "High (70–79)"],
                  ["#f59e0b", "Medium (60–69)"],
                  ["#fb923c", "Below Med (50–59)"],
                  ["#ef4444", "Low (40–49)"],
                  ["#991b1b", "Very Low (30–39)"],
                  ["#6b7280", "Extremely Low (<30)"],
                ].map(([hex, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ background: hex as string }}
                    />
                    <span className="text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Hover Tooltip */}
        {isClient && selectedCountry && mousePosition && (
          <div
            className="pointer-events-auto fixed z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80"
            style={{ left: mousePosition.x + 16, top: mousePosition.y - 16 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-bold text-gray-900">
                {selectedCountry.name}
              </h4>
              <span className="text-xl font-bold text-blue-600">
                {selectedCountry.finalScore?.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-gray-600">Literacy Rate</div>
                <div className="font-semibold text-blue-700">
                  {selectedCountry.literacyRate?.toFixed(1)}%
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600">Digital Infra</div>
                <div className="font-semibold text-green-700">
                  {selectedCountry.digitalInfrastructure?.toFixed(1)}%
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-gray-600">Investment</div>
                <div className="font-semibold text-purple-700">
                  {selectedCountry.investment?.toFixed(1)}%
                </div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="text-gray-600">Fintech Cos</div>
                <div className="font-semibold text-orange-700">
                  {startupCounts.get(selectedCountry.name) || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfricaMapComplete;
