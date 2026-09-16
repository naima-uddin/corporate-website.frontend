"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

const getImageUrl = (featuredImage) => {
  if (!featuredImage) return null;
  if (typeof featuredImage === "object" && featuredImage.url) {
    return featuredImage.url;
  }
  if (typeof featuredImage === "string") return featuredImage;
  return null;
};

const getPrimaryCategory = (post) => post?.category || "";

const formatTimeAgo = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MobileNewsCard = ({ post, big = false }) => (
  <Link
    href={`/news/${post.slug}`}
    className={`group relative block overflow-hidden rounded-2xl shadow-md shadow-black/10 ring-1 ring-black/5 ${
      big ? "h-44 sm:h-64" : "h-32 sm:h-40"
    }`}
  >
    {getImageUrl(post.featuredImage) ? (
      <img
        src={getImageUrl(post.featuredImage)}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    ) : (
      <div className="absolute inset-0 bg-[var(--color-surface)]" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
    {big && getPrimaryCategory(post) && (
      <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
        {getPrimaryCategory(post)}
      </span>
    )}
    <div className="absolute inset-x-0 bottom-0 p-3">
      <h4
        className={`font-bold text-white leading-snug line-clamp-2 ${
          big ? "text-base sm:text-lg" : "text-xs"
        }`}
      >
        {post.title}
      </h4>
      <span className={`mt-1 block text-white/75 ${big ? "text-xs" : "text-[10px]"}`}>
        {formatTimeAgo(post.publishDate || post.createdAt)}
      </span>
    </div>
  </Link>
);

const NewsListItem = ({ post, compact = false }) => (
  <Link
    href={`/news/${post.slug}`}
    className="group relative flex items-start gap-3 rounded-xl bg-white p-2.5 ring-1 ring-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/[0.03] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] hover:ring-[var(--color-primary)]/25"
  >
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)] ${
        compact ? "h-14 w-14" : "h-16 w-16"
      }`}
    >
      {getImageUrl(post.featuredImage) ? (
        <img
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/5" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      {getPrimaryCategory(post) && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
          <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
          {getPrimaryCategory(post)}
        </span>
      )}
      <h3 className="mt-0.5 text-sm font-semibold leading-snug text-[var(--color-heading)] line-clamp-2 transition-colors group-hover:text-[var(--color-primary)]">
        {post.title}
      </h3>
      <span className="mt-1.5 block text-xs text-[var(--color-body)]">
        {formatTimeAgo(post.publishDate || post.createdAt)}
      </span>
    </div>
  </Link>
);

const Newsroom = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API}/api/news?limit=9`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setPosts(data.news || []);
        }
      } catch (error) {
        console.error("Failed to fetch latest news", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-[var(--color-surface)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded-lg w-56 mb-6 md:mb-10 animate-pulse" />
          <div className="hidden lg:grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-3 space-y-5">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded-lg w-20 animate-pulse" />
                  </div>
                  <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-6">
              <div className="h-64 sm:h-80 w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-7 bg-gray-200 rounded-lg w-3/4 mt-5 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
            </div>
            <div className="lg:col-span-3 space-y-5">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded-lg w-20 animate-pulse" />
                  </div>
                  <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden">
            <div className="h-44 sm:h-64 w-full rounded-2xl bg-gray-200 animate-pulse" />
            <div className="mt-4 divide-y divide-[var(--color-border)]">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start gap-3 py-4 first:pt-0">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded-lg w-20 animate-pulse" />
                  </div>
                  <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  const featured = posts.find((post) => post.isFeatured) || posts[0];
  const rest = posts.filter((post) => post._id !== featured._id).slice(0, 8);
  const leftPosts = rest.slice(0, 4);
  const rightPosts = rest.slice(4, 8);

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)]/40 py-8 md:py-12 lg:py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--color-primary) 0%, transparent 100%)",
          opacity: 0.06,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-5 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              </span>
              Newsroom
            </span>
            <h2 className="main-title mt-1.5 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-heading)]">
              News & Media
            </h2>
          </div>
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--color-primary)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:shadow-md"
          >
            <span className="hidden sm:inline">View All News</span>
            <span className="sm:hidden">All News</span>
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile / tablet: big featured card on top, clean thumbnail list below */}
        <div className="lg:hidden">
          <MobileNewsCard post={featured} big />

          <div className="mt-4 space-y-2.5">
            {rest.slice(0, 2).map((post) => (
              <NewsListItem key={post._id || post.slug} post={post} compact />
            ))}
          </div>
        </div>

        {/* Desktop: full three-column layout */}
        <div className="hidden lg:grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          {leftPosts.length > 0 && (
            <div className="lg:col-span-3 space-y-2.5">
              {leftPosts.map((post) => (
                <NewsListItem key={post._id || post.slug} post={post} />
              ))}
            </div>
          )}

          <div className="lg:col-span-6">
            <Link
              href={`/news/${featured.slug}`}
              className="group relative block h-[420px] w-full overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)]"
            >
              {getImageUrl(featured.featuredImage) ? (
                <img
                  src={getImageUrl(featured.featuredImage)}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />
              <div className="absolute inset-0 opacity-0 ring-2 ring-inset ring-[var(--color-primary)] transition-opacity duration-300 group-hover:opacity-60" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    ★ Featured
                  </span>
                  {getPrimaryCategory(featured) && (
                    <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      {getPrimaryCategory(featured)}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-[1.75rem] font-extrabold leading-tight text-white line-clamp-2 transition-colors group-hover:text-white/90">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-3 text-sm sm:text-base text-white/70 line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/60">
                  <span>{formatTimeAgo(featured.publishDate || featured.createdAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="inline-flex items-center gap-1 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read story <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {rightPosts.length > 0 && (
            <div className="lg:col-span-3 space-y-2.5">
              {rightPosts.map((post) => (
                <NewsListItem key={post._id || post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsroom;
