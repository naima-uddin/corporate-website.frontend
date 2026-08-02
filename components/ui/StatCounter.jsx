"use client";

import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatItem = ({ value, suffix = "+", label, dark = false }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <div ref={ref} className="text-center px-4">
      <p
        className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight ${
          dark ? "text-white" : "text-[var(--color-heading)]"
        }`}
      >
        {inView ? <CountUp end={value} duration={2.5} separator="," /> : "0"}
        <span className="text-[var(--color-primary)]">{suffix}</span>
      </p>
      <p
        className={`mt-2 text-sm md:text-base font-medium uppercase tracking-wide ${
          dark ? "text-white/60" : "text-[var(--color-body)]"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

const COLS_BY_COUNT = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

const StatCounter = ({ stats, dark = false, className = "" }) => {
  const colsClass = COLS_BY_COUNT[stats.length] || "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 ${colsClass} gap-8 md:gap-6 ${className}`}>
      {stats.map((stat, idx) => (
        <StatItem key={idx} dark={dark} {...stat} />
      ))}
    </div>
  );
};

export default StatCounter;
