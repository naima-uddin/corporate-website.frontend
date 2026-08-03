"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

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
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden bg-[var(--color-ink)] aspect-[4/5] max-w-md mx-auto lg:mx-0 shadow-xl lg:col-span-2"
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
            className="lg:col-span-3"
          >
            <span className="eyebrow mb-4 text-sm font-semibold text-[var(--color-primary)]">
              Warm Welcome From Our Founder
            </span>

            <div className="relative mt-8 mb-10">
              <div
                className="relative bg-[var(--color-surface)] p-6 shadow-md ring-1 ring-[var(--color-border)] md:p-10"
                style={{ borderRadius: "48px / 32px" }}
              >
                <MessageSquareQuote
                  className="mb-0 h-8 w-8 text-[var(--color-primary)]/40"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p
                  className="relative text-md md:text-xl-[2px] leading-relaxed text-[var(--color-heading)]"
                  dangerouslySetInnerHTML={{ __html: spotlight.quote }}
                />

                {/* curled teardrop tail, like a chat-bubble icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 32"
                  className="absolute h-10 w-[1.875rem] -mt-1"
                  style={{ top: "100%", left: 56, transform: "rotate(-12deg)" }}
                >
                  <path
                    d="M12 32C5 24 2 16 2 10.5C2 4.5 6.5 0 12 0C17.5 0 22 4.5 22 10.5C22 16 19 24 12 32Z"
                    fill="var(--color-primary-tint)"
                    stroke="var(--input)"
                    strokeWidth="1.5"
                  />
                </svg>
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
