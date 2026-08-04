"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaLaptopCode, FaBuilding, FaNewspaper, FaSearch } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_RESULTS = { services: [], portfolio: [], news: [] };
const EMPTY_COUNTS = { services: 0, portfolio: 0, news: 0, total: 0 };

const TYPE_META = {
  services: { label: "Services", icon: <FaLaptopCode /> },
  portfolio: { label: "Projects", icon: <FaBuilding /> },
  news: { label: "News & Media", icon: <FaNewspaper /> },
};

const SearchResultsClient = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState(EMPTY_RESULTS);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults(EMPTY_RESULTS);
      setCounts(EMPTY_COUNTS);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/api/search?q=${encodeURIComponent(q)}&limit=24`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setResults(data.results || EMPTY_RESULTS);
          setCounts(data.counts || EMPTY_COUNTS);
        }
      } catch (error) {
        if (error.name !== "AbortError") console.error("Search failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [q]);

  const sections = ["services", "portfolio", "news"].filter(
    (type) => results[type]?.length > 0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--color-heading)] mb-2">
        Search results
      </h1>
      <p className="text-[var(--color-body)] mb-10">
        {q.trim() ? (
          <>
            {counts.total > 0
              ? `${counts.total} result${counts.total === 1 ? "" : "s"} for `
              : `No results for `}
            <span className="font-semibold text-[var(--color-heading)]">
              &ldquo;{q}&rdquo;
            </span>
          </>
        ) : (
          "Enter a search term to get started."
        )}
      </p>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm"
            >
              <div className="h-40 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && q.trim() && counts.total === 0 && (
        <div className="flex flex-col items-center text-center py-16 text-[var(--color-body)]">
          <FaSearch className="text-4xl mb-4 opacity-30" />
          <p>No matches found. Try a different keyword.</p>
        </div>
      )}

      {!loading &&
        sections.map((type) => (
          <div key={type} className="mb-14">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-heading)] mb-5">
              <span className="text-[var(--color-primary)]">
                {TYPE_META[type].icon}
              </span>
              {TYPE_META[type].label}
              <span className="text-sm font-normal text-[var(--color-body)]">
                ({counts[type]})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results[type].map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[var(--color-surface)] flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-3xl text-[var(--color-primary)]/40">
                        {TYPE_META[type].icon}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-[var(--color-heading)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-1 text-sm text-[var(--color-body)] line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchResultsClient;
