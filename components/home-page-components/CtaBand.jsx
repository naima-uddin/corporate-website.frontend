import React from "react";
import { Button } from "@/components/ui/Button";

const CtaBand = () => {
  return (
    <section className="bg-[var(--color-ink)] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <span className="eyebrow text-white/80 mb-3">Let&apos;s Work Together</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Ready to build your next digital product?
          </h2>
          <p className="mt-3 text-white/60 max-w-xl">
            Tell us about your project and our team will get back to you within
            one business day.
          </p>
        </div>
        <Button href="/contact" variant="primary" showArrow className="shrink-0">
          Get In Touch
        </Button>
      </div>
    </section>
  );
};

export default CtaBand;
