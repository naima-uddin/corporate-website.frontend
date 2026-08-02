"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const NAVBAR_HEIGHT_CLASS = "-mt-20";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideInterval = useRef(null);
  const bannerRef = useRef(null);

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

  useEffect(() => {
    if (slides.length < 2) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [slides.length]);

  const startAutoSlide = () => {
    slideInterval.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(slideInterval.current);
  };

  const nextSlide = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAnimating(false);
  };

  const goToSlide = async (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentSlide(index);
    setIsAnimating(false);
  };

  if (loading) {
    return (
      <div
        className={`relative w-full h-[70vh] sm:h-[75vh] lg:h-[85vh] bg-[var(--color-ink)] animate-pulse ${NAVBAR_HEIGHT_CLASS}`}
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
      ref={bannerRef}
      className={`relative w-full h-[70vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden ${NAVBAR_HEIGHT_CLASS}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 z-0">
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
          </div>

          <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="max-w-2xl"
              >
                {slide.eyebrow && (
                  <span className="eyebrow text-white/90 mb-4">
                    {slide.eyebrow}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                    {slide.subtitle}
                  </p>
                )}

                {slide.buttonText && slide.buttonLink && (
                  <div className="flex flex-wrap gap-4">
                    <Button href={slide.buttonLink} variant="primary" showArrow>
                      {slide.buttonText}
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
