
export const parseSectors = (sectorData: string | string[]): string[] =>
  Array.isArray(sectorData)
    ? sectorData
    : typeof sectorData === "string"
      ? sectorData.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [];

export const normalizeId = (obj: { id?: string; _id?: string }) =>
  obj.id || obj._id || "";
