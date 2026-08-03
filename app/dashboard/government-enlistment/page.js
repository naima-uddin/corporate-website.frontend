"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";
import CertificateUploadFactory from "../components/forms/CertificateUploadFactory";

const emptyData = {
  label: "Our Credentials",
  heading: "Government Enlistment",
  description: "",
  items: [],
};

const emptyItem = {
  name: "",
  logo: "",
  logoPublicId: "",
  certificateFiles: [],
  enlisted: true,
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

export default function GovernmentEnlistmentAdmin() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/government-enlistment/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.governmentEnlistment) {
          setData({
            ...emptyData,
            ...result.governmentEnlistment,
            items: Array.isArray(result.governmentEnlistment.items)
              ? result.governmentEnlistment.items.map((item) => ({
                  ...emptyItem,
                  ...item,
                  certificateFiles: Array.isArray(item.certificateFiles)
                    ? item.certificateFiles
                    : [],
                }))
              : [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching government enlistment page:", err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/government-enlistment`,
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
        setData((prev) => ({ ...prev, ...result.governmentEnlistment }));
        setMessage("Government enlistment page saved successfully.");
      } else {
        setError("Failed to save government enlistment page.");
      }
    } catch (err) {
      console.error("Error saving government enlistment page:", err);
      setError("Failed to save government enlistment page.");
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
    return (
      <p className="text-slate-500 text-sm">
        Loading government enlistment page...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Government Enlistment
        </h1>
        <p className="text-slate-600">
          Manage the department credentials shown on the Government
          Enlistment page, along with each certificate file.
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
        description="Shown at the top of the Government Enlistment page."
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
        title="Department Credentials"
        description="Each card shows a logo, enlistment status and a link to that department's certificate."
      >
        <div className="space-y-6">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Department {index + 1}
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
                  Department Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  placeholder="e.g. Education Engineering Department (EED)"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={item.enlisted !== false}
                  onChange={(e) =>
                    updateItem(index, "enlisted", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Enlisted
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <ImageUploadFactory
                  type="government-enlistment"
                  label="Logo (optional)"
                  onImageUploaded={(url) =>
                    updateItem(index, "logo", url || "")
                  }
                  currentImage={item.logo}
                />

                <CertificateUploadFactory
                  type="government-enlistment-certificate"
                  label="Certificates (image or PDF, multiple allowed)"
                  files={item.certificateFiles || []}
                  onFilesChanged={(files) =>
                    updateItem(index, "certificateFiles", files)
                  }
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Add Department
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
          {saving ? "Saving..." : "Save Government Enlistment"}
        </button>
      </div>
    </div>
  );
}
