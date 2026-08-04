"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";

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

const OurStorySection = ({ data }) => {
  if (!data) return null;
  const { label, heading, milestones } = data;
  const steps = Array.isArray(milestones) ? milestones : [];

  return (
    <section className="relative px-6 md:px-20 py-16 bg-white text-black border-t border-[#00f0ff]/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 text-[#0066ff] mb-4">
            <FiBookOpen className="text-2xl" />
            <span className="uppercase tracking-widest text-sm font-medium">
              {label || "Our Story"}
            </span>
          </div>
          <h2 className="main-title text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
            {heading}
          </h2>
        </div>

        {steps.length > 0 && (
          <div className="relative">
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f0ff] via-[#0066ff]/40 to-transparent md:-translate-x-1/2"></div>

            <div className="space-y-10">
              {steps.map((step, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] flex items-center justify-center text-[#0a0a12] font-bold text-xs md:absolute md:left-1/2 md:-translate-x-1/2">
                      {step.year}
                    </div>

                    <div
                      className={`md:w-[calc(50%-3rem)] ${
                        isLeft ? "md:pr-8" : "md:pl-8 md:ml-auto"
                      }`}
                    >
                      <p className="text-black text-base md:text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurStorySection;
