"use client";

import React, { useEffect, useState } from "react";
import NewsCard from "@/components/ui/NewsCard";
import { FiLoader } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const NewsListClient = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      try {
        const res = await fetch(`${API}/api/news`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setNews(data.news || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-heading)] mb-10">
        News &amp; Media
      </h1>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      )}

      {!loading && news.length === 0 && (
        <p className="text-[var(--color-body)]">No news items yet.</p>
      )}

      {!loading && news.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
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
      )}
    </div>
  );
};

export default NewsListClient;
