import type { CountryData } from '../types';
import { geoMercator } from 'd3-geo';
import type { GeoProjection } from 'd3-geo';

// Types for shapefile processing
export interface ShapefileFeature {
  type: string;
  properties: {
    ADMIN: string;
    ISO_A2: string;
    ISO_A3: string;
    CONTINENT: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface ProcessedGeoData {
  type: string;
  features: ShapefileFeature[];
}

// African country ISO codes
const AFRICAN_COUNTRIES = new Set([
  'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ',
  'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY',
  'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC',
  'SL', 'SO', 'ZA', 'SS', 'SD', 'SZ', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'
]);

// Simplified fallback GeoJSON
const SIMPLIFIED_AFRICAN_GEOJSON: ProcessedGeoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Nigeria',
        ISO_A2: 'NG',
        ISO_A3: 'NGA',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[420, 380], [480, 380], [490, 420], [470, 450], [420, 450], [420, 380]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'South Africa',
        ISO_A2: 'ZA',
        ISO_A3: 'ZAF',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[480, 650], [580, 650], [600, 690], [560, 720], [480, 720], [480, 650]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Kenya',
        ISO_A2: 'KE',
        ISO_A3: 'KEN',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[620, 450], [670, 450], [680, 490], [660, 520], [620, 520], [620, 450]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Egypt',
        ISO_A2: 'EG',
        ISO_A3: 'EGY',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[520, 200], [600, 200], [620, 240], [580, 280], [520, 280], [520, 200]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Ghana',
        ISO_A2: 'GH',
        ISO_A3: 'GHA',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[360, 420], [400, 420], [410, 460], [390, 490], [360, 490], [360, 420]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Morocco',
        ISO_A2: 'MA',
        ISO_A3: 'MAR',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[380, 250], [450, 250], [470, 290], [430, 330], [380, 330], [380, 250]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Ethiopia',
        ISO_A2: 'ET',
        ISO_A3: 'ETH',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[680, 380], [740, 380], [750, 420], [720, 450], [680, 450], [680, 380]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        ADMIN: 'Tanzania',
        ISO_A2: 'TZ',
        ISO_A3: 'TZA',
        CONTINENT: 'Africa'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[620, 540], [680, 540], [690, 580], [660, 610], [620, 610], [620, 540]]]
      }
    }
  ]
};

/**
 * Load and process GeoJSON shapefile
 */
export const processShapefileData = async (shapefilePath: string): Promise<ProcessedGeoData> => {
  try {
    const response = await fetch(shapefilePath);
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
    }

    const geojson = await response.json();

    const features = filterAfricanCountries(geojson.features);
    

    return {
      type: 'FeatureCollection',
      features: features
    };
  } catch (error) {
   
    return {
      type: 'FeatureCollection',
      features: [] 
    };
  }
};

/**
 * Filter features for African countries only
 */
export const filterAfricanCountries = (features: ShapefileFeature[]): ShapefileFeature[] => {
  const filtered = features.filter((feature) => {
    const isoCode = feature.properties.ISO_A2;
    return AFRICAN_COUNTRIES.has(isoCode);
  });
  if (filtered.length !== features.length) {
    return[]
  }
  return filtered;
};

/**
 * Match country data with shapefile features
 */
export const matchCountryData = (
  geoFeatures: ShapefileFeature[],
  countryData: CountryData[]
): Map<string, { feature: ShapefileFeature; data: CountryData | null }> => {
  const countryMap = new Map();

  geoFeatures.forEach((feature) => {
    const isoCode = feature.properties.ISO_A2;
    const countryDataItem = countryData.find((c) => c.id === isoCode);

    countryMap.set(isoCode, {
      feature,
      data: countryDataItem || null
    });
  });

  return countryMap;
};

// Project lon/lat to SVG coordinates using Mercator projection
const projection = geoMercator()
  .center([20, 0]) // Center on Africa
  .scale(500)
  .translate([450, 350]); // SVG center (adjust as needed)

function projectCoordinates(coords: number[]): [number, number] {
  if (Array.isArray(coords) && coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return projection([coords[0], coords[1]]) as [number, number];
  }
  return [0, 0];
}

/**
 * Convert coordinates to SVG path
 */
export const coordinatesToPath = (coordinates: number[][][]): string => {
  if (!coordinates || coordinates.length === 0) return '';

  const paths: string[] = [];

  coordinates.forEach((polygon) => {
    if (polygon.length === 0) return;

    const path = polygon
      .map((point, index) => {
        const [x, y] = projectCoordinates(point);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';

    paths.push(path);
  });

  return paths.join(' ');
};

/**
 * Get country color based on score with expanded ranges for better visual differentiation
 */
export const getCountryColor = (countryData: CountryData | null): string => {
  if (!countryData) return '#E5E7EB'; // Light gray for no data

  const score = countryData.finalScore;
  
  // Expanded ranges for better visual differentiation
  if (score >= 90) return '#059669'; // Dark Green - Excellent (90+)
  if (score >= 80) return '#10B981'; // Green - Very High (80-89)
  if (score >= 70) return '#34D399'; // Light Green - High (70-79)
  if (score >= 60) return '#F59E0B'; // Yellow - Medium (60-69)
  if (score >= 50) return '#F97316'; // Orange - Below Medium (50-59)
  if (score >= 40) return '#EF4444'; // Red - Low (40-49)
  if (score >= 30) return '#DC2626'; // Dark Red - Very Low (30-39)
  return '#6B7280'; // Gray - Extremely Low (<30)
};

/**
 * Create fallback simplified map data
 */
export const createSimplifiedMapData = (): ProcessedGeoData => {
  return SIMPLIFIED_AFRICAN_GEOJSON;
};

/**
 * Validate shapefile path (.geojson or .json)
 */
export const validateShapefilePath = (path: string): boolean => {
  return path.endsWith('.geojson') || path.endsWith('.json');
};

/**
 * Return local geojson path
 */
export const getLocalShapefilePath = (): string => {
  return '/data/africa.geojson'; 
};
