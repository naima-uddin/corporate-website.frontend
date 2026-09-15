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
  ArrowRight,
} from "lucide-react";

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

const normalizeHref = (path) => {
  const value = String(path || "").trim();
  if (!value) return "/services";
  return value.startsWith("/") ? value : `/${value}`;
};

const ServicesIndexClient = ({ heading, subheading, services }) => {
  return (
    <div className="bg-[var(--color-surface)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-ink-2)]">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      </section>

      {/* Services grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {services.length === 0 ? (
          <p className="text-center text-[var(--color-body)]">
            Services are coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Server;
              return (
                <motion.div
                  key={service._id || service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                >
                  <Link
                    href={normalizeHref(service.path)}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-[var(--color-primary-tint)]" />
                      )}
                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm">
                        <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-lg font-bold text-[var(--color-heading)]">
                        {service.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-body)]">
                        {service.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                        Know More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesIndexClient;
