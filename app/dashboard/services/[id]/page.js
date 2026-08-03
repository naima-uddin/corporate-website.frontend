"use client";

import React, { use, useEffect, useState } from "react";
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

export default function EditServicePage({ params }) {
  const { id } = use(params);
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyFormData);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

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
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const service = (data.services || []).find((s) => s._id === id);
          if (!service) {
            setNotFound(true);
            return;
          }
          setForm({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || "Code",
            features: (service.features || []).join("\n"),
            category: service.category || "",
            path: service.path || "",
            color: service.color || "bg-[#0066ff]",
            image: service.image || "",
            images: service.images || [],
            details: service.details || "",
            process: (service.process || []).join("\n"),
            stats: (service.stats || []).join("\n"),
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
        {
          method: "PUT",
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

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">
        Service not found.
      </div>
    );
  }

  return (
    <ServiceForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit Service"
      submitLabel="Update Service"
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );
}
