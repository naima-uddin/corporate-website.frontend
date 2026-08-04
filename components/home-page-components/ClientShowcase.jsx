"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const MARQUEE_REPEAT = 6;

const ClientShowcase = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [activeId, setActiveId] = useState(null);

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

    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client-showcase-settings`,
        );

        if (!response.ok) return;

        const data = await response.json();
        setDescription(data.settings?.description || "");
      } catch (error) {
        console.error("Error fetching client showcase settings:", error);
      }
    };

    fetchLogos();
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Trusted By" title="Our Clients" align="left" />
          <div className="flex items-center gap-8 md:gap-10 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-20 md:h-24 w-28 md:w-32 shrink-0 rounded-lg bg-gray-200 animate-pulse"
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
        <SectionHeading
          eyebrow="Trusted By"
          title="Our Clients"
          subtitle={description || undefined}
          align="left"
        />

        <div className="overflow-hidden pt-20">
          <div
            className="flex items-center w-max -mt-20 hover:[animation-play-state:paused]"
            style={{ animation: "scroll 30s linear infinite" }}
          >
            {Array.from({ length: MARQUEE_REPEAT }, () => logos)
              .flat()
              .map((logo, idx) => {
              const hasDetails = logo.name || logo.description;
              const isActive = activeId === `${logo._id}-${idx}`;

              return (
                <div
                  key={`${logo._id}-${idx}`}
                  className="group relative mx-6 md:mx-8 shrink-0"
                  onClick={() =>
                    hasDetails &&
                    setActiveId(isActive ? null : `${logo._id}-${idx}`)
                  }
                >
                  <Image
                    src={logo.image}
                    alt={logo.name || "Client logo"}
                    width={120}
                    height={64}
                    className="inline-block h-20 md:h-24 w-auto object-contain transition duration-300 cursor-pointer group-hover:scale-105"
                    unoptimized
                  />

                  {hasDetails && (
                    <div
                      className={`absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-max max-w-[220px] rounded-lg bg-slate-900 text-white text-xs px-3 py-2 shadow-lg pointer-events-none transition-opacity duration-200 z-10 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {logo.name && (
                        <p className="font-semibold whitespace-nowrap">
                          {logo.name}
                        </p>
                      )}
                      {logo.description && (
                        <p className="text-slate-300 mt-0.5 leading-snug whitespace-normal">
                          {logo.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${100 / MARQUEE_REPEAT}%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default ClientShowcase;
