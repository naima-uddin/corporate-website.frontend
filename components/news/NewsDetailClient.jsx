"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiLoader } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const NewsDetailClient = ({ slug }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/news/${slug}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "News item not found");
        }

        if (isMounted) setNews(data.news);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load news item");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <article className="pb-20">
        <div className="h-72 sm:h-96 w-full bg-gray-200 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="h-4 bg-gray-200 rounded-lg w-24 mb-6 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-xl w-full mb-3 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-xl w-2/3 mb-8 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-heading)]">
          News item not found
        </h1>
        <p className="mt-3 text-[var(--color-body)]">
          {error || "This item may have been removed."}
        </p>
        <Link
          href="/news"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
        >
          <FiArrowLeft /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-20">
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[var(--color-surface)]">
        {news.featuredImage && (
          <img
            src={news.featuredImage}
            alt={news.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {news.category && (
            <span className="inline-block rounded bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {news.category}
            </span>
          )}
          <h1 className="main-title mt-4 text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white text-balance">
            {news.title}
          </h1>
          <p className="mt-3 text-sm text-white/80">
            {formatDate(news.publishDate || news.createdAt)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all duration-200"
        >
          <FiArrowLeft /> Back to News
        </Link>

        {news.excerpt && (
          <p className="mt-6 text-lg text-[var(--color-body)] leading-relaxed">
            {news.excerpt}
          </p>
        )}

        {news.content && (
          <div
            className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-body)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--color-heading)] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[var(--color-heading)] [&_a]:text-[var(--color-primary)] [&_a]:underline [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </div>
    </article>
  );
};

export default NewsDetailClient;
