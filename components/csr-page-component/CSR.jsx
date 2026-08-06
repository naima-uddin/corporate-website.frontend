"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaHandsHelping, FaCalendarAlt } from "react-icons/fa";

const CSRCard = ({ item }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-52 w-full bg-[#eaf2ff]">
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
          <FaHandsHelping className="text-4xl text-[#0a2a6b]" />
        </div>
      )}
    </div>
    <div className="flex flex-1 flex-col p-6">
      {item.date && (
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
          <FaCalendarAlt className="text-[10px]" />
          {item.date}
        </span>
      )}
      <h3 className="text-lg font-bold text-[#0a1a3c] mb-2 leading-snug">
        {item.title}
      </h3>
      <p className="text-sm text-[var(--color-body)] leading-relaxed">
        {item.description}
      </p>
    </div>
  </div>
);

const CSRCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
    <div className="h-52 w-full bg-gray-200 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const CSR = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/csr`,
        );
        if (!response.ok) return;
        const result = await response.json();
        setData(result.csr || null);
      } catch (error) {
        console.error("Error fetching CSR page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const items = Array.isArray(data?.items) ? data.items : [];

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

      {loading ? (
        <section className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <CSRCardSkeleton key={item} />
            ))}
          </div>
        </section>
      ) : (
        items.length > 0 && (
          <section className="container mx-auto px-6 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {items.map((item, index) => (
                <CSRCard key={item.title || index} item={item} />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
};

export default CSR;
