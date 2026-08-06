"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import RichTextEditor from "../components/forms/RichTextEditor";

const emptyLegalPage = {
  privacyPolicy: { title: "", content: "" },
  termsOfService: { title: "", content: "" },
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

export default function LegalPagesSettingsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [legalPage, setLegalPage] = useState(emptyLegalPage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLegalPage();
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

  const fetchLegalPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/legal-pages/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.legalPage) {
          setLegalPage({
            privacyPolicy: {
              ...emptyLegalPage.privacyPolicy,
              ...data.legalPage.privacyPolicy,
            },
            termsOfService: {
              ...emptyLegalPage.termsOfService,
              ...data.legalPage.termsOfService,
            },
          });
        }
      }
    } catch (err) {
      console.error("Error fetching legal page content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/legal-pages`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(legalPage),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setLegalPage({
          privacyPolicy: {
            ...emptyLegalPage.privacyPolicy,
            ...data.legalPage.privacyPolicy,
          },
          termsOfService: {
            ...emptyLegalPage.termsOfService,
            ...data.legalPage.termsOfService,
          },
        });
        setMessage("Legal page content saved successfully.");
      } else {
        setError("Failed to save legal page content.");
      }
    } catch (err) {
      console.error("Error saving legal page content:", err);
      setError("Failed to save legal page content.");
    } finally {
      setSaving(false);
    }
  };

  const updateTitle = (page) => (e) =>
    setLegalPage((prev) => ({
      ...prev,
      [page]: { ...prev[page], title: e.target.value },
    }));

  const updateContent = (page) => (html) =>
    setLegalPage((prev) => ({
      ...prev,
      [page]: { ...prev[page], content: html },
    }));

  if (loading) {
    return (
      <p className="text-slate-500 text-sm">Loading legal page content...</p>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-slate-600">
          The content shown on the public Privacy Policy and Terms of Service
          pages.
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
        title="Privacy Policy"
        description="Shown at /privacy-policy"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={legalPage.privacyPolicy.title}
            onChange={updateTitle("privacyPolicy")}
            placeholder="Privacy Policy"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Content
          </label>
          <RichTextEditor
            value={legalPage.privacyPolicy.content}
            onChange={updateContent("privacyPolicy")}
            uploadType="legal"
            placeholder="Write the privacy policy content here..."
            minHeight={400}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Terms of Service"
        description="Shown at /terms-of-service"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={legalPage.termsOfService.title}
            onChange={updateTitle("termsOfService")}
            placeholder="Terms of Service"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Content
          </label>
          <RichTextEditor
            value={legalPage.termsOfService.content}
            onChange={updateContent("termsOfService")}
            uploadType="legal"
            placeholder="Write the terms of service content here..."
            minHeight={400}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Legal Pages"}
        </button>
      </div>
    </div>
  );
}
