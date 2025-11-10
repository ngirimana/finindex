import React, { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Calendar, RefreshCw } from "lucide-react";
import type { NewsArticle } from "../../types";
import { useGetNewsQuery } from "~/services/finApi";

export const FinanceNews: React.FC = () => {
  const {
    data: articles = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetNewsQuery(undefined, {
    pollingInterval: 60 * 60 * 1000, // 1 hour
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Track last successful refresh time
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!isFetching && articles.length > 0) {
      setLastUpdated(new Date());
    }
  }, [isFetching, articles]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatLastUpdated = () =>
    lastUpdated
      ? lastUpdated.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Never";

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10  bg-[#71391C] text-white  hover:bg-[#5d2f17] rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Finance News</h2>
              <p className="text-sm text-gray-600">Loading latest updates...</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 space-y-4 h-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------- Error ----------
  const friendlyError =
    (error as any)?.data?.message ||
    (isError
      ? "Unable to load news. Please check your connection and try again."
      : "");

  return (
    <div className="w-full h-full max-w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#71391C] text-white  hover:bg-[#5d2f17] rounded-lg flex items-center justify-center flex-shrink-0">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                Finance News
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {lastUpdated
                  ? `Updated at ${formatLastUpdated()}`
                  : "Latest fintech developments in Africa"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Refresh news"
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {!!friendlyError && (
          <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs sm:text-sm text-yellow-700 break-words flex-1">
                {friendlyError}
              </p>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
                />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* News Content */}
      <div className="flex-1 px-2 sm:px-3 md:px-4 lg:px-6 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 pb-2 sm:pb-3 md:pb-4">
          {Array.from({ length: 6 }, (_, index) => {
            const article: NewsArticle | undefined = articles[index];
            if (!article) {
              return (
                <div
                  key={`placeholder-${index}`}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 animate-pulse"
                >
                  <div className="mb-3">
                    <div className="w-full h-32 sm:h-40 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                {(article as any).urlToImage && (
                  <div className="mb-3">
                    <img
                      src={(article as any).urlToImage}
                      alt={article.title || "News image"}
                      className="w-full h-32 sm:h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg";
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight break-words">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed break-words">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 min-w-0">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate((article as any).publishedAt)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate max-w-16 sm:max-w-20">
                        {article.source?.name}
                      </span>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#71391C] hover:bg-[#5d2f17] text-xs flex items-center space-x-1 transition-colors flex-shrink-0 text-white px-2 py-1 rounded"
                    >
                      <span>Read</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 pt-2 sm:pt-3 md:pt-4 lg:pt-6 border-t border-gray-100 flex-shrink-0">
        <p className="text-xs text-gray-500 text-center break-words">
          News updates automatically every hour • Last refresh:{" "}
          {formatLastUpdated()}
        </p>
      </div>
    </div>
  );
};
