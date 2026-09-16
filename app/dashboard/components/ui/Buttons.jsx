"use client";

import React from "react";
import Link from "next/link";

const base =
  "inline-flex items-center gap-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:pointer-events-none";

const VARIANTS = {
  primary: "bg-[#0b4f9e] text-white hover:bg-[#073b78] shadow-sm",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-3 py-2 text-xs",
};

export function ActionButton({
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}

export function IconButton({
  href,
  onClick,
  tone = "slate",
  title,
  children,
  ...props
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-500 hover:bg-slate-200",
    blue: "bg-[#eef4fc] text-[#0b4f9e] hover:bg-[#dde9f8]",
    red: "bg-red-50 text-red-500 hover:bg-red-100",
  };
  const classes = `rounded-lg p-2 transition ${tones[tone] || tones.slate}`;

  if (href) {
    return (
      <Link href={href} title={title} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
