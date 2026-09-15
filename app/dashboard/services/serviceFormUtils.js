// Shared helpers for the Services dashboard.
// The public service page (components/ServicePage/ServiceDetailClient.jsx) renders
// `process` and `stats` as "primary | secondary" strings and `features` as a flat
// list. Here we convert between that API shape and the structured shape the
// sectioned editor works with, so new/edit pages stay tiny.

import { normalizeBlockOrder } from "@/lib/serviceBlocks";

export const ICON_OPTIONS = [
  "Code",
  "Smartphone",
  "ShoppingCart",
  "Database",
  "TrendingUp",
  "Share2",
  "Store",
  "Tag",
  "ShoppingBag",
  "Palette",
  "Server",
];

export const emptyForm = {
  title: "",
  description: "",
  path: "",
  category: "",
  icon: "Code",
  color: "bg-[#0066ff]",
  image: "",
  images: [],
  features: [""],
  process: [],
  stats: [],
  details: "",
  sections: [],
  blockOrder: normalizeBlockOrder([], { includeSections: true }),
};

const splitPair = (line) => {
  const [left, right] = String(line || "").split("|");
  return { left: (left || "").trim(), right: (right || "").trim() };
};

const joinPair = (left, right) => {
  const a = String(left || "").trim();
  const b = String(right || "").trim();
  if (!a && !b) return "";
  return b ? `${a} | ${b}` : a;
};

export const slugifySegment = (title) =>
  String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const slugifyPath = (title) => {
  const slug = slugifySegment(title);
  return slug ? `/services/${slug}` : "";
};

export const emptySection = {
  slug: "",
  title: "",
  description: "",
  icon: "Code",
  color: "bg-[#0066ff]",
  image: "",
  images: [],
  features: [""],
  process: [],
  stats: [],
  details: "",
  blockOrder: normalizeBlockOrder([], { includeSections: false }),
};

// section (API) -> section (form state)
function sectionToFormState(section = {}) {
  return {
    slug: section.slug || "",
    title: section.title || "",
    description: section.description || "",
    icon: section.icon || "Code",
    color: section.color || "bg-[#0066ff]",
    image: section.image || "",
    images: Array.isArray(section.images) ? section.images : [],
    features:
      Array.isArray(section.features) && section.features.length
        ? section.features
        : [""],
    process: (section.process || []).map((line) => {
      const { left, right } = splitPair(line);
      return { title: left, description: right };
    }),
    stats: (section.stats || []).map((line) => {
      const { left, right } = splitPair(line);
      return { value: left, label: right };
    }),
    details: section.details || "",
    blockOrder: normalizeBlockOrder(section.blockOrder, {
      includeSections: false,
    }),
  };
}

// section (form state) -> section (API), assigning order + a slug fallback
function sectionToApiPayload(section, index) {
  const slug = section.slug?.trim() || slugifySegment(section.title);
  return {
    slug,
    title: section.title.trim(),
    description: section.description.trim(),
    icon: section.icon,
    color: section.color,
    image: section.image,
    images: section.images,
    features: section.features.map((f) => f.trim()).filter(Boolean),
    process: section.process
      .map((p) => joinPair(p.title, p.description))
      .filter(Boolean),
    stats: section.stats.map((s) => joinPair(s.value, s.label)).filter(Boolean),
    details: section.details.trim(),
    blockOrder: normalizeBlockOrder(section.blockOrder, {
      includeSections: false,
    }),
    order: index,
  };
}

// API service object -> editor form state
export function toFormState(service = {}) {
  return {
    title: service.title || "",
    description: service.description || "",
    path: service.path || "",
    category: service.category || "",
    icon: service.icon || "Code",
    color: service.color || "bg-[#0066ff]",
    image: service.image || "",
    images: Array.isArray(service.images) ? service.images : [],
    features:
      Array.isArray(service.features) && service.features.length
        ? service.features
        : [""],
    process: (service.process || []).map((line) => {
      const { left, right } = splitPair(line);
      return { title: left, description: right };
    }),
    stats: (service.stats || []).map((line) => {
      const { left, right } = splitPair(line);
      return { value: left, label: right };
    }),
    details: service.details || "",
    sections: [...(service.sections || [])]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(sectionToFormState),
    blockOrder: normalizeBlockOrder(service.blockOrder, {
      includeSections: true,
    }),
  };
}

// editor form state -> API payload
export function toApiPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    path: form.path.trim(),
    category: form.category,
    icon: form.icon,
    color: form.color,
    image: form.image,
    images: form.images,
    features: form.features.map((f) => f.trim()).filter(Boolean),
    process: form.process
      .map((p) => joinPair(p.title, p.description))
      .filter(Boolean),
    stats: form.stats.map((s) => joinPair(s.value, s.label)).filter(Boolean),
    details: form.details.trim(),
    sections: (form.sections || []).map((section, index) =>
      sectionToApiPayload(section, index),
    ),
    blockOrder: normalizeBlockOrder(form.blockOrder, { includeSections: true }),
  };
}
