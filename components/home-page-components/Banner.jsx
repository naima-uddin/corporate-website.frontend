"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "@/components/ui/Button";

const NAVBAR_HEIGHT_CLASS = "-mt-20";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/banners`,
        );

        if (!response.ok) return;

        const data = await response.json();
        setSlides(data.banners || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Restarts on every slide change (auto or manual) so autoplay never
  // fires right on top of a manual click.
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length, currentSlide]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  if (loading) {
    return (
      <div
        className={`relative w-full h-[75vh] sm:h-[80vh] lg:h-[88vh] bg-[var(--color-ink)] animate-pulse ${NAVBAR_HEIGHT_CLASS}`}
      />
    );
  }

  if (slides.length === 0) {
    return (
      <div
        className={`relative w-full h-20 bg-[var(--color-ink)] ${NAVBAR_HEIGHT_CLASS}`}
      />
    );
  }

  const slide = slides[currentSlide] || slides[0];

  return (
    <div
      className={`relative w-full h-[75vh] sm:h-[80vh] lg:h-[88vh] overflow-hidden bg-[var(--color-ink)] ${NAVBAR_HEIGHT_CLASS}`}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={slide.image}
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full flex flex-col justify-end pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl lg:pr-72"
            >
              {slide.eyebrow && (
                <span className="eyebrow text-white/90 mb-4 block">
                  {slide.eyebrow}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 text-balance">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                  {slide.subtitle}
                </p>
              )}

              {slide.buttonText && slide.buttonLink && (
                <Button href={slide.buttonLink} variant="outline" showArrow>
                  {slide.buttonText}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-6 lg:right-12 z-30 w-64 sm:w-72">
          <div className="hidden lg:flex gap-2 justify-end mb-3 overflow-x-auto">
            {slides.map((s, index) => (
              <button
                key={s._id}
                onClick={() => goToSlide(index)}
                aria-label={`Show slide: ${s.title}`}
                className={`relative shrink-0 w-14 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                  currentSlide === index
                    ? "border-white opacity-100 scale-105"
                    : "border-white/30 opacity-55 hover:opacity-85"
                }`}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-white/50 text-white hover:bg-white/10 transition-colors"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-white/50 text-white hover:bg-white/10 transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
