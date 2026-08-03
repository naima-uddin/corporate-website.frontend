"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search } from "lucide-react";

export default function PortfolioPage() {
  const { token, isAdmin, isModerator } = useAuth();
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

  if (!isAdmin && !isModerator) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manage Contracts / Projects
          </h1>
          <p className="text-slate-600">
            Government contracts and projects shown on the public Projects
            page (table + featured cards)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            Manage Categories
          </button>
          <Link
            href="/dashboard/portfolio/new"
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </Link>
        </div>
      </motion.div>

      {showCategoryManager && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-8 shadow-lg"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Portfolio Categories
            </h2>
            <p className="text-slate-600 text-sm">
              Manage your portfolio project categories. Add new ones or remove
              existing ones.
            </p>
          </div>

          {/* Add New Category Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-full flex items-center justify-center text-white text-sm font-bold">
                +
              </div>
              Add New Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., react-projects"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Lowercase, no spaces (e.g., saas-projects)
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., React Projects"
                  value={newCategoryDisplay}
                  onChange={(e) => setNewCategoryDisplay(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
                <p className="text-xs text-slate-500 mt-1">
                  How it appears to users
                </p>
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold rounded-lg hover:shadow-lg transition"
                >
                  Create Category
                </motion.button>
              </div>
            </div>
          </div>

          {/* Categories List Section */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-sm font-bold">
                {categories.length}
              </div>
              Existing Categories
            </h3>
            {!loadingCategories && categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, index) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-slate-300 transition group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-xs font-mono text-slate-500 mb-1">
                          {cat.name}
                        </p>
                        <h4 className="text-lg font-bold text-slate-900">
                          {cat.displayName}
                        </h4>
                      </div>
                      {isAdmin ? (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="ml-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <div
                          className="ml-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="Delete disabled"
                        >
                          <span className="text-xs text-slate-400">🔒</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex gap-2">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#00f0ff]/20 to-[#0066ff]/20 text-slate-700 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : !loadingCategories ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500 mb-2">No categories found</p>
                <p className="text-slate-400 text-sm">
                  Create your first category above
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <p className="text-slate-500 mt-4">Loading categories...</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
      </div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 md:grid-cols-5 gap-6"
        >
          {filteredPortfolios.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-cyan-300 transition shadow-sm"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/dashboard/portfolio/${item._id}`}
                    className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
