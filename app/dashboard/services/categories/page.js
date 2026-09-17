"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import ImageUploadFactory from "../../components/forms/ImageUploadFactory";

const formatCategoryLabel = (value) =>
  String(value || "")
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ServiceCategoriesPage() {
  const { token, isAdmin, canAccess } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedName, setSelectedName] = useState("");
  const [details, setDetails] = useState({ bannerImage: "", description: "" });
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const val = newCategory.trim();
    if (!val) return;

    try {
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (name) => {
    setSelectedName(name);
    const category = categories.find((c) => c.name === name);
    setDetails({
      bannerImage: category?.bannerImage || "",
      description: category?.description || "",
    });
  };

  const handleSaveDetails = async () => {
    if (!selectedName) return;
    try {
      setSavingDetails(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${encodeURIComponent(selectedName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(details),
        },
      );
      if (response.ok) await fetchCategories();
    } catch (error) {
      console.error("Error saving category details:", error);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        setCategories((prev) => prev.filter((c) => c.name !== name));
        if (selectedName === name) {
          setSelectedName("");
          setDetails({ bannerImage: "", description: "" });
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (!canAccess("services")) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/services")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </button>
        <h1 className="text-4xl font-bold text-slate-900">Service Categories</h1>
        <p className="mt-1 text-slate-600">
          Categories group services and each has its own landing page.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Add / list */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Add a category
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-4 py-3 font-semibold text-[#0a0a12] shadow-sm disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-slate-400">No categories yet.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {category.displayName}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(category.name)}
                      className="text-xs font-semibold text-[#0066ff] hover:underline"
                    >
                      Edit page
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(category.name)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        aria-label={`Delete ${category.displayName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Banner + description */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category page banner & description
          </label>
          <select
            value={selectedName}
            onChange={(e) => handleSelect(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
          >
            <option value="">Select a category to edit...</option>
            {categories.map((c) => (
              <option value={c.name} key={c.name}>
                {c.displayName}
              </option>
            ))}
          </select>

          {selectedName ? (
            <div className="space-y-4">
              <ImageUploadFactory
                type="services"
                label="Banner image"
                currentImage={details.bannerImage}
                onImageUploaded={(url) =>
                  setDetails((prev) => ({ ...prev, bannerImage: url || "" }))
                }
              />
              <textarea
                placeholder="Category description shown on its banner"
                value={details.description}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows="3"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
              <button
                type="button"
                onClick={handleSaveDetails}
                disabled={savingDetails}
                className="rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-4 py-3 font-semibold text-[#0a0a12] shadow-sm disabled:opacity-60"
              >
                {savingDetails ? "Saving..." : "Save category details"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Select a category to edit its banner and description.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
