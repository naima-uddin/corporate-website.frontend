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
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  if (posts.length === 0) return null;

  const featured = posts.find((post) => post.isFeatured) || posts[0];
  const rest = posts.filter((post) => post._id !== featured._id).slice(0, 8);
  const leftPosts = rest.slice(0, 4);
  const rightPosts = rest.slice(4, 8);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <SectionHeading
            eyebrow="Newsroom"
            title="News & Media"
            align="left"
            className="mb-0"
          />
          <Link
            href="/news"
            className="mb-2 hidden items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:gap-3 md:inline-flex"
          >
            View All News
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12 lg:divide-x lg:divide-[var(--color-border)]">
          {leftPosts.length > 0 && (
            <div className="lg:col-span-3 divide-y divide-[var(--color-border)]">
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
            <div className="lg:col-span-3 divide-y divide-[var(--color-border)]">
              {rightPosts.map((post) => (
                <NewsListItem key={post._id || post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:gap-3"
          >
            View All News
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Newsroom;
