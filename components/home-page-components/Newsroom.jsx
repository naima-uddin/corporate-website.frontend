"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import NewsCard from "@/components/ui/NewsCard";
import Button from "@/components/ui/Button";

const API = process.env.NEXT_PUBLIC_API_URL;

const getImageUrl = (featuredImage, thumbnail = null) => {
  if (!featuredImage && !thumbnail) return null;
  if (featuredImage && typeof featuredImage === "object" && featuredImage.url) {
    return featuredImage.url;
  }
  return thumbnail || null;
};

const getPrimaryCategory = (blog) => {
  if (blog?.categories?.length > 0) {
    const category = blog.categories[0];
    return typeof category === "string" ? category : category.name || category.slug || "";
  }
  return "";
};

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

const Newsroom = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API}/api/blog?page=1&limit=3`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setPosts(data.data || data.blogs || []);
        }
      } catch (error) {
        console.error("Failed to fetch latest posts", error);
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Newsroom"
            title="Latest Insights"
            align="left"
            className="mb-0"
          />
          <Button href="/blog" variant="link" className="mb-2 hidden md:inline-flex">
            View All News
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <NewsCard
              key={post._id || post.slug}
              href={`/blog/${post.slug}`}
              image={getImageUrl(post.featuredImage, post.thumbnail)}
              date={formatDate(post.createdAt || post.publishedAt)}
              category={getPrimaryCategory(post)}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button href="/blog" variant="link">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsroom;
