import React, { useRef, useState } from "react";
import { Upload, AlertCircle, CheckCircle, X, RefreshCw } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { CountryData } from "../../types";

interface FileUploadProps {
  onDataUpdate: (data: CountryData[]) => void;
  currentYear: number;
}

interface UploadStatus {
  type: "idle" | "processing" | "success" | "error";
  message: string;
  details?: string[];
}

const COLORS = {
  primary: "#71391A", // coffee (navbar)
  primaryDark: "#5E2F15",
  primaryMid: "#8A4A26",
  lightPanel: "#F6EEE7",
  lighterPanel: "#FBF6F1",
  border: "#CBA98E",
  accent: "#E6C089", // warm gold accent
  text: "#2A1C14",
  textMuted: "#6B4E3D",
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onDataUpdate,
  currentYear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: "idle",
    message: "",
  });

  const validateData = (
    data: any[]
  ): { isValid: boolean; errors: string[]; validData: CountryData[] } => {
    const errors: string[] = [];
    const validData: CountryData[] = [];
    const requiredFields = [
      "name",
      "literacyRate",
      "digitalInfrastructure",
      "investment",
    ];

    if (data.length === 0) {
      errors.push("File is empty or has no valid data rows");
      return { isValid: false, errors, validData };
    }

    data.forEach((row, index) => {
      const rowNumber = index + 1;
      const missingFields: string[] = [];

      requiredFields.forEach((field) => {
        if (!row[field] && row[field] !== 0) missingFields.push(field);
      });

      if (missingFields.length > 0) {
        errors.push(
          `Row ${rowNumber}: Missing required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      const numericFields = [
        "literacyRate",
        "digitalInfrastructure",
        "investment",
      ];
      const invalidNumeric: string[] = [];

      numericFields.forEach((field) => {
        const value = parseFloat(row[field]);
        if (isNaN(value) || value < 0 || value > 100)
          invalidNumeric.push(field);
      });

      if (invalidNumeric.length > 0) {
        errors.push(
          `Row ${rowNumber}: Invalid numeric values (must be 0-100): ${invalidNumeric.join(", ")}`
        );
        return;
      }

      const dataYear = row.year ? parseInt(row.year) : currentYear;
      if (row.year && (isNaN(dataYear) || dataYear < 2000 || dataYear > 2030)) {
        errors.push(
          `Row ${rowNumber}: Invalid year (must be between 2000-2030)`
        );
        return;
      }

      if (
        row.fintechCompanies &&
        (isNaN(parseInt(row.fintechCompanies)) ||
          parseInt(row.fintechCompanies) < 0)
      ) {
        errors.push(
          `Row ${rowNumber}: Invalid fintech companies count (must be a positive number)`
        );
        return;
      }

      const countryData: CountryData = {
        id: row.id || row.name.substring(0, 2).toUpperCase(),
        name: row.name.trim(),
        literacyRate: parseFloat(row.literacyRate),
        digitalInfrastructure: parseFloat(row.digitalInfrastructure),
        investment: parseFloat(row.investment),
        finalScore: 0,
        year: dataYear,
        population: row.population ? parseInt(row.population) : undefined,
        gdp: row.gdp ? parseFloat(row.gdp) : undefined,
        fintechCompanies: row.fintechCompanies
          ? parseInt(row.fintechCompanies)
          : undefined,
      };

      countryData.finalScore =
        (countryData.literacyRate +
          countryData.digitalInfrastructure +
          countryData.investment) /
        3;

      validData.push(countryData);
    });

    return { isValid: errors.length === 0, errors, validData };
  };

  const processFile = async (file: File) => {
    setUploadStatus({ type: "processing", message: "Processing file..." });

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      let parsedData: any[] = [];

      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            parsedData = results.data;
            handleParsedData(parsedData);
          },
          error: (error) => {
            setUploadStatus({
              type: "error",
              message: "Failed to parse CSV file",
              details: [error.message],
            });
          },
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet);
        handleParsedData(parsedData);
      } else {
        setUploadStatus({
          type: "error",
          message: "Unsupported file format",
          details: ["Please upload a CSV or Excel (.xlsx, .xls) file"],
        });
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: "Failed to process file",
        details: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
      });
    }
  };

  const handleParsedData = async (data: any[]) => {
    const validation = validateData(data);
    const apiUrl = import.meta.env.VITE_API_URL || "/api";

    if (validation.isValid) {
      try {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("fintechUser")
            : null;
        const user = stored ? JSON.parse(stored) : {};
        const res = await fetch(`${apiUrl}/country-data/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
          body: JSON.stringify({ data: validation.validData }),
        });
        if (!res.ok) {
          const err = await res.json();
          setUploadStatus({
            type: "error",
            message: err.error || "Failed to upload data to backend",
            details: [
              err.details || err.message || "Unknown error",
              ...(err.conflicts
                ? [
                    `Conflicts: ${err.conflicts.map((c: any) => `${c.id} (${c.year})`).join(", ")}`,
                  ]
                : []),
            ].filter(Boolean),
          });
          return;
        }

        const latestRes = await fetch(`${apiUrl}/country-data`);
        const latestData = await latestRes.json();
        onDataUpdate(latestData);

        const totalCompanies = latestData.reduce(
          (sum: number, country: any) =>
            sum +
            (country && typeof country.fintechCompanies === "number"
              ? country.fintechCompanies
              : 0),
          0
        );
        const years = [
          ...new Set(
            latestData.map((country: any) =>
              country && typeof country.year === "number" ? country.year : 0
            )
          ),
        ].sort((a, b) =>
          typeof b === "number" && typeof a === "number" ? b - a : 0
        );

        setUploadStatus({
          type: "success",
          message: `Successfully imported ${latestData.length} countries`,
          details: [
            `Dataset completely overwritten with new data`,
            `Years included: ${years.join(", ")}`,
            `Total fintech companies: ${totalCompanies}`,
            `All previous data has been replaced`,
          ],
        });
      } catch (error: any) {
        setUploadStatus({
          type: "error",
          message: "Failed to upload or fetch data",
          details: [error?.message || "Unknown error"],
        });
      }
    } else {
      setUploadStatus({
        type: "error",
        message: "Data validation failed",
        details: validation.errors,
      });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      setUploadStatus({
        type: "error",
        message: "File too large",
        details: ["Please upload a file smaller than 10MB"],
      });
      return;
    }

    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const resetUploadStatus = () =>
    setUploadStatus({ type: "idle", message: "" });

  return (
    <div
      className="rounded-lg shadow-sm border p-6"
      style={{
        backgroundColor: COLORS.lighterPanel,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>
          Upload Data
        </h3>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" style={{ color: COLORS.accent }} />
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.textMuted }}
          >
            Overwrites Existing Data
          </span>
        </div>
      </div>

      <div
        className="mb-4 p-3 rounded-lg border"
        style={{
          backgroundColor: COLORS.lightPanel,
          borderColor: COLORS.border,
        }}
      >
        <div className="flex items-start space-x-2">
          <AlertCircle
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: COLORS.primary }}
          />
          <div className="text-sm" style={{ color: COLORS.textMuted }}>
            <p className="font-medium" style={{ color: COLORS.text }}>
              Important: Dataset Overwrite
            </p>
            <p>
              Uploading a new file will completely replace all existing data.
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver ? "" : ""
        }`}
        style={{
          borderColor: isDragOver ? COLORS.primaryMid : COLORS.border,
          backgroundColor: isDragOver ? COLORS.lightPanel : "#fff",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          className="w-12 h-12 mx-auto mb-4"
          style={{ color: COLORS.border }}
        />
        <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>
          Upload your fintech data
        </p>
        <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>
          Drag & drop your CSV or Excel file here, or click to browse
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: COLORS.primary,
            color: "#F8F3ED",
          }}
          disabled={uploadStatus.type === "processing"}
        >
          {uploadStatus.type === "processing" ? "Processing..." : "Choose File"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File Format Requirements */}
      <div
        className="mt-4 p-4 rounded-lg"
        style={{ backgroundColor: COLORS.lightPanel }}
      >
        <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
          Required Format:
        </h4>
        <div className="text-xs space-y-1" style={{ color: COLORS.textMuted }}>
          <p>
            • <strong>name</strong>: Country name (required)
          </p>
          <p>
            • <strong>literacyRate</strong>: Financial literacy rate 0-100
            (required)
          </p>
          <p>
            • <strong>digitalInfrastructure</strong>: Digital infrastructure
            score 0-100 (required)
          </p>
          <p>
            • <strong>investment</strong>: Investment score 0-100 (required)
          </p>
          <p>
            • <strong>year</strong>: Year of data (optional, defaults to current
            selected year)
          </p>
          <p>
            • <strong>fintechCompanies</strong>: Number of fintech companies
            (optional)
          </p>
          <p>
            • <strong>id</strong>: Country code (optional, will auto-generate)
          </p>
          <p>
            • <strong>population</strong>: Population count (optional)
          </p>
          <p>
            • <strong>gdp</strong>: GDP in billions USD (optional)
          </p>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus.type !== "idle" && (
        <div
          className="mt-4 p-4 rounded-lg border"
          style={{
            backgroundColor:
              uploadStatus.type === "success"
                ? "#ECFDF5"
                : uploadStatus.type === "error"
                  ? "#FEF2F2"
                  : COLORS.lightPanel,
            borderColor:
              uploadStatus.type === "success"
                ? "#A7F3D0"
                : uploadStatus.type === "error"
                  ? "#FECACA"
                  : COLORS.border,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {uploadStatus.type === "success" && (
                <CheckCircle
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "#059669" }}
                />
              )}
              {uploadStatus.type === "error" && (
                <AlertCircle
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "#DC2626" }}
                />
              )}
              {uploadStatus.type === "processing" && (
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mt-0.5"
                  style={{ borderColor: COLORS.primary }}
                />
              )}

              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      uploadStatus.type === "success"
                        ? "#065F46"
                        : uploadStatus.type === "error"
                          ? "#7F1D1D"
                          : COLORS.text,
                  }}
                >
                  {uploadStatus.message}
                </p>

                {uploadStatus.details && uploadStatus.details.length > 0 && (
                  <ul
                    className="mt-2 text-xs space-y-1"
                    style={{
                      color:
                        uploadStatus.type === "success"
                          ? "#047857"
                          : uploadStatus.type === "error"
                            ? "#B91C1C"
                            : COLORS.textMuted,
                    }}
                  >
                    {uploadStatus.details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={resetUploadStatus}
              className="transition-colors"
              style={{ color: COLORS.textMuted }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
