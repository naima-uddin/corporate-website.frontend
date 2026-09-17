"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Tags, ExternalLink } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { ActionButton, IconButton } from "../components/ui/Buttons";

const formatCategoryLabel = (value) =>
  String(value || "")
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ServicesPage() {
  const { token, isAdmin, canAccess } = useAuth();
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

  if (!canAccess("services")) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Services"
        description="Add a service, then open it to design its page."
        actions={
          <>
            <ActionButton href="/dashboard/services/categories" variant="secondary">
              <Tags className="h-4 w-4" />
              Categories
            </ActionButton>
            <ActionButton href="/dashboard/services/new">
              <Plus className="h-4 w-4" />
              New Service
            </ActionButton>
          </>
        }
      />

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search services..."
      />

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? "No services match your search."
              : "No services yet."
          }
          description={!searchQuery ? "Create your first one to get started." : undefined}
          action={
            !searchQuery && (
              <ActionButton href="/dashboard/services/new" size="sm">
                <Plus className="h-4 w-4" />
                New Service
              </ActionButton>
            )
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Features
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="transition hover:bg-slate-50">
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
                      <Badge>{formatCategoryLabel(service.category)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {service.features?.length || 0} items
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {service.path && (
                          <IconButton
                            href={service.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View live page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </IconButton>
                        )}
                        <IconButton
                          href={`/dashboard/services/edit?id=${service._id}`}
                          title="Design page"
                          tone="blue"
                        >
                          <Edit2 className="h-4 w-4" />
                        </IconButton>
                        {isAdmin && (
                          <IconButton
                            onClick={() => handleDelete(service._id)}
                            title="Delete"
                            tone="red"
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
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
