"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";

const WhatWeOffer = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
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
    ecommerce: ShoppingBag,
    development: Code,
    marketing: TrendingUp,
    design: Palette,
  };

  const serviceIconMap = {
    amazon: ShoppingCart,
    shopify: Store,
    "design-development": Code,
    "e-bay": Tag,
    "mobile-app": Smartphone,
    "e-commerce": ShoppingBag,
    erp: Database,
    seo: TrendingUp,
    "social-media": Share2,
    "server-hosting": Server,
  };

  const resolveServiceIcon = (service) => {
    const categoryIcon = categoryIconMap[service?.category];
    if (categoryIcon) {
      return categoryIcon.name;
    }

    const pathKey = (service?.path || "")
      .replace(/^\/services\//, "")
      .replace(/^\//, "")
      .toLowerCase();

    if (serviceIconMap[pathKey]) {
      return serviceIconMap[pathKey].name;
    }

    const titleKey = (service?.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (serviceIconMap[titleKey]) {
      return serviceIconMap[titleKey].name;
    }

    return Code.name;
  };

  const servicesWithPresentation = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        iconName: resolveServiceIcon(service),
        features: Array.isArray(service.features) ? service.features : [],
      })),
    [services],
  );

  const filteredServices =
    activeCategory === "all"
      ? servicesWithPresentation
      : servicesWithPresentation.filter(
          (service) => service.category === activeCategory,
        );

  const visibleServices = filteredServices.slice(0, visibleCount);
  const allLoaded = visibleCount >= filteredServices.length;

  const categoryButtons = useMemo(
    () => [
      {
        id: "all",
        label: "All Services",
        count: servicesWithPresentation.length,
      },
      ...categories.map((category) => ({
        id: category.name,
        label: category.displayName || formatCategoryLabel(category.name),
        count: servicesWithPresentation.filter(
          (service) => service.category === category.name,
        ).length,
      })),
    ],
    [categories, servicesWithPresentation],
  );

  const renderIcon = (iconName) => {
    const Icon = iconMap[iconName] || Code;
    return <Icon className="w-6 h-6 text-[var(--color-primary)]" />;
  };

  return (
    <section className="py-16 md:py-20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Our Services"
          subtitle="Comprehensive digital solutions tailored to elevate your business to new heights."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-[var(--color-border)] pb-4">
          {categoriesLoading && categories.length === 0 ? (
            <div className="text-sm text-[var(--color-body)]">Loading categories...</div>
          ) : null}
          {categoryButtons.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setVisibleCount(4);
              }}
              className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 border-b-2 -mb-[17px] ${
                activeCategory === category.id
                  ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                  : "text-[var(--color-body)] border-transparent hover:text-[var(--color-primary)]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-[var(--color-body)]">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading services...
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleServices.map((service, index) => (
            <motion.div
              key={service._id || service.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div
                onClick={() => router.push(service.path)}
                className="cursor-pointer relative flex h-full flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-36 w-full overflow-hidden bg-[var(--color-primary-tint)] flex items-center justify-center">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    renderIcon(service.iconName)
                  )}
                </div>
                <div className="p-5 flex flex-1 flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
                    {categories.find((cat) => cat.name === service.category)
                      ?.displayName || formatCategoryLabel(service.category)}
                  </span>
                  <h3 className="text-base font-bold text-[var(--color-heading)] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--color-body)] mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-[var(--color-border)]">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      Know More →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && filteredServices.length > 4 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(allLoaded ? 4 : visibleCount + 4)}
              className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-md text-sm transition-colors duration-200"
            >
              {allLoaded ? "Show Less" : "Load More"}
            </button>
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12 text-[var(--color-body)]">
            No services found.
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeOffer;
