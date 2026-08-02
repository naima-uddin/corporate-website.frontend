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
  Loader2,
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
    <section className="py-16 md:py-20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Our Services"
          subtitle="Comprehensive digital solutions tailored to elevate your business to new heights."
          align="left"
        />

        {isLoading && categoryTiles.length === 0 && (
          <div className="flex items-center justify-center py-12 text-[var(--color-body)]">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading services...
          </div>
        )}

        {!isLoading && error && categoryTiles.length === 0 && (
          <div className="max-w-xl mx-auto rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && categoryTiles.length === 0 && (
          <div className="text-center py-12 text-[var(--color-body)]">
            No services found.
          </div>
        )}

        {categoryTiles.length > 0 && (
          <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-4">
            <div className="grid grid-cols-2 gap-3 lg:w-[34%]">
              {categoryTiles.map((tile) => {
                const isActive = tile.id === activeTile?.id;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setActiveCategory(tile.id)}
                    className={`group relative h-28 sm:h-32 overflow-hidden rounded-md text-left transition-all duration-300 ${
                      isActive ? "shadow-lg" : "hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    {isActive ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-ink-2)]" />
                    ) : tile.image ? (
                      <img
                        src={tile.image}
                        alt={tile.label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-tint)]">
                        {renderIcon(tile.iconName)}
                      </div>
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3">
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {tile.label}
                      </span>
                      {isActive && <ArrowRight className="w-4 h-4 text-white" />}
                    </div>

                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTile?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    {activeTile?.services?.length > 0 && (
                      <div className="mb-5 flex flex-wrap gap-2">
                        {activeTile.services.slice(0, 8).map((service) => (
                          <button
                            key={service._id || service.title}
                            onClick={() => router.push(service.path)}
                            className="rounded border border-white/30 bg-black/30 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--color-heading)]"
                          >
                            {service.title}
                          </button>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/services/category/${activeTile?.id}`}
                      className="text-sm font-semibold text-white underline underline-offset-4 decoration-white/70 hover:decoration-white"
                    >
                      Explore More
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
