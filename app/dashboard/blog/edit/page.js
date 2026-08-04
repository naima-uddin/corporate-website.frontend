"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BlogEdit from "@/components/dashboard/Blog/BlogEdit";

function EditBlogContent() {
  const id = useSearchParams().get("id");

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <BlogEdit postId={id} />
    </div>
  );
}

export default function EditBlogPage() {
  return (
    <Suspense fallback={null}>
      <EditBlogContent />
    </Suspense>
  );
}
