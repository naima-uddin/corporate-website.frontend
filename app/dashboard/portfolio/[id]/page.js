"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PortfolioForm from "../PortfolioForm";

const emptyForm = {
  title: "",
  description: "",
  category: [],
  image: "",
  link: "",
  client: "",
  technologies: "",
  duration: "",
  teamSize: "",
  role: "",
  challenge: "",
  solution: "",
  result: "",
  features: "",
  metrics: "",
};

export default function EditPortfolioPage({ params }) {
  const { id } = use(params);
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = (data.portfolios || []).find((p) => p._id === id);
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({
            title: item.title || "",
            description: item.description || "",
            category: item.category || [],
            image: item.image || "",
            link: item.link || "",
            client: item.client || "",
            technologies: item.technologies?.join(",") || "",
            duration: item.duration || "",
            teamSize: item.teamSize || "",
            role: item.role || "",
            challenge: item.challenge || "",
            solution: item.solution || "",
            result: item.result || "",
            features: item.features?.join("\n") || "",
            metrics:
              item.metrics?.map((m) => `${m.value}|${m.label}`).join("\n") ||
              "",
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching portfolio item:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [token, id]);

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const features = form.features
        ? form.features
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f)
        : [];

      const metrics = form.metrics
        ? form.metrics
            .split("\n")
            .map((m) => {
              const [value, label] = m.split("|").map((s) => s.trim());
              return value && label ? { value, label } : null;
            })
            .filter((m) => m)
        : [];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            technologies: form.technologies.split(",").map((t) => t.trim()),
            features,
            metrics,
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/portfolio");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save project");
      }
    } catch (err) {
      console.error("Error saving portfolio:", err);
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">
        Project not found.
      </div>
    );
  }

  return (
    <PortfolioForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit Project"
      submitLabel="Update Project"
    />
  );
}
