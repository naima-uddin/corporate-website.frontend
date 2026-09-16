"use client";

import React from "react";

const TONES = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-[#eef4fc] text-[#0b4f9e]",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
};

export default function Badge({ tone = "slate", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${TONES[tone] || TONES.slate}`}
    >
      {children}
    </span>
  );
}
