"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Settings2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { ActionButton, IconButton } from "../components/ui/Buttons";

export default function PortfolioPage() {
  const { token, isAdmin, canAccess } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDisplay, setNewCategoryDisplay] = useState("");

  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
  }, [token]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/admin/all`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`;
      const opts = isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await fetch(url, opts);

      if (response.ok) {
        const data = await response.json();
        setPortfolios(data.portfolios);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories`,
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryDisplay) {
      alert("Please provide both category name and display name");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCategoryName,
            displayName: newCategoryDisplay,
          }),
        },
      );

      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryDisplay("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio item?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  const filteredPortfolios = portfolios.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!canAccess("portfolio")) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Contracts / Projects"
        description="Government contracts and projects shown on the public Projects page (table + featured cards)."
        actions={
          <>
            <ActionButton
              variant="secondary"
              onClick={() => setShowCategoryManager((prev) => !prev)}
            >
              <Settings2 className="h-4 w-4" />
              Manage Categories
            </ActionButton>
            <ActionButton href="/dashboard/portfolio/new">
              <Plus className="h-4 w-4" />
              Add Project
            </ActionButton>
          </>
        }
      />

      {showCategoryManager && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Portfolio Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your portfolio project categories. Add new ones or remove
              existing ones.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50/60 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b4f9e] text-xs font-bold text-white">
                +
              </span>
              Add New Category
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., react-projects"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0b4f9e]/40 focus:ring-2 focus:ring-[#0b4f9e]/10"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Lowercase, no spaces (e.g., saas-projects)
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., React Projects"
                  value={newCategoryDisplay}
                  onChange={(e) => setNewCategoryDisplay(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0b4f9e]/40 focus:ring-2 focus:ring-[#0b4f9e]/10"
                />
                <p className="mt-1 text-xs text-slate-400">
                  How it appears to users
                </p>
              </div>
              <div className="flex items-end">
                <ActionButton onClick={handleAddCategory} className="w-full justify-center">
                  Create Category
                </ActionButton>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                {categories.length}
              </span>
              Existing Categories
            </h3>
            {!loadingCategories && categories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0b4f9e]/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs text-slate-400">
                          {cat.name}
                        </p>
                        <h4 className="text-base font-bold text-slate-900">
                          {cat.displayName}
                        </h4>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="ml-2 shrink-0 rounded-lg bg-red-50 p-1.5 text-red-500 opacity-0 transition hover:bg-red-100 group-hover:opacity-100"
                          title="Delete category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Badge tone="blue">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loadingCategories ? (
              <EmptyState
                title="No categories found"
                description="Create your first category above."
              />
            ) : (
              <div className="py-10 text-center text-sm text-slate-500">
                Loading categories...
              </div>
            )}
          </div>
        </motion.div>
      )}

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search projects..."
      />

      {!loading && filteredPortfolios.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? "No projects match your search."
              : "No projects yet."
          }
          description={!searchQuery ? "Add your first project to get started." : undefined}
          action={
            !searchQuery && (
              <ActionButton href="/dashboard/portfolio/new" size="sm">
                <Plus className="h-4 w-4" />
                Add Project
              </ActionButton>
            )
          }
        />
      ) : !loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredPortfolios.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0b4f9e]/30 hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-1.5 font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                  {item.description}
                </p>
                <div className="flex justify-end gap-2">
                  <IconButton
                    href={`/dashboard/portfolio/edit?id=${item._id}`}
                    tone="blue"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      onClick={() => handleDelete(item._id)}
                      tone="red"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      )}
    </div>
  );
}
