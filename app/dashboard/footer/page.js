"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyFooter = {
  topBandImage: "",
  topBandPublicId: "",
  topBandEyebrow: "",
  topBandHeading: "",
  topBandSubtitle: "",
  topBandButtons: [],
  logoImage: "",
  logoPublicId: "",
  tagline: "",
  columns: [],
  address: "",
  phone: "",
  email: "",
  socialLinks: [],
  copyrightText: "",
  legalLinks: [],
};

const SectionCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
  >
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    {children}
  </motion.div>
);

const TextField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
    />
  </div>
);

export default function FooterPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [footer, setFooter] = useState(emptyFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFooter();
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

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/footer/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.footer) {
          setFooter({ ...emptyFooter, ...data.footer });
        }
      }
    } catch (err) {
      console.error("Error fetching footer:", err);
    } finally {
      setLoading(false);
    }
  };

  const setField = (field) => (e) => {
    setFooter((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // --- Top band buttons ---
  const addTopBandButton = () => {
    setFooter((prev) => ({
      ...prev,
      topBandButtons: [...prev.topBandButtons, { text: "", link: "" }],
    }));
  };
  const updateTopBandButton = (index, field, value) => {
    setFooter((prev) => ({
      ...prev,
      topBandButtons: prev.topBandButtons.map((btn, i) =>
        i === index ? { ...btn, [field]: value } : btn,
      ),
    }));
  };
  const removeTopBandButton = (index) => {
    setFooter((prev) => ({
      ...prev,
      topBandButtons: prev.topBandButtons.filter((_, i) => i !== index),
    }));
  };

  // --- Columns ---
  const addColumn = () => {
    setFooter((prev) => ({
      ...prev,
      columns: [...prev.columns, { title: "", links: [] }],
    }));
  };
  const updateColumnTitle = (colIndex, title) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === colIndex ? { ...col, title } : col,
      ),
    }));
  };
  const removeColumn = (colIndex) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== colIndex),
    }));
  };
  const addLinkToColumn = (colIndex) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === colIndex
          ? { ...col, links: [...col.links, { label: "", url: "" }] }
          : col,
      ),
    }));
  };
  const updateLinkInColumn = (colIndex, linkIndex, field, value) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === colIndex
          ? {
              ...col,
              links: col.links.map((link, j) =>
                j === linkIndex ? { ...link, [field]: value } : link,
              ),
            }
          : col,
      ),
    }));
  };
  const removeLinkFromColumn = (colIndex, linkIndex) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === colIndex
          ? { ...col, links: col.links.filter((_, j) => j !== linkIndex) }
          : col,
      ),
    }));
  };

  // --- Social links ---
  const addSocialLink = () => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };
  const updateSocialLink = (index, field, value) => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s, i) =>
        i === index ? { ...s, [field]: value } : s,
      ),
    }));
  };
  const removeSocialLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  // --- Legal links ---
  const addLegalLink = () => {
    setFooter((prev) => ({
      ...prev,
      legalLinks: [...prev.legalLinks, { label: "", url: "" }],
    }));
  };
  const updateLegalLink = (index, field, value) => {
    setFooter((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.map((l, i) =>
        i === index ? { ...l, [field]: value } : l,
      ),
    }));
  };
  const removeLegalLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/footer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(footer),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFooter({ ...emptyFooter, ...data.footer });
        setMessage("Footer saved successfully.");
      } else {
        setError("Failed to save footer.");
      }
    } catch (err) {
      console.error("Error saving footer:", err);
      setError("Failed to save footer.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading footer settings...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Manage Footer
        </h1>
        <p className="text-slate-600">
          Control the site-wide footer — the top hero band, logo, link
          columns, contact info, socials, and legal links shown on every page.
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

      <SectionCard title="Top Band">
        <ImageUploadFactory
          type="footer-top-band"
          label="Background Image"
          onImageUploaded={(url) =>
            setFooter((prev) => ({ ...prev, topBandImage: url || "" }))
          }
          currentImage={footer.topBandImage}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Eyebrow"
            value={footer.topBandEyebrow}
            onChange={setField("topBandEyebrow")}
            placeholder="e.g. Let's Work Together"
          />
          <TextField
            label="Heading"
            value={footer.topBandHeading}
            onChange={setField("topBandHeading")}
            placeholder="e.g. Ready to build your next digital product?"
          />
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={footer.topBandSubtitle}
              onChange={setField("topBandSubtitle")}
              rows={2}
              placeholder="Short supporting text under the heading"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Buttons
          </label>
          {footer.topBandButtons.map((btn, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={btn.text}
                onChange={(e) =>
                  updateTopBandButton(index, "text", e.target.value)
                }
                placeholder="Button text"
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <input
                type="text"
                value={btn.link}
                onChange={(e) =>
                  updateTopBandButton(index, "link", e.target.value)
                }
                placeholder="Button link"
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                onClick={() => removeTopBandButton(index)}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTopBandButton}
            className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" /> Add Button
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Logo & Tagline">
        <ImageUploadFactory
          type="footer-logo"
          label="Footer Logo"
          onImageUploaded={(url) =>
            setFooter((prev) => ({ ...prev, logoImage: url || "" }))
          }
          currentImage={footer.logoImage}
        />
        <TextField
          label="Tagline"
          value={footer.tagline}
          onChange={setField("tagline")}
          placeholder="e.g. Transforming ideas into digital reality."
        />
      </SectionCard>

      <SectionCard title="Link Columns">
        {footer.columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="border border-slate-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={column.title}
                onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                placeholder="Column title, e.g. Quick Links"
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
              <button
                type="button"
                onClick={() => removeColumn(colIndex)}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pl-2">
              {column.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      updateLinkInColumn(
                        colIndex,
                        linkIndex,
                        "label",
                        e.target.value,
                      )
                    }
                    placeholder="Link label"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      updateLinkInColumn(
                        colIndex,
                        linkIndex,
                        "url",
                        e.target.value,
                      )
                    }
                    placeholder="Link URL"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => removeLinkFromColumn(colIndex, linkIndex)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLinkToColumn(colIndex)}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addColumn}
          className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
        >
          <Plus className="w-4 h-4" /> Add Column
        </button>
      </SectionCard>

      <SectionCard title="Contact Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <TextField
              label="Address"
              value={footer.address}
              onChange={setField("address")}
              placeholder="e.g. House-320, Road-21, DOHS, Mohakhali, Dhaka, Bangladesh"
            />
          </div>
          <TextField
            label="Phone"
            value={footer.phone}
            onChange={setField("phone")}
            placeholder="e.g. +880 1711-270825"
          />
          <TextField
            label="Email"
            value={footer.email}
            onChange={setField("email")}
            placeholder="e.g. msmdrakibhasan1992@gmail.com"
          />
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        {footer.socialLinks.map((social, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={social.platform}
              onChange={(e) =>
                updateSocialLink(index, "platform", e.target.value)
              }
              placeholder="Platform, e.g. facebook"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <input
              type="text"
              value={social.url}
              onChange={(e) => updateSocialLink(index, "url", e.target.value)}
              placeholder="Profile URL"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <button
              type="button"
              onClick={() => removeSocialLink(index)}
              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSocialLink}
          className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
      </SectionCard>

      <SectionCard title="Copyright & Legal Links">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Copyright Text
          </label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={setField("copyrightText")}
            placeholder="e.g. © {year} MRH. All Rights Reserved"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">
            Use <code>{"{year}"}</code> as a placeholder for the current year.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Legal Links
          </label>
          {footer.legalLinks.map((link, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) =>
                  updateLegalLink(index, "label", e.target.value)
                }
                placeholder="Label, e.g. Privacy Policy"
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLegalLink(index, "url", e.target.value)}
                placeholder="Link URL"
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                onClick={() => removeLegalLink(index)}
                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLegalLink}
            className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" /> Add Legal Link
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
          {saving ? "Saving..." : "Save Footer"}
        </button>
      </div>
    </div>
  );
}
