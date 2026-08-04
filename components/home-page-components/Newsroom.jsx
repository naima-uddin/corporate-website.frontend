"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

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

const NewsListItem = ({ post }) => (
  <Link
    href={`/news/${post.slug}`}
    className="group flex items-start justify-between gap-3 py-4 first:pt-0"
  >
    <div className="min-w-0 flex-1">
      <h3 className="text-sm font-semibold leading-snug text-[var(--color-heading)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
        {post.title}
      </h3>
      <span className="mt-2 block text-xs text-[var(--color-body)]">
        {formatTimeAgo(post.publishDate || post.createdAt)}
      </span>
    </div>
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface)]">
      {getImageUrl(post.featuredImage) && (
        <img
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
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
      <section className="py-10 sm:py-14 md:py-20 bg-white">
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
            <div className="h-44 sm:h-64 w-full rounded-lg bg-gray-200 mb-3 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="h-20 sm:h-24 w-full rounded-md bg-gray-200 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-lg w-full animate-pulse" />
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
    <section className="py-10 sm:py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <SectionHeading
            eyebrow="Newsroom"
            title="News & Media"
            align="left"
            className="mb-0"
          />
          <Link
            href="/news"
            className="mb-2 inline-flex shrink-0 items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:gap-3"
          >
            View All News
            <FiArrowRight />
          </Link>
        </div>

        {/* Mobile / tablet: compact layout — row, big image, row */}
        <div className="lg:hidden space-y-5">
          <div className="grid grid-cols-2 gap-x-4">
            {rest.slice(0, 2).map((post) => (
              <Link
                key={post._id || post.slug}
                href={`/news/${post.slug}`}
                className="group block"
              >
                <div className="relative h-20 sm:h-24 w-full overflow-hidden rounded-md bg-[var(--color-surface)]">
                  {getImageUrl(post.featuredImage) && (
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h4 className="mt-2 text-xs font-semibold leading-snug text-[var(--color-heading)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </h4>
                <span className="mt-1 block text-[10px] text-[var(--color-body)]">
                  {formatTimeAgo(post.publishDate || post.createdAt)}
                </span>
              </Link>
            ))}
          </div>

          <Link href={`/news/${featured.slug}`} className="group block">
            <div className="relative h-44 sm:h-64 w-full overflow-hidden rounded-lg bg-[var(--color-surface)]">
              {getImageUrl(featured.featuredImage) && (
                <img
                  src={getImageUrl(featured.featuredImage)}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {getPrimaryCategory(featured) && (
                <span className="absolute left-3 top-3 rounded bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {getPrimaryCategory(featured)}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-base sm:text-xl font-bold leading-snug text-[var(--color-heading)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {featured.title}
            </h3>
            <span className="mt-2 block text-xs text-[var(--color-body)]">
              {formatTimeAgo(featured.publishDate || featured.createdAt)}
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-x-4">
            {rest.slice(2, 4).map((post) => (
              <Link
                key={post._id || post.slug}
                href={`/news/${post.slug}`}
                className="group block"
              >
                <div className="relative h-20 sm:h-24 w-full overflow-hidden rounded-md bg-[var(--color-surface)]">
                  {getImageUrl(post.featuredImage) && (
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h4 className="mt-2 text-xs font-semibold leading-snug text-[var(--color-heading)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </h4>
                <span className="mt-1 block text-[10px] text-[var(--color-body)]">
                  {formatTimeAgo(post.publishDate || post.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: full three-column layout */}
        <div className="hidden lg:grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12 lg:divide-x lg:divide-[var(--color-border)]">
          {leftPosts.length > 0 && (
            <div className="lg:col-span-3 divide-y divide-[var(--color-border)] lg:pr-4">
              {leftPosts.map((post) => (
                <NewsListItem key={post._id || post.slug} post={post} />
              ))}
            </div>
          )}

          <div className="lg:col-span-6 lg:pr-8 ">
            <Link href={`/news/${featured.slug}`} className="group block">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-lg bg-[var(--color-surface)]">
                {getImageUrl(featured.featuredImage) && (
                  <img
                    src={getImageUrl(featured.featuredImage)}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {getPrimaryCategory(featured) && (
                  <span className="absolute left-4 top-4 rounded bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {getPrimaryCategory(featured)}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-xl sm:text-2xl font-bold leading-snug text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mt-3 text-sm sm:text-base text-[var(--color-body)] line-clamp-2">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-3 block text-xs text-[var(--color-body)]">
                {formatTimeAgo(featured.publishDate || featured.createdAt)}
              </span>
            </Link>
          </div>

          {rightPosts.length > 0 && (
            <div className="lg:col-span-3 divide-y divide-[var(--color-border)] lg:-pl-2">
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
