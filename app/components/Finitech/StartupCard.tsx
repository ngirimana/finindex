import React from "react";
import { Globe, Calendar, User } from "lucide-react";
import { CHIP_CLASSES } from "./constants";
import { parseSectors } from "./utils";
import type { FintechStartup } from "~/services/finApi";

type Props = {
  startup: FintechStartup;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

const StartupCard: React.FC<Props> = ({ startup, canDelete, onDelete }) => {
  const sectors = parseSectors(startup.sector as any);
  const id = String(startup.id || (startup as any)._id);

  return (
    <div className="startup-card border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg transition-all bg-white flex flex-col">
      <div className="flex-1">
        <div className="h-16 mb-3 flex items-start">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words leading-tight">
            {startup.name}
          </h3>
        </div>

        <div className="h-20 flex flex-wrap gap-2 mb-6 items-start">
          {sectors.length === 0 ? (
            <span className="px-2 py-1 chip-cream text-xs rounded-full font-medium">
              No Sector
            </span>
          ) : (
            sectors.map((sec, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 text-sm rounded-full font-medium shadow-sm ${CHIP_CLASSES[i % CHIP_CLASSES.length]}`}
                title={sec}
              >
                {sec}
              </span>
            ))
          )}
        </div>

        <div className="h-24 mb-4">
          <p className="text-sm sm:text-base text-gray-700 line-clamp-3 break-words leading-relaxed font-medium">
            {startup.description}
          </p>
        </div>

        <div className="h-16 flex items-center justify-between p-3 panel-soft rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-gray-800">
              {startup.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-gray-800">
              {startup.foundedYear}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-gray-800">
              {startup.addedBy || "Unknown"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 h-16 flex items-end">
          <div className="flex gap-3 w-full">
            {startup.website ? (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-3 py-3 btn-primary text-sm font-medium rounded-lg"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            ) : (
              <div className="flex-1 h-10" />
            )}

            {canDelete && (
              <button
                onClick={() => onDelete(id)}
                className={`px-3 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 ${startup.website ? "flex-1" : "w-full"}`}
                title="Delete this startup permanently"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupCard;
