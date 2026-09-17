"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SmartFeatureForm from "../SmartFeatureForm";

const emptyForm = {
  style: "light",
  title: "",
  description: "",
  image: "",
  statValue: "",
  statLabel: "",
  badge: "",
  order: 0,
};

function EditSmartFeatureContent() {
  const id = useSearchParams().get("id");
  const { token, canAccess } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = (data.features || []).find((f) => f._id === id);
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({
            style: item.style || "light",
            title: item.title || "",
            description: item.description || "",
            image: item.image || "",
            statValue: item.statValue || "",
            statLabel: item.statLabel || "",
            badge: item.badge || "",
            order: item.order ?? 0,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching smart feature:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [token, id]);

  if (!canAccess("smart-features")) {
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

    if (!form.title) {
      setError("Please provide a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/smart-features");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save feature");
      }
    } catch (err) {
      console.error("Error saving smart feature:", err);
      setError("Failed to save feature");
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
        Feature card not found.
      </div>
    );
  }

  return (
    <SmartFeatureForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit Feature Card"
      submitLabel="Update Card"
    />
  );
}

export default function EditSmartFeaturePage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-slate-500">Loading...</div>
      }
    >
      <EditSmartFeatureContent />
    </Suspense>
  );
}
