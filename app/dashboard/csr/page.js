"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyData = {
  label: "Giving Back",
  heading: "Corporate Social Responsibility",
  description: "",
  items: [],
};

const emptyItem = {
  title: "",
  description: "",
  image: "",
  imagePublicId: "",
  date: "",
};

const SectionCard = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
  >
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
    </div>
    {children}
  </motion.div>
);

export default function CSRAdmin() {
  const { token, isAdmin, isModerator } = useAuth();
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/csr/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.csr) {
          setData({
            ...emptyData,
            ...result.csr,
            items: Array.isArray(result.csr.items)
              ? result.csr.items.map((item) => ({ ...emptyItem, ...item }))
              : [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching CSR page:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/csr`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        const result = await response.json();
        setData((prev) => ({ ...prev, ...result.csr }));
        setMessage("CSR page saved successfully.");
      } else {
        setError("Failed to save CSR page.");
      }
    } catch (err) {
      console.error("Error saving CSR page:", err);
      setError("Failed to save CSR page.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading CSR page...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Corporate Social Responsibility
        </h1>
        <p className="text-slate-600">
          Manage the CSR initiatives shown on the public CSR page.
        </p>
      </motion.div>

      {message && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-cyan-700 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SectionCard
        title="Section Header"
        description="Shown at the top of the CSR page."
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => updateField("label", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="CSR Initiatives"
        description="Each card shows an image, title, date and description of the initiative."
      >
        <div className="space-y-6">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Initiative {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  placeholder="e.g. Tree Plantation Drive 2026"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date (optional)
                </label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => updateItem(index, "date", e.target.value)}
                  placeholder="e.g. January 2026"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <ImageUploadFactory
                type="csr"
                label="Image"
                onImageUploaded={(url) => updateItem(index, "image", url || "")}
                currentImage={item.image}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Add Initiative
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save CSR Page"}
        </button>
      </div>
    </div>
  );
}
