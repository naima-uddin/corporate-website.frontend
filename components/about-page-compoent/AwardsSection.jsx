"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionDiv =
  motion?.div ||
  (({
    children,
    initial,
    whileInView,
    transition,
    whileHover,
    whileTap,
    ...props
  }) => <div {...props}>{children}</div>);

const AwardCard = ({ award, featured }) => (
  <div className="relative h-full  rounded-sm overflow-hidden border border-slate-300 shadow-sm hover:shadow-lg transition-all duration-300 bg-slate-30">
    {award.image ? (
      <Image
        src={award.image}
        alt={award.title || "Award"}
        fill
        unoptimized
        className="object-cover"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/10 to-[#0066ff]/10 text-[#0066ff] font-semibold text-sm px-4 text-center">
        {award.title}
      </div>
    )}

    {(award.title || award.description) && (
      <div
        className={`absolute inset-x-0 bottom-0 bg-white/25 backdrop-blur-md border-t border-white/40 px-4 py-1 -mb-1 ${featured ? "md:px-6 md:py-2" : ""}`}
      >
        {award.title && (
          <h3
            className={`font-semibold text-black drop-shadow-sm ${featured ? "text-lg md:text-xl" : "text-sm md:text-base"}`}
          >
            {award.title}
          </h3>
        )}
        {award.description && (
          <p
            className={`text-slate-800 mt-1 leading-relaxed drop-shadow-sm ${featured ? "text-sm md:text-base" : "text-xs md:text-sm line-clamp-3"}`}
          >
            {award.description}
          </p>
        )}
      </div>
    )}
  </div>
);

const AwardsSection = ({ awards }) => {
  if (!Array.isArray(awards) || awards.length === 0) return null;

  return (
    <section className="px-6 md:px-20 py-16 bg-white text-black border-t border-[#00f0ff]/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8 md:mb-10">
          Awards &amp; <span className="text-[#0066ff]">Accolades</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:auto-rows-[240px]">
          {awards.map((award, index) => {
            const featured = index === 0;
            return (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <AwardCard award={award} featured={featured} />
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
