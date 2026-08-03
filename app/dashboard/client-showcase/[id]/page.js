"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ClientLogoForm from "../ClientLogoForm";

const emptyForm = { image: "", name: "" };

export default function EditClientLogoPage({ params }) {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = (data.logos || []).find((l) => l._id === id);
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({ image: item.image || "", name: item.name || "" });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching client logo:", err);
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

    if (!form.image) {
      setError("Please upload a logo image first");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (response.ok) {
        router.push("/dashboard/client-showcase");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save logo");
      }
    } catch (err) {
      console.error("Error saving client logo:", err);
      setError("Failed to save logo");
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
        Client logo not found.
      </div>
    );
  }

  return (
    <ClientLogoForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit Logo"
      submitLabel="Update Logo"
    />
  );
}
