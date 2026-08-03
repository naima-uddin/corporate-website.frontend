"use client";

import React, { use } from "react";
import BlogEdit from "@/components/dashboard/Blog/BlogEdit";

export default function EditBlogPage({ params }) {
  const { id } = use(params);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <BlogEdit postId={id} />
    </div>
  );
}
