"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ServiceCategoryClient = ({ category, services }) => {
  return (
    <div className="bg-[var(--color-surface)]">
      {/* Banner */}
      <section className="relative overflow-hidden">
        {category.bannerImage ? (
          <>
            <img
              src={category.bannerImage}
              alt={category.displayName}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-ink-2)]" />
        )}

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {category.displayName}
          </h1>
          {category.description && (
            <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Services list */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {services.length === 0 && (
          <p className="text-center text-[var(--color-body)]">
            No services found in this category yet.
          </p>
        )}

        {services.map((service, index) => {
          const reversed = index % 2 === 1;
          const secondaryImage = service.images?.[0];

          return (
            <motion.div
              key={service._id || service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${
                reversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-8 lg:gap-12`}
            >
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
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
                    alt={service.title}
                    className="w-full h-56 sm:h-64 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)] mb-4">
                  {service.title}
                </h2>
                <p className="text-[var(--color-body)] leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link
                  href={service.path}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] uppercase tracking-wide"
                >
                  Know More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategoryClient;
