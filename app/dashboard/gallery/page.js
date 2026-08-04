"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Power,
  Pencil,
  FolderPlus,
  Images,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const groupKeyOf = (item) =>
  item.batchId && item.batchId.trim() ? item.batchId : item._id;

export default function GalleryPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDisplay, setNewCategoryDisplay] = useState("");

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, [token]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const item of images) {
      const key = groupKeyOf(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return Array.from(map.entries()).map(([key, items]) => ({ key, items }));
  }, [images]);

  // Local, reorderable copy of the groups. Synced from `groups` whenever the
  // underlying images change (initial load, after a save, etc).
  const [orderedGroups, setOrderedGroups] = useState([]);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    setOrderedGroups(groups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const persistOrder = async (newOrderedGroups) => {
    setSavingOrder(true);
    try {
      const updates = [];
      newOrderedGroups.forEach((group, index) => {
        group.items.forEach((item) => {
          if (item.order !== index) {
            updates.push(
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${item._id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ order: index }),
                },
              ),
            );
          }
        });
      });
      await Promise.all(updates);
      fetchImages();
    } catch (err) {
      console.error("Error saving gallery order:", err);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedGroups.length) return;

    const next = [...orderedGroups];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setOrderedGroups(next);
    persistOrder(next);
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Error fetching gallery images:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-categories`,
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching gallery categories:", err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-categories`,
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
    } catch (err) {
      console.error("Error adding gallery category:", err);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-categories/${name}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) fetchCategories();
    } catch (err) {
      console.error("Error deleting gallery category:", err);
    }
  };

  const handleToggleGroup = async (group) => {
    const nextActive = !group.items[0].isActive;

    try {
      await Promise.all(
        group.items.map((item) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${item._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ isActive: nextActive }),
            },
          ),
        ),
      );
      fetchImages();
    } catch (err) {
      console.error("Error updating gallery images:", err);
    }
  };

  const handleDeleteGroup = async (group) => {
    const message =
      group.items.length > 1
        ? `Delete all ${group.items.length} images in this group?`
        : "Delete this gallery image?";
    if (!window.confirm(message)) return;

    try {
      await Promise.all(
        group.items.map((item) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${item._id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );
      fetchImages();
    } catch (err) {
      console.error("Error deleting gallery images:", err);
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Company Gallery
          </h1>
          <p className="text-slate-600">
            Upload and manage the images shown on the public gallery page.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <FolderPlus className="w-5 h-5" />
            Manage Categories
          </button>
          <Link
            href="/dashboard/gallery/new"
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Image
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
              Gallery Categories
            </h2>
            <p className="text-slate-600 text-sm">
              Manage the categories used to filter the public gallery. Add
              new ones or remove existing ones.
            </p>
          </div>

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
                  placeholder="e.g., construction"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Lowercase, no spaces (e.g., interior-works)
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Construction"
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
                      {isAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="ml-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              !loadingCategories && (
                <p className="text-slate-500 text-sm">No categories yet.</p>
              )
            )}
          </div>
        </motion.div>
      )}

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Current Images ({images.length} in {groups.length} group
              {groups.length === 1 ? "" : "s"})
            </h2>
            <p className="text-xs text-slate-400">
              {savingOrder
                ? "Saving order..."
                : "Use the arrows on a card to change its position on the public gallery."}
            </p>
          </div>

          {orderedGroups.length === 0 ? (
            <p className="text-slate-500 text-sm">No gallery images yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {orderedGroups.map((group, index) => {
                const cover = group.items[0];
                return (
                  <div
                    key={group.key}
                    className={`relative group border rounded-lg p-3 flex flex-col items-center gap-2 ${
                      cover.isActive
                        ? "border-slate-200"
                        : "border-slate-200 opacity-50"
                    }`}
                  >
                    <Link
                      href={`/dashboard/gallery/group/edit?batchId=${group.key}`}
                      className="w-full relative"
                    >
                      <img
                        src={cover.image}
                        alt={cover.title}
                        className="w-full h-24 object-cover rounded"
                      />
                      {group.items.length > 1 && (
                        <span className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <Images className="w-3 h-3" />
                          {group.items.length}
                        </span>
                      )}
                    </Link>
                    <p className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                      {cover.category || cover.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate w-full text-center">
                      {group.items.length > 1
                        ? `${group.items.length} images`
                        : cover.title}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={savingOrder || index === 0}
                        title="Move earlier"
                        className="p-2 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={savingOrder || index === orderedGroups.length - 1}
                        title="Move later"
                        className="p-2 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/gallery/group/edit?batchId=${group.key}`}
                        title="Open"
                        className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleGroup(group)}
                        title={cover.isActive ? "Hide from site" : "Show on site"}
                        className={`p-2 rounded ${
                          cover.isActive
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteGroup(group)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
