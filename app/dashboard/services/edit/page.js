"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ServiceForm from "../ServiceForm";
import { emptyForm, toApiPayload, toFormState } from "../serviceFormUtils";

function EditServiceContent() {
  const id = useSearchParams().get("id");
  const { token, canAccess } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
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
    if (!token || !id) return;

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
          setForm(toFormState(service));
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
        {
          method: "PUT",
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

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">Service not found.</div>
    );
  }

  return (
    <ServiceForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit service"
      submitLabel="Update service"
      categories={categories}
      categoriesLoading={categoriesLoading}
    />
  );
}

export default function EditServicePage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-slate-500">Loading...</div>
      }
    >
      <EditServiceContent />
    </Suspense>
  );
}
