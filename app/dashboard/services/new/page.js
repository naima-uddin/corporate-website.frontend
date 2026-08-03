"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ServiceForm from "../ServiceForm";

const emptyFormData = {
  title: "",
  description: "",
  icon: "Code",
  features: "",
  category: "erp",
  path: "",
  color: "bg-[#0066ff]",
  image: "",
  images: [],
  details: "",
  process: "",
  stats: "",
};

export default function NewServicePage() {
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyFormData);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          if (data.categories?.length) {
            setForm((prev) => ({ ...prev, category: data.categories[0].name }));
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            features: form.features.split("\n").filter((f) => f.trim()),
            process: form.process.split("\n").filter((p) => p.trim()),
            stats: form.stats.split("\n").filter((s) => s.trim()),
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/services");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save service");
      }
    } catch (err) {
      console.error("Error saving service:", err);
      setError("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ServiceForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Create New Service"
      submitLabel="Create Service"
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );
}
