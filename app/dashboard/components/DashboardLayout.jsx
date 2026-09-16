"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  NAV_SECTIONS,
  ADMIN_NAV_SECTION,
  ACCOUNT_NAV_SECTION,
} from "./navConfig";
import DashboardBreadcrumb from "./DashboardBreadcrumb";

const SIDEBAR_COLLAPSE_KEY = "a2it-sidebar-collapsed";

const DashboardNavLink = ({ item, pathname, onClick, collapsed }) => {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        isActive
          ? "bg-[#0b4f9e] text-white shadow-sm shadow-[#0b4f9e]/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}

      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
};

const DashboardNav = ({ collapsed, onToggleCollapse }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState(() => new Set());
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const sections = useMemo(
    () => [
      ...NAV_SECTIONS,
      ...(user?.role === "admin" ? [ADMIN_NAV_SECTION] : []),
      ACCOUNT_NAV_SECTION,
    ],
    [user?.role],
  );

  // Expand the section that contains the active route by default.
  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some(
        (item) =>
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`)),
      ),
    );
    if (activeSection) {
      setExpandedSections((prev) => new Set(prev).add(activeSection.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const query = navSearch.trim().toLowerCase();
  const isSearching = query.length > 0;

  const visibleSections = useMemo(() => {
    if (!isSearching) return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, isSearching, query]);

  const toggleSection = (id) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 bg-slate-900 text-white rounded-lg shadow-lg"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div
          className={`flex h-16 items-center border-b border-slate-200 px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 overflow-hidden ${collapsed ? "justify-center" : ""}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b4f9e] text-sm font-extrabold text-white">
              A2
            </span>
            {!collapsed && (
              <span className="truncate text-lg font-bold text-slate-900">
                Rakibhasan
              </span>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex mx-auto mt-3 items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}

        {/* Nav search */}
        {!collapsed && (
          <div className="border-b border-slate-100 px-3 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#0b4f9e]/40 focus:bg-white focus:ring-2 focus:ring-[#0b4f9e]/10"
              />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleSections.map((section) => {
            const isExpanded =
              collapsed ||
              isSearching ||
              !section.label ||
              expandedSections.has(section.id);
            return (
              <div key={section.id} className="space-y-1">
                {section.label && !collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
                {section.label && collapsed && (
                  <div className="mx-3 border-t border-slate-100" />
                )}
                {isExpanded && (
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <DashboardNavLink
                        key={item.id}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {isSearching && visibleSections.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-400">
              No menu items match &ldquo;{navSearch}&rdquo;
            </p>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-slate-200 p-3">
          <div
            className={`mb-2 flex items-center gap-3 rounded-lg px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? user?.name : undefined}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {initials}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="truncate text-xs capitalize text-[#0b4f9e]">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 ${
              collapsed ? "justify-center" : "justify-center"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardNav collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-8">
          <DashboardBreadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
