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

const AwardsSection = ({ awards }) => {
  if (!Array.isArray(awards) || awards.length === 0) return null;

  return (
    <section className="px-6 md:px-20 py-16 bg-white text-black border-t border-[#00f0ff]/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-8 md:mb-10">
          Awards &amp; <span className="text-[#0066ff]">Accolades</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {awards.map((award, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative h-44 md:h-52 bg-slate-50">
                  {award.image ? (
                    <Image
                      src={award.image}
                      alt={award.title || "Award"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/10 to-[#0066ff]/10 text-[#0066ff] font-semibold text-sm px-4 text-center">
                      {award.title}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#ff2d95]"></div>
                </div>
              </div>
              {award.description && (
                <p className="text-black text-sm md:text-base leading-relaxed mt-4">
                  {award.description}
                </p>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
