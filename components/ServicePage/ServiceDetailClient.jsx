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
  ArrowRight,
} from "lucide-react";
import ContactFormCard from "@/components/shared/ContactFormCard";
import { normalizeBlockOrder } from "@/lib/serviceBlocks";

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

const ServiceDetailClient = ({
  service,
  categoryLabel,
  categorySlug,
  backHref,
  backLabel,
}) => {
  const Icon = iconMap[service.icon] || Code;
  const gallery = [service.image, ...(service.images || [])].filter(Boolean);
  const detailParagraphs = String(service.details || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const basePath = String(service.path || "").replace(/\/+$/, "");
  const sections = [...(service.sections || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );
  const order = normalizeBlockOrder(service.blockOrder, {
    includeSections: true,
  });

  const blocks = {
    features: service.features?.length > 0 && (
      <section key="features">
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
    ),

    process: service.process?.length > 0 && (
      <section key="process">
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
    ),

    stats: service.stats?.length > 0 && (
      <section key="stats">
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
    ),

    gallery: gallery.length > 1 && (
      <section key="gallery">
        <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
          Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((src) => (
            <div
              key={src}
              className="rounded-lg overflow-hidden border border-[var(--color-border)]"
            >
              <img
                src={src}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    ),

    details: detailParagraphs.length > 0 && (
      <section key="details">
        <h2 className="text-2xl font-bold text-[var(--color-heading)] mb-6">
          More Details
        </h2>
        <div className="space-y-4">
          {detailParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[var(--color-body)] leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    ),

    sections: sections.length > 0 && (
      <section key="sections" className="space-y-16 pt-4">
        {sections.map((sec, index) => {
          const reversed = index % 2 === 1;
          const secondaryImage = sec.images?.[0];
          const href = `${basePath}/${sec.slug}`;
          return (
            <motion.div
              key={sec.slug || sec.title || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${
                reversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-8 lg:gap-12`}
            >
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
                {sec.image ? (
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className={`w-full h-56 sm:h-64 object-cover rounded-lg ${
                      secondaryImage ? "" : "col-span-2"
                    }`}
                  />
                ) : (
                  <div className="col-span-2 h-56 sm:h-64 rounded-lg bg-[var(--color-primary-tint)]" />
                )}
                {secondaryImage && (
                  <img
                    src={secondaryImage}
                    alt={sec.title}
                    className="w-full h-56 sm:h-64 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)] mb-4">
                  {sec.title}
                </h2>
                <p className="text-[var(--color-body)] leading-relaxed mb-6">
                  {sec.description}
                </p>
                {sec.slug && (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] uppercase tracking-wide"
                  >
                    Know More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </section>
    ),
  };

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
          {(backHref || categoryLabel) && (
            <Link
              href={backHref || `/services/category/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel || categoryLabel}
            </Link>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight max-w-3xl">
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
        {order.map((key) => blocks[key]).filter(Boolean)}

      
      </div>
    </div>
  );
};

export default ServiceDetailClient;
