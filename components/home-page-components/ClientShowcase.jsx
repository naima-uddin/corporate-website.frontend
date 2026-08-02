"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const ClientShowcase = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos`,
        );

        if (!response.ok) return;

        const data = await response.json();
        setLogos((data.logos || []).map((logo) => logo.image));
      } catch (error) {
        console.error("Error fetching client logos:", error);
      }
    };

    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Trusted By" title="Our Clients" />

        <div className="overflow-hidden whitespace-nowrap">
          <div
            className="inline-flex items-center"
            style={{ animation: "scroll 30s linear infinite" }}
          >
            {[...logos, ...logos].map((logo, idx) => (
              <Image
                key={idx}
                src={logo}
                alt={`client-logo-${idx}`}
                width={120}
                height={64}
                className="inline-block h-14 md:h-16 w-auto mx-6 md:mx-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300"
                unoptimized
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default ClientShowcase;
