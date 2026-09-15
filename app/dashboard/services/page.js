"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search, Tags, ExternalLink } from "lucide-react";

const formatCategoryLabel = (value) =>
  String(value || "")
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ServicesPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/admin/all`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;
      const opts = isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await fetch(url, opts);

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const filteredServices = services.filter((s) =>
    (s.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAdmin && !isModerator) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="mb-1 text-4xl font-bold text-slate-900">
            Manage Services
          </h1>
          <p className="text-slate-600">
            Add a service, then open it to design its page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/services/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:border-slate-300"
          >
            <Tags className="h-5 w-5" />
            Categories
          </Link>
          <Link
            href="/dashboard/services/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-6 py-3 font-semibold text-[#0a0a12]"
          >
            <Plus className="h-5 w-5" />
            New Service
          </Link>
        </div>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-500">
            {searchQuery
              ? "No services match your search."
              : "No services yet. Create your first one."}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/services/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-5 py-2.5 font-semibold text-[#0a0a12]"
            >
              <Plus className="h-4 w-4" />
              New Service
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                    Features
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />
                        )}
                        <div>
                          <div className="font-medium text-slate-900">
                            {service.title}
                          </div>
                          {service.path && (
                            <div className="text-xs text-slate-400">
                              {service.path}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                        {formatCategoryLabel(service.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {service.features?.length || 0} items
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {service.path && (
                          <a
                            href={service.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View live page"
                            className="rounded p-2 text-slate-500 hover:bg-slate-100"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/dashboard/services/edit?id=${service._id}`}
                          title="Design page"
                          className="rounded bg-[#00f0ff]/10 p-2 text-[#0066ff] hover:bg-[#00f0ff]/20"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(service._id)}
                            title="Delete"
                            className="rounded bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
