export interface CountryData {
  id: string;
  name: string;
  literacyRate: number;
  digitalInfrastructure: number;
  investment: number;
  finalScore: number;
  year: number;
  population?: number;
  gdp?: number;
  fintechCompanies?: number;
}

export interface DashboardStats {
  totalCountries: number;
  averageScore: number;
  topPerformer: string;
  yearOverYearChange: number;
  totalFintechCompanies: number;
  averageFintechCompanies: number;
}

export interface SubComponentData {
  name: string;
  score: number;
  change: number;
  countries: Array<{
    name: string;
    score: number;
    rank: number;
  }>;
}

export interface YearlyTrend {
  year: number;
  averageScore: number;
  totalCountries: number;
  totalFintechCompanies: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  isVerified?: boolean;
  createdAt: number;
  createdBy?: string;
  name?: string;
  token?: string; // JWT token for frontend session
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface FintechStartup {
  id: string;
  name: string;
  country: string;
  sector: string;
  foundedYear: number;
  description: string;
  website?: string;
  addedBy: string;
  addedAt: number;
}