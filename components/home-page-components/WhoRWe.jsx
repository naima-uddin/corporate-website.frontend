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

  if (loading || !spotlight?.quote) return null;

  const visibleQuoteHtml = getVisibleHtml(spotlight.quote, visibleChars);

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
                ref={quoteBubbleRef}
                className="relative bg-[var(--color-surface)] p-6 shadow-md ring-1 ring-[var(--color-border)] md:p-10"
                style={{ borderRadius: "48px / 32px" }}
              >
                {/* <MessageSquareQuote
                  className="mb-0 h-8 w-8 text-[var(--color-primary)]/40"
                  strokeWidth={1.5}
                  aria-hidden="true"
                /> */}
                <p className="relative text-md md:text-xl-[2px] leading-relaxed text-[var(--color-heading)]">
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
