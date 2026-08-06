"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiCalendar, FiLink } from "react-icons/fi";
import NewsCard from "@/components/ui/NewsCard";

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

const getReadingMinutes = (html) => {
  if (!html) return 1;
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const NewsDetailClient = ({ slug }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);
  const [siteName, setSiteName] = useState("MRH");

  useEffect(() => {
    fetch(`${API}/api/site-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.siteName) setSiteName(data.settings.siteName);
      })
      .catch(() => {});
  }, []);

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

        try {
          const relRes = await fetch(`${API}/api/news?limit=8`);
          if (relRes.ok) {
            const relData = await relRes.json();
            const items = (relData.news || []).filter(
              (item) => item.slug !== slug,
            );
            if (isMounted) setRelated(items.slice(0, 3));
          }
        } catch (relErr) {
          console.error("Failed to fetch related news:", relErr);
        }
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="h-4 bg-gray-200 rounded-lg w-24 mb-6 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-xl w-full mb-3 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-xl w-2/3 mb-8 animate-pulse" />
          <div className="h-72 sm:h-96 w-full bg-gray-200 rounded-2xl animate-pulse mb-8" />
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

  const readingMinutes = getReadingMinutes(news.content);

  return (
    <article className="pb-20 bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-body)] overflow-hidden">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors shrink-0">
              Home
            </Link>
            <span className="shrink-0">/</span>
            <Link href="/news" className="hover:text-[var(--color-primary)] transition-colors shrink-0">
              News
            </Link>
            <span className="shrink-0">/</span>
            <span className="truncate text-[var(--color-heading)] font-medium">
              {news.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <header className="text-center">
          {news.category && (
            <span className="inline-block rounded-full bg-[var(--color-primary-tint)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
              {news.category}
            </span>
          )}
          <h1 className="main-title mt-4 text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-[var(--color-heading)] text-balance">
            {news.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-full text-[var(--color-body)]">
              <FiCalendar className="text-[var(--color-primary)]" />
              {formatDate(news.publishDate || news.createdAt)}
            </span>
            <span className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-full text-[var(--color-body)]">
              <FiClock className="text-[var(--color-primary)]" />
              {readingMinutes} min read
            </span>
          </div>
        </header>

        {/* Featured image */}
        {news.featuredImage && (
          <div className="relative mt-8 aspect-[16/8] w-full overflow-hidden rounded-2xl shadow-xl bg-[var(--color-surface)]">
            <img
              src={news.featuredImage}
              alt={news.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {news.excerpt && (
          <p className="mt-8 text-lg text-[var(--color-body)] leading-relaxed border-l-4 border-[var(--color-primary)] pl-4 italic">
            {news.excerpt}
          </p>
        )}

        {/* Content */}
        {news.content && (
          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-8 shadow-sm">
            <div
              className="text-base leading-relaxed text-[var(--color-body)]
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--color-heading)] [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[var(--color-heading)] [&_h3]:mt-6 [&_h3]:mb-2
                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[var(--color-heading)] [&_h4]:mt-4 [&_h4]:mb-2
                [&_p]:mb-4
                [&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:font-medium
                [&_strong]:font-semibold [&_strong]:text-[var(--color-heading)]
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:bg-[var(--color-primary-tint)] [&_blockquote]:rounded-r-lg [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:my-5 [&_blockquote]:italic [&_blockquote]:text-[var(--color-heading)]
                [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:shadow-md
                [&_code]:bg-[var(--color-surface)] [&_code]:text-[var(--color-primary)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_pre]:bg-[var(--color-ink)] [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-5
                [&_hr]:my-8 [&_hr]:border-[var(--color-border)]
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-5
                [&_th]:border [&_th]:border-[var(--color-border)] [&_th]:bg-[var(--color-surface)] [&_th]:p-2 [&_th]:text-left
                [&_td]:border [&_td]:border-[var(--color-border)] [&_td]:p-2"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        )}

        {/* Share */}
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-sm font-semibold text-[var(--color-heading)] mb-3">
            Share this story
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  "_blank",
                  "width=600,height=400",
                )
              }
              className="px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Facebook
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(news.title)}`,
                  "_blank",
                  "width=600,height=400",
                )
              }
              className="px-4 py-2 rounded-lg bg-[#0EA5E9] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Twitter
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`${news.title} ${window.location.href}`)}`,
                  "_blank",
                )
              }
              className="px-4 py-2 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-heading)] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <FiLink /> Copy Link
            </button>
          </div>
        </div>

        <Link
          href="/news"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all duration-200"
        >
          <FiArrowLeft /> Back to News
        </Link>
      </div>

      {/* Related news */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] mb-6">
            More from {siteName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((item) => (
              <NewsCard
                key={item._id || item.slug}
                href={`/news/${item.slug}`}
                image={item.featuredImage}
                date={formatDate(item.publishDate || item.createdAt)}
                category={item.category}
                title={item.title}
                excerpt={item.excerpt}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default NewsDetailClient;
