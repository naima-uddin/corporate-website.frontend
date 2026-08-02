"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, X, Star } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  isFeatured: false,
  status: "draft",
  publishDate: "",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function NewsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  useEffect(() => {
    fetchNews();
  }, [token]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      featuredImage: item.featuredImage || "",
      category: item.category || "",
      isFeatured: Boolean(item.isFeatured),
      status: item.status || "draft",
      publishDate: toDateInputValue(item.publishDate),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Please provide a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/news/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/news`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          publishDate: form.publishDate || undefined,
        }),
      });

      if (response.ok) {
        resetForm();
        fetchNews();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save news item");
      }
    } catch (err) {
      console.error("Error saving news item:", err);
      setError("Failed to save news item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        if (editingId === id) resetForm();
        fetchNews();
      }
    } catch (err) {
      console.error("Error deleting news item:", err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Manage News
        </h1>
        <p className="text-slate-600">
          Create and manage News &amp; Media items shown on the homepage and
          at /news. Separate from Blog.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editingId ? "Edit News Item" : "Add News Item"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" /> Cancel edit
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
          <ImageUploadFactory
            type="news"
            label="Featured Image"
            onImageUploaded={(url) =>
              setForm((prev) => ({ ...prev, featuredImage: url }))
            }
            currentImage={form.featuredImage}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleFieldChange("title")}
                placeholder="e.g. Rakibhasan wins Best IT Partner 2026"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={handleFieldChange("excerpt")}
                rows={2}
                placeholder="Short summary shown on cards"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={handleFieldChange("content")}
                rows={8}
                placeholder="Full article body. Basic HTML tags like <p>, <h2>, <strong>, <a> are supported."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={handleFieldChange("category")}
                placeholder="e.g. Company News"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                value={form.publishDate}
                onChange={handleFieldChange("publishDate")}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={handleFieldChange("status")}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={handleFieldChange("isFeatured")}
                className="w-4 h-4"
              />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">
                Featured (shows as the large item on homepage)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {saving ? "Saving..." : editingId ? "Update News Item" : "Add News Item"}
          </button>
        </div>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Current News Items ({news.length})
          </h2>

          {news.length === 0 ? (
            <p className="text-slate-500 text-sm">No news items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <div
                  key={item._id}
                  className="relative border border-slate-200 rounded-lg overflow-hidden flex flex-col"
                >
                  {item.featuredImage && (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : item.status === "archived"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.isFeatured && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {item.category || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 p-3 pt-0">
                    <button
                      onClick={() => handleEditClick(item)}
                      title="Edit"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
