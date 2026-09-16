"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";

const WhatWeOffer = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCategoryLabel = (value) =>
    String(value || "")
      .trim()
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load services");
        }

        if (isMounted) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || "Failed to load services");
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load categories");
        }

        if (isMounted) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const categoryIconMap = {
    erp: Database,
    amazon: ShoppingCart,
    "digital-marketing": TrendingUp,
    "design-development": Code,
    shopify: Store,
    ebay: Tag,
    hosting: Server,
    "ecommerce-dev": ShoppingBag,
  };

  const servicesWithIcon = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        iconName: categoryIconMap[service.category]?.name || "Code",
      })),
    [services],
  );

  const categoryTiles = useMemo(
    () =>
      categories.map((category) => {
        const servicesInCategory = servicesWithIcon.filter(
          (service) => service.category === category.name,
        );
        const image =
          servicesInCategory.find((service) => service.image)?.image || "";

        return {
          id: category.name,
          label: category.displayName || formatCategoryLabel(category.name),
          image,
          iconName: servicesInCategory[0]?.iconName || "Code",
          services: servicesInCategory,
        };
      }),
    [categories, servicesWithIcon],
  );

  useEffect(() => {
    if (!activeCategory && categoryTiles.length > 0) {
      setActiveCategory(categoryTiles[0].id);
    }
  }, [categoryTiles, activeCategory]);

  const activeTile =
    categoryTiles.find((tile) => tile.id === activeCategory) || categoryTiles[0];

  const renderIcon = (iconName, className = "w-6 h-6 text-[var(--color-primary)]") => {
    const Icon = iconMap[iconName] || Code;
    return <Icon className={className} />;
  };

  const isLoading = loading || categoriesLoading;

  return (
    <section className="relative overflow-hidden py-6 md:py-16 bg-[var(--color-surface)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Our Services"
          subtitle="Comprehensive digital solutions tailored to elevate your business to new heights."
          align="left"
          bottomSpacing="mb-3 md:mb-10"
          compact
        />

        {isLoading && categoryTiles.length === 0 && (
          <div className="flex flex-col lg:flex-row items-stretch gap-2 lg:gap-5">
            <div className="grid grid-cols-2 gap-2 lg:w-[36%]">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 sm:h-28 lg:h-36 rounded-xl lg:rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
            <div className="min-h-[220px] sm:min-h-[300px] lg:min-h-[340px] flex-1 rounded-xl lg:rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        )}

        {!isLoading && error && categoryTiles.length === 0 && (
          <div className="max-w-xl mx-auto rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && categoryTiles.length === 0 && (
          <div className="text-center py-12 text-[var(--color-body)]">
            No services found.
          </div>
        )}

        {categoryTiles.length > 0 && (
          <div className="flex flex-col lg:flex-row items-stretch gap-2 lg:gap-5">
            <div className="grid grid-cols-2 gap-2 lg:w-[36%]">
              {categoryTiles.map((tile) => {
                const isActive = tile.id === activeTile?.id;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setActiveCategory(tile.id)}
                    className={`group relative h-16 sm:h-28 lg:h-36 overflow-hidden rounded-xl lg:rounded-2xl text-left transition-all duration-300 ${
                      isActive
                        ? "shadow-lg shadow-black/20 ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]"
                        : "shadow-sm hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    {tile.image ? (
                      <img
                        src={tile.image}
                        alt={tile.label}
                        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                          isActive ? "scale-105" : "group-hover:scale-110"
                        }`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-tint)]">
                        {renderIcon(tile.iconName)}
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        isActive
                          ? "bg-gradient-to-t from-[var(--color-primary)]/90 via-[var(--color-primary)]/20 to-transparent"
                          : "bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85"
                      }`}
                    />

                    <span
                      className={`absolute right-2 top-2 sm:right-3 sm:top-3 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
                        isActive
                          ? "bg-white text-[var(--color-primary)]"
                          : "bg-white/20 text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isActive ? (
                        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      ) : (
                        renderIcon(tile.iconName, "w-3.5 h-3.5 sm:w-4 sm:h-4")
                      )}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 sm:px-4 sm:py-3">
                      <span className="text-xs sm:text-base font-bold text-white drop-shadow-sm">
                        {tile.label}
                      </span>
                      {isActive && (
                        <span className="mt-1 hidden sm:block h-[3px] w-8 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-[340px] flex-1 overflow-hidden rounded-xl lg:rounded-2xl shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTile?.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {activeTile?.image ? (
                    <img
                      src={activeTile.image}
                      alt={activeTile.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary-tint)]">
                      {renderIcon(activeTile?.iconName, "w-16 h-16 text-[var(--color-primary)]")}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 lg:p-8">
                    {activeTile?.services?.length > 0 && (
                      <div className="mb-2.5 sm:mb-6 flex flex-wrap gap-1.5 sm:gap-2">
                        {activeTile.services.slice(0, 8).map((service) => (
                          <button
                            key={service._id || service.title}
                            onClick={() => router.push(service.path)}
                            className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:text-[var(--color-heading)] hover:shadow-lg"
                          >
                            {service.title}
                          </button>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/services/category/${activeTile?.id}`}
                      className="group/link inline-flex items-center gap-1 sm:gap-2 rounded-full bg-white px-3 py-1 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm font-bold text-[var(--color-heading)] shadow-lg transition-all duration-300 hover:gap-3 hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      Explore More
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeOffer;
