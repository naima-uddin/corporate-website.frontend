"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Users,
  ShoppingCart,
  Image as ImageIcon,
  Images,
  Briefcase,
  Building2,
  Camera,
  PanelBottom,
  Newspaper,
  LayoutDashboard,
  ChevronsLeft,
  ChevronsRight,
  Palette,
  Quote,
  Users2,
  Info,
  Landmark,
  FolderKanban,
  Phone,
} from "lucide-react";
import Link from "next/link";

const SIDEBAR_COLLAPSE_KEY = "a2it-sidebar-collapsed";

const NAV_SECTIONS = [
  {
    id: "overview",
    label: null,
    items: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { id: "site-branding", label: "Site Branding", icon: Palette, href: "/dashboard/site-branding" },
      { id: "banner", label: "Manage Banner", icon: ImageIcon, href: "/dashboard/banner" },
      { id: "spotlight", label: "Leadership Spotlight", icon: Quote, href: "/dashboard/spotlight" },
      { id: "join-us", label: "Join Us Section", icon: Users2, href: "/dashboard/join-us" },
      { id: "about", label: "About Page", icon: Info, href: "/dashboard/about" },
      { id: "government-enlistment", label: "Government Enlistment", icon: Landmark, href: "/dashboard/government-enlistment" },
      { id: "projects-page", label: "Projects Page Settings", icon: FolderKanban, href: "/dashboard/projects-page" },
      { id: "services", label: "Manage Services", icon: ShoppingCart, href: "/dashboard/services" },
      { id: "portfolio", label: "Manage Contracts/Projects", icon: Briefcase, href: "/dashboard/portfolio" },
      { id: "gallery", label: "Manage Gallery", icon: Camera, href: "/dashboard/gallery" },
      { id: "blog", label: "Manage Blog", icon: FileText, href: "/dashboard/blog" },
      { id: "news", label: "Manage News", icon: Newspaper, href: "/dashboard/news" },
      { id: "media", label: "All Media", icon: Images, href: "/dashboard/media" },
      { id: "client-showcase", label: "Client Showcase", icon: Building2, href: "/dashboard/client-showcase" },
      { id: "footer", label: "Manage Footer", icon: PanelBottom, href: "/dashboard/footer" },
      { id: "contact-page", label: "Contact Page", icon: Phone, href: "/dashboard/contact-page" },
    ],
  },
];

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
          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20"
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
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const sections = [
    ...NAV_SECTIONS,
    ...(user?.role === "admin"
      ? [
          {
            id: "admin",
            label: "Administration",
            items: [
              { id: "users", label: "Manage Users", icon: Users, href: "/dashboard/users" },
            ],
          },
        ]
      : []),
    {
      id: "account",
      label: "Account",
      items: [
        { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
      ],
    },
  ];

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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-extrabold text-white">
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

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              {section.label && !collapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.label}
                </p>
              )}
              {section.label && collapsed && (
                <div className="mx-3 border-t border-slate-100" />
              )}
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
          ))}
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
                <p className="truncate text-xs capitalize text-cyan-600">
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
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
