"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const JoinUs = () => {
  const [joinUs, setJoinUs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinUs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/join-us`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setJoinUs(data.joinUs || null);
      } catch (error) {
        console.error("Error fetching join us section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinUs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-[var(--color-surface,#f0f0f0)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4 md:mb-6">
            <div className="max-w-2xl w-full">
              <div className="h-4 bg-gray-300 rounded-lg w-24 mb-3 animate-pulse" />
              <div className="h-10 bg-gray-300 rounded-lg w-2/3 animate-pulse" />
            </div>
            <div className="h-12 bg-gray-300 rounded-full w-40 shrink-0 animate-pulse" />
          </div>
          <div className="flex flex-col md:flex-row gap-5 md:h-[500px]">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`md:h-full bg-gray-300 animate-pulse ${
                  item === 1
                    ? "h-80 sm:h-96 md:flex-[1.6]"
                    : "h-32 sm:h-40 md:flex-1"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!joinUs) return null;

  const cards = (joinUs.cards || []).slice(0, 4);
  if (cards.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--color-surface,#f0f0f0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-row items-start justify-between gap-4 md:items-end mb-4 md:mb-6"
        >
          <div className="max-w-2xl min-w-0">
            <span className="eyebrow mb-3">Careers</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-heading,#111)] uppercase">
              {joinUs.title}
            </h2>
            {joinUs.description && (
              <p className="text-sm md:text-base lg:text-lg leading-relaxed text-[var(--color-body,#555)]">
                {joinUs.description}
              </p>
            )}
          </div>

          {joinUs.buttonText && joinUs.buttonLink && (
            <a
              href={joinUs.buttonLink}
              className="group shrink-0 inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-7 md:py-3 rounded-full border-2 border-[var(--color-heading,#111)] text-[var(--color-heading,#111)] text-xs md:text-sm font-semibold transition-colors hover:bg-[var(--color-heading,#111)] hover:text-white"
            >
              {joinUs.buttonText}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-5 md:h-[500px]">
          {cards.map((card, index) => {
            const isFeatured = index === 0;
            return (
              <motion.a
                key={index}
                href={card.link || undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`group relative block overflow-hidden bg-[var(--color-ink,#1a1a1a)] shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl md:h-full ${
                  isFeatured
                    ? "h-80 sm:h-96 md:flex-[1.6]"
                    : "h-32 sm:h-40 md:flex-1"
                } ${card.link ? "cursor-pointer" : "cursor-default"}`}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.label || "Join Us"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark,#333)] to-[var(--color-primary,#555)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

                {card.label && (
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span
                      className={`block font-semibold text-white ${
                        isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"
                      }`}
                    >
                      {card.label}
                    </span>
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 text-white/80 transition-all duration-300 group-hover:gap-2.5 group-hover:text-white ${
                        isFeatured ? "text-sm md:text-base" : "text-xs md:text-sm"
                      }`}
                    >
                      <span className="h-px w-5 bg-current" />
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
