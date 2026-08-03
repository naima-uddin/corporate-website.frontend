"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function PortfolioForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
}) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [detailedMode, setDetailedMode] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

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
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/portfolio")}
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-8 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{heading}</h2>
            <p className="text-slate-600 text-sm mt-1">
              Fill in the project details below
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDetailedMode(!detailedMode)}
            className="text-sm px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
          >
            {detailedMode ? "→ Simple" : "→ Detailed"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., E-Commerce Platform"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., ABC Corporation"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Brief description of the project..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows="3"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
          </div>

          {/* Category & Technologies Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Categories & Technologies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categories
                </label>

                <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-12 flex flex-wrap gap-2 items-center">
                  {form.category.length > 0 ? (
                    form.category.map((cat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] rounded-full text-sm font-semibold"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => {
                            setForm({
                              ...form,
                              category: form.category.filter((c) => c !== cat),
                            });
                          }}
                          className="ml-1 hover:opacity-70 transition"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">
                      Select categories...
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">
                    Available Categories
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
                    {loadingCategories ? (
                      <p className="text-xs text-slate-500 col-span-2">
                        Loading categories...
                      </p>
                    ) : (
                      categories.map((cat) => {
                        const isSelected = form.category.includes(
                          cat.displayName,
                        );
                        return (
                          <motion.button
                            key={cat._id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (isSelected) {
                                setForm({
                                  ...form,
                                  category: form.category.filter(
                                    (c) => c !== cat.displayName,
                                  ),
                                });
                              } else {
                                setForm({
                                  ...form,
                                  category: [...form.category, cat.displayName],
                                });
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition text-left ${
                              isSelected
                                ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12]"
                                : "bg-white border border-slate-300 text-slate-700 hover:border-cyan-500"
                            }`}
                          >
                            {cat.displayName}
                          </motion.button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Technologies
                </label>
                <textarea
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  value={form.technologies}
                  onChange={(e) =>
                    setForm({ ...form, technologies: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Media & Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ImageUploadFactory
                  type="portfolio"
                  label="Project Image"
                  currentImage={form.image}
                  onImageUploaded={(url) =>
                    setForm({ ...form, image: url || "" })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Link / Live URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Detailed Fields - Conditional */}
          {detailedMode && (
            <>
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 3 months"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Team Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 4 developers"
                      value={form.teamSize}
                      onChange={(e) =>
                        setForm({ ...form, teamSize: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Lead Developer"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Project Narrative
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Challenge
                    </label>
                    <textarea
                      placeholder="What was the main challenge?"
                      value={form.challenge}
                      onChange={(e) =>
                        setForm({ ...form, challenge: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Solution
                    </label>
                    <textarea
                      placeholder="How did you solve it?"
                      value={form.solution}
                      onChange={(e) =>
                        setForm({ ...form, solution: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Result
                    </label>
                    <textarea
                      placeholder="What was the outcome?"
                      value={form.result}
                      onChange={(e) =>
                        setForm({ ...form, result: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Features & Metrics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Features
                    </label>
                    <textarea
                      placeholder="One feature per line&#10;e.g. Real-time notifications&#10;Advanced analytics"
                      value={form.features}
                      onChange={(e) =>
                        setForm({ ...form, features: e.target.value })
                      }
                      rows="5"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Metrics
                    </label>
                    <textarea
                      placeholder="Format: value|label&#10;e.g. 10K+|Users&#10;99.9%|Uptime"
                      value={form.metrics}
                      onChange={(e) =>
                        setForm({ ...form, metrics: e.target.value })
                      }
                      rows="5"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-4 bg-white rounded-lg p-6 border border-slate-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push("/dashboard/portfolio")}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : submitLabel}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
