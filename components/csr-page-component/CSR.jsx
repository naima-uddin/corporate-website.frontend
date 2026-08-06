"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaQuoteLeft, FaArrowRight, FaHandsHelping } from "react-icons/fa";

const ChairmanMessage = ({ chairman }) => {
  if (!chairman || (!chairman.message && !chairman.name)) return null;

  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8 sm:p-10">
        {chairman.image ? (
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-full border-4 border-[var(--color-primary-tint)] mx-auto sm:mx-0">
            <Image
              src={chairman.image}
              alt={chairman.name || "Chairman"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-32 w-32 sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-tint)] mx-auto sm:mx-0">
            <FaHandsHelping className="text-4xl text-[var(--color-primary)]" />
          </div>
        )}

        <div className="text-center sm:text-left">
          <FaQuoteLeft className="mx-auto sm:mx-0 mb-3 text-2xl text-[var(--color-primary)]/40" />
          {chairman.message && (
            <p className="text-base md:text-lg text-[var(--color-body)] leading-relaxed italic mb-4">
              {chairman.message}
            </p>
          )}
          {chairman.name && (
            <p className="font-bold text-[#0a1a3c]">{chairman.name}</p>
          )}
          {chairman.designation && (
            <p className="text-sm text-[var(--color-primary)] font-semibold">
              {chairman.designation}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

const CSRActivityRow = ({ item, reversed }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    <div
      className={`relative h-44 md:h-60 lg:h-76 w-full overflow-hidden rounded-xl bg-[var(--color-surface)] border-[var(--color-heading)] ${
        reversed ? "lg:order-2" : "lg:order-1"
      }`}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FaHandsHelping className="text-5xl text-[var(--color-primary)]/40" />
        </div>
      )}
    </div>

    <div className={reversed ? "lg:order-1" : "lg:order-2"}>
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
        CSR Activities
      </span>
      <h2 className="mt-2 mb-4 text-2xl md:text-3xl font-bold leading-tight text-[#0a1a3c]">
        {item.title}
      </h2>
      {item.excerpt && (
        <p className="text-sm md:text-base text-[var(--color-body)] leading-relaxed line-clamp-6 mb-5 whitespace-pre-line">
          {item.excerpt}
        </p>
      )}
      <Link
        href={`/csr/${item.slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#0a1a3c] border-b-2 border-[#0a1a3c] pb-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
      >
        Read More <FaArrowRight className="text-xs" />
      </Link>
    </div>
  </div>
);

const CSRActivitySkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
    <div className="h-64 sm:h-80 lg:h-96 w-full rounded-2xl bg-gray-200 animate-pulse" />
    <div className="space-y-3">
      <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const CSR = () => {
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, activitiesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/csr`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/csr-activities`),
        ]);

        if (pageRes.ok) {
          const pageResult = await pageRes.json();
          setData(pageResult.csr || null);
        }

        if (activitiesRes.ok) {
          const activitiesResult = await activitiesRes.json();
          setActivities(activitiesResult.activities || []);
        }
      } catch (error) {
        console.error("Error fetching CSR page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black">
      <section className="container mx-auto px-6 py-16 text-center">
        <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-primary)]">
          {data?.label || "Giving Back"}
        </span>
        <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold mt-3 mb-6 leading-tight text-[#0a1a3c]">
          {data?.heading || "Corporate Social Responsibility"}
        </h1>
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <p className="text-base md:text-lg text-[var(--color-body)] max-w-2xl mx-auto leading-relaxed">
          {data?.description ||
            "We believe in creating a positive impact beyond our business — supporting communities, education and sustainable initiatives."}
        </p>
      </section>

      <ChairmanMessage chairman={data?.chairman} />

      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24">
          {loading ? (
            [1, 2].map((item) => <CSRActivitySkeleton key={item} />)
          ) : activities.length > 0 ? (
            activities.map((item, index) => (
              <CSRActivityRow
                key={item._id || item.slug}
                item={item}
                reversed={index % 2 === 1}
              />
            ))
          ) : (
            <p className="text-center text-[var(--color-body)]">
              No CSR activities to show yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CSR;
