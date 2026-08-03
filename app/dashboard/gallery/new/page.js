"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BulkImageUploader from "../BulkImageUploader";

export default function NewGalleryImagePage() {
  const { isAdmin, isModerator } = useAuth();
  const router = useRouter();

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
    <div className="space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/gallery")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </button>
        <h1 className="text-4xl font-bold text-slate-900">
          Add Gallery Image(s)
        </h1>
        <p className="text-slate-600 mt-1">
          Add a single image or many at once (10+) under one category.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        <BulkImageUploader
          onComplete={() => router.push("/dashboard/gallery")}
        />
      </motion.div>
    </div>
  );
}
