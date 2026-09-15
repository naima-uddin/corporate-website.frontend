// Shared helpers for the Services dashboard.
// The public service page (components/ServicePage/ServiceDetailClient.jsx) renders
// `process` and `stats` as "primary | secondary" strings and `features` as a flat
// list. Here we convert between that API shape and the structured shape the
// sectioned editor works with, so new/edit pages stay tiny.

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

export const slugifyPath = (title) => {
  const slug = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `/services/${slug}` : "";
};

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
  };
}
