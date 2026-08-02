"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  ShoppingCart,
  Database,
  TrendingUp,
  Share2,
  Store,
  Tag,
  ShoppingBag,
  Palette,
  Server,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import ContactFormCard from "@/components/shared/ContactFormCard";

const iconMap = {
  Code,
  Smartphone,
  ShoppingCart,
  Database,
  TrendingUp,
  Share2,
  Store,
  Tag,
  ShoppingBag,
  Palette,
  Server,
};

const parsePair = (line) => {
  const [left, right] = String(line || "").split("|");
  return {
    primary: (left || "").trim(),
    secondary: (right || "").trim(),
  };
};

const ServiceDetailClient = ({ service, categoryLabel, categorySlug }) => {
  const Icon = iconMap[service.icon] || Code;
  const gallery = [service.image, ...(service.images || [])].filter(Boolean);
  const detailParagraphs = String(service.details || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-[var(--color-surface)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {service.image ? (
          <>
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-ink-2)]" />
        )}

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {categoryLabel && (
            <Link
              href={`/services/category/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {categoryLabel}
            </Link>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-white/85 max-w-2xl leading-relaxed">
            {service.description}
          </p>
          <a
            href="#contact"
            className="inline-flex mt-8 items-center bg-white text-[var(--color-heading)] font-semibold py-3 px-7 rounded-lg hover:bg-white/90 transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-16">
        {/* Features */}
        {service.features?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
              What's Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--color-body)]">{feature}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Process */}
        {service.process?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
              Our Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {service.process.map((line, i) => {
                const { primary, secondary } = parsePair(line);
                return (
                  <div
                    key={line}
                    className="rounded-lg border border-[var(--color-border)] bg-white p-5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-tint)] text-sm font-bold text-[var(--color-primary)]">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-[var(--color-heading)]">
                        {primary}
                      </h3>
                    </div>
                    {secondary && (
                      <p className="text-sm text-[var(--color-body)]">{secondary}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stats */}
        {service.stats?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
              Results That Matter
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {service.stats.map((line) => {
                const { primary, secondary } = parsePair(line);
                return (
                  <div
                    key={line}
                    className="text-center rounded-lg border border-[var(--color-border)] bg-white p-5"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
                      {primary}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-[var(--color-body)]">
                      {secondary}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
              Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((src) => (
                <div key={src} className="rounded-lg overflow-hidden border border-[var(--color-border)]">
                  <img src={src} alt={service.title} className="w-full h-64 object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        {detailParagraphs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
              More Details
            </h2>
            <div className="space-y-4">
              {detailParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-[var(--color-body)] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
            Let's Talk
          </h2>
          <ContactFormCard
            subject={service.title}
            title={`Interested in ${service.title}?`}
            subtitle="Share a few details and our team will get back to you shortly."
          />
        </section>
      </div>
    </div>
  );
};

export default ServiceDetailClient;
