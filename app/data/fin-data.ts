// src/finindex/data.ts
export type CountryYearRow = {
  _id: string;
  id: string; // ISO3
  name: string;
  year: number;
  literacyRate: number;
  digitalInfrastructure: number;
  investment: number;
  finalScore: number;
  population: number;
  gdp: number;
};

export const CountryNames: string[] = [
     "Rwanda",
    "Kenya",
    "Nigeria",
    "South Africa",
    "Morocco",
    "Egypt, Arab Rep.",
    "Ghana",
    "Ethiopia",
    "Tanzania",
    "Uganda",
    "Senegal",
    "Cote d'Ivoire",
    "Mali",
    "Cameroon",
    "Algeria",
    "Tunisia",
    "Libya",
    "Sudan",
    "Zambia",
    "Zimbabwe",
    "Botswana",
    "Namibia",
    "Angola",
    "Mozambique",
    "Madagascar",
    "Malawi",
    "Burkina Faso",
    "Niger",
    "Chad",
    "Mauritius",
    "Sierra Leone",
    "Liberia",
    "Benin",
    "Togo",
    "Gabon",
    "Congo, Dem. Rep.",
    "Congo, Rep.",
    "Lesotho",
    "Eswatini",
    "Djibouti",
    "Somalia",
    "Cabo Verde",
    "Comoros",
    "Seychelles",
    "South Sudan",
    "Burundi",
    "Central African Republic",
    "Equatorial Guinea",
    "Guinea",
    "Guinea-Bissau",
    "Gambia, The",
  "Mauritania",
];

export const COUNTRIES = [
  "Nigeria","South Africa","Kenya","Egypt","Ghana","Morocco","Ethiopia","Tanzania",
  "Uganda","Rwanda","Senegal","Ivory Coast","Tunisia","Algeria","Cameroon","Zimbabwe",
  "Zambia","Botswana","Namibia","Mauritius","Mali","Burkina Faso","Niger","Chad",
  "Central African Republic","Democratic Republic of Congo","Republic of Congo","Gabon",
  "Equatorial Guinea","São Tomé and Príncipe","Angola","Mozambique","Madagascar",
  "Malawi","Lesotho","Eswatini","Comoros","Seychelles","Mauritania","Western Sahara",
  "Libya","Sudan","South Sudan","Eritrea","Djibouti","Somalia","Other",
];
