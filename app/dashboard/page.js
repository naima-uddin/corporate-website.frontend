"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  ShoppingCart,
  Image as ImageIcon,
  PlusCircle,
  Briefcase,
  Newspaper,
  Camera,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [counts, setCounts] = useState({
    blogs: null,
    services: null,
    portfolio: null,
    users: null,
  });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const authHeader = { Authorization: `Bearer ${token}` };

    const fetchJson = async (url) => {
      try {
        const res = await fetch(url, { headers: authHeader });
        return await res.json();
      } catch {
        return null;
      }
    };

    (async () => {
      const [blogData, servicesData, portfolioData, usersData] =
        await Promise.all([
          fetchJson(`${API}/api/blog/admin/blogs?page=1&limit=1`),
          fetchJson(`${API}/api/services/admin/all`),
          fetchJson(`${API}/api/portfolio/admin/all`),
          user?.role === "admin" ? fetchJson(`${API}/api/users`) : null,
        ]);

      const blogs = blogData?.pagination?.total ?? null;
      const services = servicesData?.services?.length ?? null;
      const portfolio = portfolioData?.portfolios?.length ?? null;
      const users = usersData?.users?.length ?? null;

      if (!cancelled) {
        setCounts({ blogs, services, portfolio, users });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, API, user?.role]);

  const formatCount = (value) => (value === null ? "—" : String(value));

  const stats = [
    {
      label: "Total Blogs",
      value: formatCount(counts.blogs),
      icon: FileText,
      href: "/dashboard/blog",
    },
    {
      label: "Total Services",
      value: formatCount(counts.services),
      icon: ShoppingCart,
      href: "/dashboard/services",
    },
    {
      label: "Portfolio Items",
      value: formatCount(counts.portfolio),
      icon: Briefcase,
      href: "/dashboard/portfolio",
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Total Users",
            value: formatCount(counts.users),
            icon: Users,
            href: "/dashboard/users",
          },
        ]
      : []),
  ];

  const quickActions = [
    {
      label: "Create Blog",
      description: "Publish a new blog post",
      icon: FileText,
      href: "/dashboard/blog?action=create",
    },
    {
      label: "Create Service",
      description: "Add a new service offering",
      icon: ShoppingCart,
      href: "/dashboard/services?action=create",
    },
    {
      label: "Create Project",
      description: "Add a portfolio project",
      icon: ImageIcon,
      href: "/dashboard/portfolio?action=create",
    },
    {
      label: "Add News",
      description: "Publish a news update",
      icon: Newspaper,
      href: "/dashboard/news?action=create",
    },
    {
      label: "Upload Media",
      description: "Manage gallery & media",
      icon: Camera,
      href: "/dashboard/gallery?action=create",
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Add User",
            description: "Invite a new team member",
            icon: Users,
            href: "/dashboard/users?action=create",
          },
        ]
      : []),
  ];

  const gettingStarted = [
    {
      title: "Manage your content",
      description:
        "Use the sidebar to navigate to Blogs, Services, Portfolio and more.",
    },
    {
      title: "Create and edit content",
      description:
        "Use Quick Actions above or the dedicated sections to manage entries.",
    },
    {
      title: "Admin access",
      description: "User management is available only for admin accounts.",
    },
    {
      title: "Account settings",
      description: "Update your profile and change your password in Settings.",
    },
  ];

  const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-sm font-medium text-[#0b4f9e]">
            {timeGreeting()}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s an overview of your site content.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef4fc] px-3 py-1.5 text-xs font-semibold capitalize text-[#0b4f9e]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0b4f9e]" />
          {user?.role} account
        </span>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={item}>
              <Link
                href={stat.href}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0b4f9e]/30 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef4fc] text-[#0b4f9e] transition group-hover:bg-[#0b4f9e] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          variants={item}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>
            <PlusCircle className="h-5 w-5 text-slate-300" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 transition hover:border-[#0b4f9e]/40 hover:bg-[#eef4fc]/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition group-hover:bg-[#0b4f9e] group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {action.label}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          variants={item}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Getting Started
          </h2>
          <div className="space-y-5">
            {gettingStarted.map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b4f9e]" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {step.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
