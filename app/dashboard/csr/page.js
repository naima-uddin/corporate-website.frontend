"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Pencil, X } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";
import RichTextEditor from "../components/forms/RichTextEditor";

const emptyData = {
  label: "Giving Back",
  heading: "Corporate Social Responsibility",
  description: "",
  chairman: {
    image: "",
    imagePublicId: "",
    name: "",
    designation: "",
    message: "",
  },
};

const emptyActivityForm = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  date: "",
  order: 0,
  status: "published",
};

const SectionCard = ({ title, description, children, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
  >
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {actions}
    </div>
    {children}
  </motion.div>
);

export default function CSRAdmin() {
  const { token, isAdmin, isModerator } = useAuth();

  // --- Page settings + chairman message ---
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --- CSR activities (inline manage, no separate routes) ---
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null | "new" | activity _id
  const [activityForm, setActivityForm] = useState(emptyActivityForm);
  const [activitySaving, setActivitySaving] = useState(false);
  const [activityError, setActivityError] = useState("");

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
            chairman: { ...emptyData.chairman, ...result.csr.chairman },
          });
        }
      }
    } catch (err) {
      console.error("Error fetching CSR page:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/csr-activities/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const result = await response.json();
        setActivities(result.activities || []);
      }
    } catch (err) {
      console.error("Error fetching CSR activities:", err);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
    fetchActivities();
  }, [token]);

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateChairman = (field, value) => {
    setData((prev) => ({
      ...prev,
      chairman: { ...prev.chairman, [field]: value },
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
        setData((prev) => ({
          ...prev,
          ...result.csr,
          chairman: { ...prev.chairman, ...result.csr.chairman },
        }));
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

  const startAddActivity = () => {
    setActivityForm(emptyActivityForm);
    setActivityError("");
    setEditingId("new");
  };

  const startEditActivity = (item) => {
    setActivityForm({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      image: item.image || "",
      date: item.date || "",
      order: item.order ?? 0,
      status: item.status || "published",
    });
    setActivityError("");
    setEditingId(item._id);
  };

  const cancelActivityEdit = () => {
    setEditingId(null);
    setActivityForm(emptyActivityForm);
    setActivityError("");
  };

  const handleActivityFieldChange = (field) => (e) => {
    setActivityForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleActivitySave = async () => {
    if (!activityForm.title.trim()) {
      setActivityError("Please provide a title");
      return;
    }

    setActivitySaving(true);
    setActivityError("");

    const isNew = editingId === "new";
    const url = isNew
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/csr-activities`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/csr-activities/${editingId}`;

    try {
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityForm),
      });

      if (response.ok) {
        cancelActivityEdit();
        fetchActivities();
      } else {
        const result = await response.json();
        setActivityError(result.message || "Failed to save CSR activity");
      }
    } catch (err) {
      console.error("Error saving CSR activity:", err);
      setActivityError("Failed to save CSR activity");
    } finally {
      setActivitySaving(false);
    }
  };

  const handleActivityDelete = async (id) => {
    if (!window.confirm("Delete this CSR activity?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/csr-activities/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        if (editingId === id) cancelActivityEdit();
        fetchActivities();
      }
    } catch (err) {
      console.error("Error deleting CSR activity:", err);
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
    return <p className="text-slate-500 text-sm">Loading CSR page...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">CSR Page</h1>
        <p className="text-slate-600">
          Manage the header, chairman&apos;s message, and CSR activities shown
          on the public CSR page — all from this one page.
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
        title="Chairman's Message"
        description="Shown as a highlighted message block on the CSR page. Leave blank to hide this section."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={data.chairman.name}
              onChange={(e) => updateChairman("name", e.target.value)}
              placeholder="e.g. Alhaj Sufi Mohamed Mizanur Rahman"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={data.chairman.designation}
              onChange={(e) => updateChairman("designation", e.target.value)}
              placeholder="e.g. Chairman"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Message
          </label>
          <textarea
            rows={4}
            value={data.chairman.message}
            onChange={(e) => updateChairman("message", e.target.value)}
            placeholder="A short message from the chairman about the company's commitment to social responsibility."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        <ImageUploadFactory
          type="csr"
          label="Photo"
          onImageUploaded={(url) => updateChairman("image", url || "")}
          currentImage={data.chairman.image}
        />
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

      <SectionCard
        title="CSR Activities"
        description="Each activity shows on the public CSR page and has its own details page at /csr/[slug]."
        actions={
          editingId === null && (
            <button
              type="button"
              onClick={startAddActivity}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <Plus className="w-4 h-4" />
              Add CSR Activity
            </button>
          )
        }
      >
        {editingId !== null && (
          <div className="border border-cyan-200 bg-cyan-50/40 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {editingId === "new" ? "New Activity" : "Edit Activity"}
              </p>
              <button
                type="button"
                onClick={cancelActivityEdit}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>

            {activityError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {activityError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
              <ImageUploadFactory
                type="csr"
                label="Image"
                onImageUploaded={(url) =>
                  setActivityForm((prev) => ({ ...prev, image: url || "" }))
                }
                currentImage={activityForm.image}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={activityForm.title}
                    onChange={handleActivityFieldChange("title")}
                    placeholder="e.g. University of Information Technology & Sciences (UITS)"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={activityForm.excerpt}
                    onChange={handleActivityFieldChange("excerpt")}
                    rows={4}
                    placeholder="Summary text shown on the CSR listing page"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Details
                  </label>
                  <RichTextEditor
                    value={activityForm.content}
                    onChange={(html) =>
                      setActivityForm((prev) => ({ ...prev, content: html }))
                    }
                    uploadType="csr"
                    minHeight={280}
                    placeholder="Full write-up shown on this activity's dedicated details page."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date (optional)
                  </label>
                  <input
                    type="text"
                    value={activityForm.date}
                    onChange={handleActivityFieldChange("date")}
                    placeholder="e.g. January 2026"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={activityForm.status}
                    onChange={handleActivityFieldChange("status")}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={activityForm.order}
                    onChange={handleActivityFieldChange("order")}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Lower numbers show first on the CSR page.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelActivityEdit}
                className="px-5 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActivitySave}
                disabled={activitySaving}
                className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {activitySaving
                  ? "Saving..."
                  : editingId === "new"
                    ? "Add Activity"
                    : "Update Activity"}
              </button>
            </div>
          </div>
        )}

        {activitiesLoading ? (
          <p className="text-slate-500 text-sm">Loading CSR activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-slate-500 text-sm">No CSR activities yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((item) => (
              <div
                key={item._id}
                className="relative border border-slate-200 rounded-lg overflow-hidden flex flex-col"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3 flex-1 flex flex-col gap-1">
                  <span
                    className={`w-fit text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    /csr/{item.slug}
                  </p>
                </div>
                <div className="flex gap-2 p-3 pt-0">
                  <button
                    type="button"
                    onClick={() => startEditActivity(item)}
                    title="Edit"
                    className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleActivityDelete(item._id)}
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
      </SectionCard>
    </div>
  );
}
