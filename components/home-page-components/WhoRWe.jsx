"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

const getPlainTextLength = (html) => {
  if (typeof document === "undefined") return 0;
  const container = document.createElement("div");
  container.innerHTML = html || "";
  return (container.textContent || "").length;
};

// Walks the quote's HTML and keeps only the first `count` characters of
// visible text, without breaking any formatting tags (bold, color, etc.)
// that wrap the text already revealed — used to "type out" rich HTML.
const getVisibleHtml = (html, count) => {
  if (typeof document === "undefined") return "";
  const container = document.createElement("div");
  container.innerHTML = html || "";
  let remaining = count;

  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (remaining <= 0) {
        child.remove();
        return;
      }
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.length > remaining) {
          child.textContent = child.textContent.slice(0, remaining);
          remaining = 0;
        } else {
          remaining -= child.textContent.length;
        }
      } else {
        walk(child);
      }
    });
  };

  walk(container);
  return container.innerHTML;
};

const WhoRWe = () => {
  const [spotlight, setSpotlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleChars, setVisibleChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [isBubbleInView, setIsBubbleInView] = useState(false);
  const hasStartedTyping = useRef(false);
  const quoteBubbleRef = useRef(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

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

  // The bubble only enters the DOM once `spotlight.quote` is loaded (see the
  // early return below), so the observer must be (re)created after that,
  // not on the component's first mount.
  useEffect(() => {
    if (!spotlight?.quote || !quoteBubbleRef.current) return;

    const el = quoteBubbleRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBubbleInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [spotlight?.quote]);

  useEffect(() => {
    if (!isBubbleInView || !spotlight?.quote || hasStartedTyping.current) return;
    hasStartedTyping.current = true;

    const total = getPlainTextLength(spotlight.quote);
    if (total === 0) {
      setTypingDone(true);
      return;
    }

    const duration = Math.min(4000, Math.max(1200, total * 25));
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setVisibleChars(Math.round(progress * total));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTypingDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isBubbleInView, spotlight?.quote]);

  if (loading) {
    return (
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[5/4] sm:aspect-[4/5] max-w-[260px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 shadow-xl lg:col-span-2 animate-pulse" />
            <div className="lg:col-span-3">
              <div className="h-4 bg-gray-200 rounded-lg w-56 mb-5 sm:mb-6 lg:mb-8 animate-pulse" />
              <div className="relative pl-5 border-l-[3px] border-gray-200 lg:pl-0 lg:border-l-0 lg:bg-gray-100 lg:p-10 lg:shadow-md lg:ring-1 lg:ring-gray-200 lg:rounded-[48px/32px] animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-full" />
                  <div className="h-4 bg-gray-200 rounded-lg w-full" />
                  <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
                </div>
              </div>
              <div className="mt-6 sm:mt-8 lg:mt-12 space-y-2">
                <div className="h-5 bg-gray-200 rounded-lg w-40 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-28 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!spotlight?.quote) return null;

  const visibleQuoteHtml = getVisibleHtml(spotlight.quote, visibleChars);

  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={quoteBubbleRef}>
          {/* Mobile layout: full-width image with title overlay, then a truncated quote */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative -mx-4 sm:-mx-6 px-2 mb-6"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-ink)]">
                {spotlight.image ? (
                  <img
                    src={spotlight.image}
                    alt={spotlight.name || "Spotlight"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 top-0 p-4 text-xs font-semibold uppercase tracking-wide text-white/90">
                  Warm Welcome From Our Founder
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative pl-5 border-l-[3px] border-[var(--color-primary)]/40">
                <MessageSquareQuote
                  className="mb-2 h-6 w-6 text-[var(--color-primary)]/40"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p
                  className={`relative text-sm leading-relaxed text-[var(--color-heading)] ${
                    mobileExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  <span dangerouslySetInnerHTML={{ __html: visibleQuoteHtml }} />
                  {!typingDone && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-[var(--color-heading)] animate-pulse"
                    />
                  )}
                </p>
                {typingDone && (
                  <button
                    type="button"
                    onClick={() => setMobileExpanded((prev) => !prev)}
                    className="mt-2 text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2"
                  >
                    {mobileExpanded ? "Show Less" : "Read Full"}
                  </button>
                )}
              </div>

              <div className="mt-4">
                {spotlight.name && (
                  <p className="text-lg font-bold text-[var(--color-heading)]">
                    {spotlight.name}
                  </p>
                )}
                {spotlight.designation && (
                  <p className="text-sm text-[var(--color-body)]">
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

          {/* Desktop layout: unchanged */}
          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden bg-[var(--color-ink)] aspect-[4/5] max-w-md shadow-xl lg:col-span-2"
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
              <span className="eyebrow mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-[var(--color-primary)]">
                Warm Welcome From Our Founder
              </span>

              <div className="relative mt-8 mb-10">
                <div className="relative bg-[var(--color-surface)] p-10 shadow-md ring-1 ring-[var(--color-border)] rounded-[48px/32px]">
                  <p className="relative text-xl leading-relaxed text-[var(--color-heading)]">
                    <span dangerouslySetInnerHTML={{ __html: visibleQuoteHtml }} />
                    {!typingDone && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-[var(--color-heading)] animate-pulse"
                      />
                    )}
                  </p>

                  {/* curled teardrop tail, like a chat-bubble icon */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 32"
                    className="absolute h-10 w-[1.875rem] -mt-1 left-14"
                    style={{ top: "100%", transform: "rotate(-12deg)" }}
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
                  <p className="text-xl font-bold text-[var(--color-heading)]">
                    {spotlight.name}
                  </p>
                )}
                {spotlight.designation && (
                  <p className="text-base text-[var(--color-body)]">
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
      </div>
    </section>
  );
};

export default WhoRWe;
