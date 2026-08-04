"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, X } from "lucide-react";

const ICON_OPTIONS = [
  { value: "construction", label: "Construction" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "supply", label: "Supply" },
];

const EMPTY_FORM = {
  name: "",
  displayName: "",
  description: "",
  link: "",
  icon: "construction",
};

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function NavbarMenuPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories`,
      );
      const data = await res.json();
      if (res.ok) {
        setCategories(
          (data.categories || []).slice().sort((a, b) => a.order - b.order),
        );
      }
    } catch (error) {
      console.error("Error fetching navbar categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setEditingName(category.name);
    setForm({
      name: category.name,
      displayName: category.displayName || "",
      description: category.description || "",
      link: category.link || "",
      icon: category.icon || "design-development",
    });
  };

  const startCreate = () => {
    setEditingName("__new__");
    setForm(EMPTY_FORM);
  };

  const cancelEdit = () => {
    setEditingName(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    const displayName = form.displayName.trim();
    if (!displayName) return;

    const isNew = editingName === "__new__";
    const name = isNew ? slugify(displayName) : form.name;

    try {
      setSaving(true);
      const url = isNew
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories/${encodeURIComponent(name)}`;

      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          displayName,
          description: form.description,
          link: form.link,
          icon: form.icon,
        }),
      });

      if (res.ok) {
        await fetchCategories();
        cancelEdit();
      }
    } catch (error) {
      console.error("Error saving navbar category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this navbar menu item?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.name !== name));
      }
    } catch (error) {
      console.error("Error deleting navbar category:", error);
    }
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = categories.slice();
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    setCategories(reordered);

    try {
      await Promise.all(
        reordered.map((category, idx) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories/${encodeURIComponent(category.name)}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ order: idx }),
            },
          ),
        ),
      );
    } catch (error) {
      console.error("Error reordering navbar categories:", error);
    }
  };

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
            Navbar Menu
          </h1>
          <p className="text-slate-600">
            Manage the "Our Services" dropdown shown in the site header.
            This is independent from the homepage "What We Do" section.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Menu Item
        </button>
      </motion.div>

      {editingName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingName === "__new__" ? "New Menu Item" : "Edit Menu Item"}
            </h2>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Label
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                placeholder="e.g. Shopify Development"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Icon
              </label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Link
              </label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/services/category/shopify"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Short Description (shown in dropdown)
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="2"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold shadow-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Menu Item"}
          </button>
        </motion.div>
      )}

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
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((category, index) => (
                  <tr key={category.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleReorder(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(index, 1)}
                          disabled={index === categories.length - 1}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {category.displayName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {category.link}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        title="Edit"
                        className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(category.name)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No navbar menu items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
