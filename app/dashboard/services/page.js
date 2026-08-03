"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function ServicesPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryEditName, setCategoryEditName] = useState("");
  const [categoryEditData, setCategoryEditData] = useState({
    bannerImage: "",
    description: "",
  });
  const [savingCategoryDetails, setSavingCategoryDetails] = useState(false);

  const formatCategoryLabel = (value) =>
    String(value || "")
      .trim()
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [token]);

  const handleAddCategory = () => {
    saveCategory();
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveCategory = async () => {
    const val = (newCategory || "").trim();
    if (!val) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: val,
            displayName: formatCategoryLabel(val),
          }),
        },
      );

      if (response.ok) {
        await fetchCategories();
        setNewCategory("");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleSelectCategoryToEdit = (categoryName) => {
    setCategoryEditName(categoryName);
    const category = categories.find((c) => c.name === categoryName);
    setCategoryEditData({
      bannerImage: category?.bannerImage || "",
      description: category?.description || "",
    });
  };

  const handleSaveCategoryDetails = async () => {
    if (!categoryEditName) return;

    try {
      setSavingCategoryDetails(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${encodeURIComponent(categoryEditName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryEditData),
        },
      );

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error saving category details:", error);
    } finally {
      setSavingCategoryDetails(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${encodeURIComponent(categoryName)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c.name !== categoryName));
        if (categoryEditName === categoryName) {
          setCategoryEditName("");
          setCategoryEditData({ bannerImage: "", description: "" });
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

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
        setServices(data.services);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
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
            Manage Services
          </h1>
          <p className="text-slate-600">
            Create and manage your service offerings{" "}
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Service
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Add / Remove Categories
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold shadow-sm"
            >
              Save
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.name}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <span>{category.displayName}</span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.name)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                    aria-label={`Delete ${category.displayName}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Page Banner & Description
          </label>
          <select
            value={categoryEditName}
            onChange={(e) => handleSelectCategoryToEdit(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition mb-4"
          >
            <option value="">Select a category to edit...</option>
            {categories.map((c) => (
              <option value={c.name} key={c.name}>
                {c.displayName}
              </option>
            ))}
          </select>

          {categoryEditName && (
            <div className="space-y-4">
              <ImageUploadFactory
                type="services"
                label="Banner Image"
                currentImage={categoryEditData.bannerImage}
                onImageUploaded={(url) =>
                  setCategoryEditData({
                    ...categoryEditData,
                    bannerImage: url || "",
                  })
                }
              />
              <textarea
                placeholder="Category description shown on its banner"
                value={categoryEditData.description}
                onChange={(e) =>
                  setCategoryEditData({
                    ...categoryEditData,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
              <button
                type="button"
                onClick={handleSaveCategoryDetails}
                disabled={savingCategoryDetails}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold shadow-sm disabled:opacity-60"
              >
                {savingCategoryDetails ? "Saving..." : "Save Category Details"}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
      </div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {service.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {formatCategoryLabel(service.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {service.features.length} items
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/dashboard/services/${service._id}`}
                        title="Edit"
                        className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
