"use client";
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";
import Image from "next/image";

const WhoWeAreSection = ({ data }) => {
  if (!data) return null;
  const { label, heading, body, image } = data;

  return (
    <section className="relative grid md:grid-cols-2 gap-8  items-center px-6 md:px-20 py-16 bg-white text-black overflow-hidden">
      <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#00f0ff]/10 to-transparent opacity-30"></div>

      <div className="relative flex justify-center order-1 md:order-1">
        <div className="relative group">
          <Image
            src={image || "/assets/AboutImg/teamBg.jpg"}
            alt={heading || "Who We Are"}
            width={400}
            height={400}
            unoptimized
            className="max-w-full h-auto object-cover rounded-lg shadow-xl group-hover:shadow-[0_0_30px_-5px_rgba(0,240,255,0.3)] transition-all duration-500"
          />
          <div className="absolute inset-0 rounded-lg border border-[#00f0ff]/20 group-hover:border-[#00f0ff]/40 pointer-events-none transition-all duration-500"></div>
        </div>
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#00f0ff]/10 blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 order-2 md:order-2">
        <div className="flex items-center gap-2 text-[#0066ff] mb-4">
          <FaRegLightbulb className="text-2xl" />
          <span className="uppercase tracking-widest text-sm font-medium">
            {label || "Who We Are"}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
          {heading}
        </h2>
        {body
          ?.split("\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <p
              key={index}
              className="text-black text-lg leading-relaxed mt-4 first:mt-0"
            >
              {paragraph}
            </p>
          ))}
      </div>
    </section>
  );
};

export default WhoWeAreSection;
