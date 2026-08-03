"use client";
import React from "react";
import {
  FaRegLightbulb,
  FaUsers,
  FaHistory,
  FaProjectDiagram,
  FaHandshake,
} from "react-icons/fa";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const DEFAULT_STATS = [
  { icon: FaUsers, count: 50, suffix: "+", label: "Team Strength" },
  { icon: FaHistory, count: 13, suffix: "+", label: "Years of Experience" },
  { icon: FaProjectDiagram, count: 500, suffix: "+", label: "Projects Completed" },
  { icon: FaHandshake, count: 100, suffix: "+", label: "Happy Clients" },
];

const StatItem = ({ icon: Icon, count, suffix, label }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center gap-2 px-2 py-2 text-center"
    >
      {Icon && <Icon className="text-2xl text-[#0066ff]" />}
      <p className="text-2xl md:text-3xl font-semibold text-slate-800">
        {inView ? <CountUp end={count} duration={2} /> : 0}
        {suffix}
      </p>
      <p className="text-xs md:text-sm text-slate-500">{label}</p>
    </div>
  );
};

const WhoWeAreSection = ({ data }) => {
  if (!data) return null;
  const { label, heading, body, image, stats } = data;
  const statItems =
    Array.isArray(stats) && stats.length > 0 ? stats : DEFAULT_STATS;

  return (
    <section className="relative px-6 md:px-20 py-16 bg-white text-black overflow-hidden">
      <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#00f0ff]/10 to-transparent opacity-30"></div>

      <div className="relative grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-stretch">
        {/* Left: big image with a stats bar below it, matching the right column's height */}
        <div className="relative flex flex-col order-1 md:order-1">
          <div className="relative flex-1 min-h-[280px] rounded-t-2xl overflow-hidden shadow-xl group">
            <Image
              src={image || "/assets/AboutImg/teamBg.jpg"}
              alt={heading || "Who We Are"}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 rounded-t-2xl border border-[#00f0ff]/20 pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-300/70 bg-slate-100 rounded-b-2xl border border-t-0 border-slate-200">
            {statItems.map((stat, index) => (
              <StatItem
                key={index}
                icon={stat.icon}
                count={stat.count}
                suffix={stat.suffix ?? "+"}
                label={stat.label}
              />
            ))}
          </div>

          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#00f0ff]/10 blur-xl animate-pulse"></div>
        </div>

        {/* Right: text content, defines the row height that the left column matches */}
        <div className="relative z-10 order-2 md:order-2 flex flex-col justify-center">
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
      </div>
    </section>
  );
};

export default WhoWeAreSection;
