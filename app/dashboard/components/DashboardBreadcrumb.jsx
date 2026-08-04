"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import {
  NAV_SECTIONS,
  ADMIN_NAV_SECTION,
  ACCOUNT_NAV_SECTION,
  SEGMENT_LABEL_OVERRIDES,
} from "./navConfig";

const ALL_SECTIONS = [...NAV_SECTIONS, ADMIN_NAV_SECTION, ACCOUNT_NAV_SECTION];

const HREF_LABEL_MAP = ALL_SECTIONS.reduce((map, section) => {
  section.items.forEach((item) => {
    map[item.href] = item.label;
  });
  return map;
}, {});

const humanize = (segment) =>
  decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function DashboardBreadcrumb() {
  const pathname = usePathname();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null; // hide on the /dashboard root

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      HREF_LABEL_MAP[href] || SEGMENT_LABEL_OVERRIDES[segment] || humanize(segment);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-slate-400 transition-colors hover:text-cyan-600"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              {isLast ? (
                <span aria-current="page" className="font-semibold text-slate-800">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-400 transition-colors hover:text-cyan-600"
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
