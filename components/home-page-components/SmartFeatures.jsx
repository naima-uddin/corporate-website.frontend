"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

// Bar heights (%) for the "dark" style card chart. When a numeric statValue is
// present (e.g. "30%") the chart is derived from it; otherwise this decorative
// pattern is used as a fallback.
const DECOR_BARS = [55, 80, 45, 95, 60, 85];
const BAR_COUNT = 6;
// Pleasant rising/dipping shape the dynamic chart is scaled against.
const BAR_SHAPE = [0.5, 0.75, 0.4, 1, 0.65, 0.85];

// Pulls a 0–100 number out of a stat string like "30%", "30 %", "30".
const parsePercent = (value) => {
  if (value == null) return null;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
};

const LightCard = ({ feature }) => (
  <div className="flex flex-col justify-between rounded-2xl bg-[#f4f6fb] p-6 md:p-8 min-h-[22rem]">
    <div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] leading-snug">
          {feature.title}
        </h3>
        <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-sm text-[var(--color-heading)]">
          <Zap className="w-5 h-5" />
        </span>
      </div>
      {feature.description && (
        <p className="mt-3 text-sm md:text-base text-[var(--color-body)] max-w-xs">
          {feature.description}
        </p>
      )}
    </div>

    {(feature.statValue || feature.statLabel) && (
      <div className="flex items-end gap-3 mt-8">
        {feature.statValue && (
          <span className="text-4xl md:text-5xl font-extrabold text-[var(--color-heading)] leading-none">
            {feature.statValue}
          </span>
        )}
        {feature.statLabel && (
          <span className="text-sm md:text-base font-semibold text-[var(--color-heading)] leading-tight">
            {feature.statLabel}
          </span>
        )}
      </div>
    )}
  </div>
);

const ImageCard = ({ feature }) => (
  <div className="relative flex flex-col justify-between rounded-2xl overflow-hidden p-6 md:p-8 min-h-[22rem]">
    {feature.image ? (
      <img
        src={feature.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

    <div className="relative z-10">
      <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
        {feature.title}
      </h3>
      {feature.description && (
        <p className="mt-3 text-sm md:text-base text-white/85 max-w-xs">
          {feature.description}
        </p>
      )}
    </div>

    {feature.badge && (
      <div className="relative z-10 mt-8">
        <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-heading)] shadow-sm">
          {feature.badge}
        </span>
      </div>
    )}
  </div>
);

const DarkCard = ({ feature }) => {
  const percent = parsePercent(feature.statValue);

  // Dynamic chart: heights follow the shape scaled by the stat value, and the
  // number of highlighted bars reflects the percentage (e.g. 30% ≈ 2 of 6 lit).
  const bars =
    percent == null
      ? DECOR_BARS.map((h, i) => ({ height: h, active: i % 3 === 1 }))
      : BAR_SHAPE.map((f, i) => ({
          // Shape keeps the chart looking full; the value drives how many bars light up.
          height: Math.round(35 + f * 65),
          active: i < Math.round((percent / 100) * BAR_COUNT),
        }));

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#0e2f6b] p-6 md:p-8 min-h-[22rem]">
      <div>
        {feature.statValue && (
          <span className="block text-5xl md:text-6xl font-extrabold text-white leading-none">
            {feature.statValue}
          </span>
        )}
        {(feature.description || feature.statLabel) && (
          <p className="mt-4 text-sm md:text-base text-white/80 max-w-xs">
            {feature.description || feature.statLabel}
          </p>
        )}
      </div>

      <div className="flex items-end gap-2 md:gap-3 mt-8 h-24">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 rounded-md transition-all ${
              bar.active ? "bg-white" : "bg-white/25"
            }`}
            style={{ height: `${bar.height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

const CardByStyle = ({ feature }) => {
  if (feature.style === "image") return <ImageCard feature={feature} />;
  if (feature.style === "dark") return <DarkCard feature={feature} />;
  return <LightCard feature={feature} />;
};

const SmartFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setFeatures(data.features || []);
      } catch (error) {
        console.error("Error fetching smart features:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/smart-feature-settings`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setSettings(data.settings || null);
      } catch (error) {
        console.error("Error fetching smart feature settings:", error);
      }
    };

    fetchFeatures();
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-h-[22rem] rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) return null;

  const eyebrow = settings?.eyebrow || "Features";
  const title = settings?.title || "";
  const titleAccent = settings?.titleAccent || "";

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 mb4 md:mb-6">
          {eyebrow && (
            <span className="inline-flex w-fit items-center eyebrow">
              {eyebrow}
            </span>
          )}
          {(title || titleAccent) && (
            <h2 className="main-title text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-left lg:max-w-2xl">
              <span className="text-[var(--color-heading)]">{title}</span>{" "}
              <span className="text-gray-400">{titleAccent}</span>
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <CardByStyle key={feature._id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFeatures;
