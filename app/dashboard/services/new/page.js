"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ServiceForm from "../ServiceForm";
import { emptyForm, toApiPayload } from "../serviceFormUtils";

export default function NewServicePage() {
  const { token, canAccess } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
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
          const list = data.categories || [];
          setCategories(list);
          if (list.length) {
            setForm((prev) => ({ ...prev, category: list[0].name }));
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

  if (!canAccess("services")) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = toApiPayload(form);
    if (payload.features.length === 0) {
      setError("Please provide at least one feature.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        router.push("/dashboard/services");
      } else {
        const data = await response.json();
        setError(data.error || data.message || "Failed to save service");
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
      heading="Create new service"
      submitLabel="Create service"
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );
}
