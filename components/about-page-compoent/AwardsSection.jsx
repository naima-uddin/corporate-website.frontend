"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MOBILE_PAGE_SIZE = 3;

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
  const [mobilePage, setMobilePage] = useState(0);

  if (!Array.isArray(awards) || awards.length === 0) return null;

  const pageCount = Math.ceil(awards.length / MOBILE_PAGE_SIZE);
  const page = Math.min(mobilePage, pageCount - 1);
  const mobileAwards = awards.slice(
    page * MOBILE_PAGE_SIZE,
    page * MOBILE_PAGE_SIZE + MOBILE_PAGE_SIZE,
  );

  return (
    <section className="px-2 md:px-6 py-6 bg-white text-black ">
      <div className="max-w-7xl mx-auto">
        <h2 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6 md:mb-10">
          Awards &amp; <span className="text-[#0066ff]">Accolades</span>
        </h2>

        {/* Mobile: 3 per page with pagination */}
        <div className="sm:hidden">
          <div className="grid grid-cols-1 gap-4">
            {mobileAwards.map((award, index) => (
              <MotionDiv
                key={page * MOBILE_PAGE_SIZE + index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="h-56"
              >
                <AwardCard award={award} featured={false} />
              </MotionDiv>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                type="button"
                onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous awards"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors disabled:opacity-40 enabled:hover:bg-slate-100"
              >
                <FiChevronLeft />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMobilePage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === page ? "w-5 bg-[#0066ff]" : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobilePage((p) => Math.min(pageCount - 1, p + 1))
                }
                disabled={page === pageCount - 1}
                aria-label="Next awards"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors disabled:opacity-40 enabled:hover:bg-slate-100"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Tablet & desktop: full grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:auto-rows-[240px]">
          {awards.map((award, index) => {
            const featured = index === 0;
            return (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-72 lg:h-full ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
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
