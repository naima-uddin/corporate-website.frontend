"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export const ICON_OPTIONS = [
  "Building2",
  "Truck",
  "ShoppingCart",
  "Gavel",
  "ClipboardCheck",
  "Milestone",
  "Landmark",
  "Wrench",
  "Package",
  "Hammer",
  "Warehouse",
  "Users",
  "MapPin",
  "Factory",
  "TreePine",
  "Droplet",
  "School",
  "HeartPulse",
  "Wheat",
];

const emptyData = {
  hero: {
    label: "Government Contracts",
    heading: "Our Projects",
    highlight: "",
    description: "",
    backgroundImage: "",
  },
  contractsSection: { heading: "Recent Government Contracts", viewAllLink: "" },
  featuredSection: { heading: "Featured Government Projects", viewAllLink: "" },
  stats: [],
  workCategories: [],
  timeline: [],
  cta: {
    heading: "",
    description: "",
    buttonText: "Contact Us",
    buttonLink: "/contact",
    secondaryButtonText: "Download Company Profile",
    secondaryButtonLink: "/RakibHasanPortfolio.pdf",
  },
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

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900";

export default function ProjectsPageAdmin() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects-page/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.projectsPage) {
          setData({
            ...emptyData,
            ...result.projectsPage,
            hero: { ...emptyData.hero, ...result.projectsPage.hero },
            contractsSection: {
              ...emptyData.contractsSection,
              ...result.projectsPage.contractsSection,
            },
            featuredSection: {
              ...emptyData.featuredSection,
              ...result.projectsPage.featuredSection,
            },
            cta: { ...emptyData.cta, ...result.projectsPage.cta },
            stats: result.projectsPage.stats || [],
            workCategories: result.projectsPage.workCategories || [],
            timeline: result.projectsPage.timeline || [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching projects page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const updateHero = (field, value) =>
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));

  const updateContractsSection = (field, value) =>
    setData((prev) => ({
      ...prev,
      contractsSection: { ...prev.contractsSection, [field]: value },
    }));

  const updateFeaturedSection = (field, value) =>
    setData((prev) => ({
      ...prev,
      featuredSection: { ...prev.featuredSection, [field]: value },
    }));

  const updateCta = (field, value) =>
    setData((prev) => ({ ...prev, cta: { ...prev.cta, [field]: value } }));

  const updateListItem = (listKey, index, field, value) => {
    setData((prev) => {
      const list = [...prev[listKey]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listKey]: list };
    });
  };

  const addListItem = (listKey, empty) =>
    setData((prev) => ({ ...prev, [listKey]: [...prev[listKey], empty] }));

  const removeListItem = (listKey, index) =>
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects-page`,
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
        setData((prev) => ({ ...prev, ...result.projectsPage }));
        setMessage("Projects page saved successfully.");
      } else {
        setError("Failed to save projects page.");
      }
    } catch (err) {
      console.error("Error saving projects page:", err);
      setError("Failed to save projects page.");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <p className="text-slate-500 text-sm">Loading projects page...</p>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Projects Page Settings
        </h1>
        <p className="text-slate-600">
          Manage the hero, stats, work categories, timeline and CTA shown on
          the public Projects page. Individual contracts/projects are managed
          under{" "}
          <a
            href="/dashboard/portfolio"
            className="text-cyan-600 hover:underline"
          >
            Manage Portfolio
          </a>
          .
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
        title="Hero Section"
        description="Shown at the top of the Projects page."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Label (small eyebrow text)">
            <input
              type="text"
              value={data.hero.label}
              onChange={(e) => updateHero("label", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              value={data.hero.heading}
              onChange={(e) => updateHero("heading", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            rows={3}
            value={data.hero.description}
            onChange={(e) => updateHero("description", e.target.value)}
            className={inputClass}
          />
        </Field>
        <ImageUploadFactory
          type="projects-page"
          label="Background Image"
          currentImage={data.hero.backgroundImage}
          onImageUploaded={(url) => updateHero("backgroundImage", url || "")}
        />
      </SectionCard>

      <SectionCard title="Stats Bar">
        <div className="space-y-3">
          {data.stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end border border-slate-200 rounded-lg p-3">
              <Field label="Value">
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) =>
                    updateListItem("stats", index, "value", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Suffix">
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) =>
                    updateListItem("stats", index, "suffix", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Label">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) =>
                    updateListItem("stats", index, "label", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeListItem("stats", index)}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 h-[46px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addListItem("stats", { value: 0, suffix: "+", label: "" })
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Work Categories">
        <div className="space-y-3">
          {data.workCategories.map((cat, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border border-slate-200 rounded-lg p-3">
              <Field label="Name">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) =>
                    updateListItem(
                      "workCategories",
                      index,
                      "name",
                      e.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Icon">
                <select
                  value={cat.icon}
                  onChange={(e) =>
                    updateListItem(
                      "workCategories",
                      index,
                      "icon",
                      e.target.value,
                    )
                  }
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </Field>
              <button
                type="button"
                onClick={() => removeListItem("workCategories", index)}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 h-[46px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addListItem("workCategories", { name: "", icon: "Building2" })
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Project Timeline">
        <div className="space-y-3">
          {data.timeline.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border border-slate-200 rounded-lg p-3">
              <Field label="Year">
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) =>
                    updateListItem("timeline", index, "year", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Label">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) =>
                    updateListItem("timeline", index, "label", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeListItem("timeline", index)}
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 h-[46px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("timeline", { year: "", label: "" })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" /> Add Timeline Entry
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Call To Action">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Heading">
            <input
              type="text"
              value={data.cta.heading}
              onChange={(e) => updateCta("heading", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <input
              type="text"
              value={data.cta.description}
              onChange={(e) => updateCta("description", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Primary Button Text">
            <input
              type="text"
              value={data.cta.buttonText}
              onChange={(e) => updateCta("buttonText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Primary Button Link">
            <input
              type="text"
              value={data.cta.buttonLink}
              onChange={(e) => updateCta("buttonLink", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Secondary Button Text">
            <input
              type="text"
              value={data.cta.secondaryButtonText}
              onChange={(e) =>
                updateCta("secondaryButtonText", e.target.value)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Secondary Button Link">
            <input
              type="text"
              value={data.cta.secondaryButtonLink}
              onChange={(e) =>
                updateCta("secondaryButtonLink", e.target.value)
              }
              className={inputClass}
            />
          </Field>
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
          {saving ? "Saving..." : "Save Projects Page"}
        </button>
      </div>
    </div>
  );
}
