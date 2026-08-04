"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Power, Pencil } from "lucide-react";

export default function ClientShowcasePage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogos();
  }, [token]);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setLogos(data.logos || []);
      }
    } catch (err) {
      console.error("Error fetching client logos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (logo) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/${logo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !logo.isActive }),
        },
      );

      if (response.ok) fetchLogos();
    } catch (err) {
      console.error("Error updating client logo:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client logo?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) fetchLogos();
    } catch (err) {
      console.error("Error deleting client logo:", err);
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
            Client Showcase
          </h1>
          <p className="text-slate-600">
            Upload and manage the client logos shown on the homepage.
          </p>
        </div>
        <Link
          href="/dashboard/client-showcase/new"
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Logo
        </Link>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Current Logos ({logos.length})
          </h2>

          {logos.length === 0 ? (
            <p className="text-slate-500 text-sm">No client logos yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {logos.map((logo) => (
                <div
                  key={logo._id}
                  className={`relative group border rounded-lg p-3 flex flex-col items-center gap-2 ${
                    logo.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-slate-300 absolute top-2 left-2" />
                  <img
                    src={logo.image}
                    alt={logo.name || "Client logo"}
                    className="w-full h-16 object-contain"
                  />
                  <p className="text-xs text-slate-600 truncate w-full text-center">
                    {logo.name || "—"}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/client-showcase/edit?id=${logo._id}`}
                      title="Edit"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleActive(logo)}
                      title={logo.isActive ? "Hide from site" : "Show on site"}
                      className={`p-2 rounded ${
                        logo.isActive
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(logo._id)}
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
