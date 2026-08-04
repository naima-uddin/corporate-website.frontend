"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

const LABEL_MAP = {
  about: "About Us",
  "board-of-directors": "Board of Directors",
  contact: "Contact",
  gallery: "Gallery",
  "government-enlistment": "Government Enlistment",
  login: "Login",
  news: "News",
  "privacy-policy": "Privacy Policy",
  projects: "Projects",
  services: "Services",
  category: "Category",
  "terms-of-service": "Terms of Service",
  "thank-you": "Thank You",
};

const humanize = (segment) =>
  decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const HIDDEN_ROUTES = ["/", "/login"];

export default function Breadcrumb({ items, className = "" }) {
  const pathname = usePathname();

  if (!pathname || HIDDEN_ROUTES.includes(pathname)) return null;

  const crumbs =
    items ||
    pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index, segments) => ({
        label: LABEL_MAP[segment] || humanize(segment),
        href: `/${segments.slice(0, index + 1).join("/")}`,
      }));

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`border-b border-[var(--color-border)] bg-[var(--color-primary-tint)]/40 ${className}`}
    >
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-[var(--color-heading)]/60 transition-colors hover:text-[var(--color-primary)]"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href || crumb.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-heading)]/30" />
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-medium text-[var(--color-heading)]"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[var(--color-heading)]/60 transition-colors hover:text-[var(--color-primary)]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
