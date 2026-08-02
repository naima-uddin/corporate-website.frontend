"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

const renderQuote = (text) => {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const WhoRWe = () => {
  const [spotlight, setSpotlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/spotlight`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setSpotlight(data.spotlight || null);
      } catch (error) {
        console.error("Error fetching spotlight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlight();
  }, []);

  if (loading || !spotlight?.quote) return null;

  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden bg-[var(--color-ink)] aspect-[4/5] max-w-md mx-auto lg:mx-0 shadow-xl"
          >
            {spotlight.image ? (
              <img
                src={spotlight.image}
                alt={spotlight.name || "Spotlight"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)]" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="eyebrow mb-4">Who We Are</span>

            <div className="relative mt-8 pb-5">
              {/* tail, sits behind the bubble so its top half is hidden */}
              <span
                aria-hidden="true"
                className="absolute left-12 bottom-2 z-0 h-8 w-8 rotate-45 rounded-md bg-[var(--color-surface)] ring-1 ring-[var(--color-border)]"
              />

              <div className="relative z-10 rounded-[2rem] bg-[var(--color-surface)] p-8 shadow-md ring-1 ring-[var(--color-border)] md:p-10">
                <MessageSquareQuote
                  className="mb-3 h-8 w-8 text-[var(--color-primary)]/40"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="relative text-xl md:text-2xl leading-relaxed text-[var(--color-heading)]">
                  {renderQuote(spotlight.quote)}
                </p>
              </div>
            </div>

            <div className="mt-12">
              {spotlight.name && (
                <p className="text-lg md:text-xl font-bold text-[var(--color-heading)]">
                  {spotlight.name}
                </p>
              )}
              {spotlight.designation && (
                <p className="text-sm md:text-base text-[var(--color-body)]">
                  {spotlight.designation}
                </p>
              )}
            </div>

            {spotlight.profileLink && (
              <a
                href={spotlight.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-6 px-6 py-2.5 rounded-md border border-[var(--color-heading)] text-[var(--color-heading)] text-sm font-semibold hover:bg-[var(--color-heading)] hover:text-white transition-colors"
              >
                View Profile
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoRWe;
