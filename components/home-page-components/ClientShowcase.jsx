"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const ClientShowcase = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos`,
        );

        if (!response.ok) return;

        const data = await response.json();
        setLogos(data.logos || []);
      } catch (error) {
        console.error("Error fetching client logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Trusted By" title="Our Clients" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-40 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (logos.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Trusted By" title="Our Clients" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {logos.map((logo) => (
            <div
              key={logo._id}
              className="flex flex-col items-center text-center gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-16 w-full flex items-center justify-center">
                <Image
                  src={logo.image}
                  alt={logo.name || "Client logo"}
                  width={120}
                  height={64}
                  className="max-h-16 w-auto object-contain"
                  unoptimized
                />
              </div>
              {logo.name && (
                <p className="text-sm font-semibold text-slate-800">
                  {logo.name}
                </p>
              )}
              {logo.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {logo.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientShowcase;
