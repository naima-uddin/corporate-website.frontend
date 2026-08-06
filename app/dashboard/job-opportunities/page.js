"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, X, Save, Briefcase } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const emptyForm = {
  title: "",
  location: "",
  jobType: "Full-time",
  description: "",
  deadline: "",
  applyLink: "",
  applyEmail: "",
  isActive: true,
};

const toDateInputValue = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const getStatus = (job) => {
  if (!job.isActive) return { label: "Inactive", className: "bg-slate-100 text-slate-600" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(job.deadline);
  if (deadline < today) {
    return { label: "Expired", className: "bg-red-50 text-red-600" };
  }
  return { label: "Active", className: "bg-emerald-50 text-emerald-600" };
};

export default function JobOpportunitiesPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-opportunities/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      }
    } catch (err) {
      console.error("Error fetching job opportunities:", err);
    } finally {
      setLoading(false);
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

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const openEditForm = (job) => {
    setForm({
      title: job.title || "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      description: job.description || "",
      deadline: toDateInputValue(job.deadline),
      applyLink: job.applyLink || "",
      applyEmail: job.applyEmail || "",
      isActive: job.isActive !== undefined ? job.isActive : true,
    });
    setEditingId(job._id);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.deadline) {
      setError("Please provide title, description and deadline.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/job-opportunities/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/job-opportunities`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage(
          isEdit
            ? "Job opportunity updated successfully."
            : "Job opportunity created successfully.",
        );
        closeForm();
        fetchJobs();
      } else {
        setError("Failed to save job opportunity.");
      }
    } catch (err) {
      console.error("Error saving job opportunity:", err);
      setError("Failed to save job opportunity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job opportunity?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-opportunities/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        fetchJobs();
      }
    } catch (err) {
      console.error("Error deleting job opportunity:", err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Job Opportunities
          </h1>
          <p className="text-slate-600">
            Manage the openings shown on the public Careers page. Jobs past
            their deadline automatically stop showing.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Job
          </button>
        )}
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

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Job" : "Add New Job"}
            </h2>
            <button
              onClick={closeForm}
              className="p-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Type
              </label>
              <select
                value={form.jobType}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, jobType: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, deadline: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <p className="mt-2 text-xs text-slate-500">
                The job automatically stops showing on the site after this
                date.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Role responsibilities, requirements, qualifications..."
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Apply Link
              </label>
              <input
                type="text"
                value={form.applyLink}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, applyLink: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Apply Email
              </label>
              <input
                type="email"
                value={form.applyEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, applyEmail: e.target.value }))
                }
                placeholder="careers@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Provide at least one of Apply Link / Apply Email so applicants
            can respond. If both are set, the link is used.
          </p>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-4 h-4"
            />
            Active (visible on the Careers page while not expired)
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Job"}
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading job opportunities...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-1">No job opportunities yet</p>
          <p className="text-slate-400 text-sm">
            Add your first opening above — the public Careers page will show
            &quot;No current job opportunities right now&quot; until then.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const status = getStatus(job);
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {job.jobType}
                    {job.location ? ` · ${job.location}` : ""} · Deadline:{" "}
                    {toDateInputValue(job.deadline)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditForm(job)}
                    className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#0066ff] rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
