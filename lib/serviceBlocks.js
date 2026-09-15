// Canonical list + labels for the orderable content blocks on a service /
// section page. Shared by the dashboard editor and the public renderer so the
// order stays consistent. "sections" only applies to a service (a section has
// no sub-sections).

export const SERVICE_BLOCKS = [
  "features",
  "process",
  "stats",
  "gallery",
  "details",
  "sections",
];

export const BLOCK_LABELS = {
  features: "What's included",
  process: "Our process",
  stats: "Results / stats",
  gallery: "Gallery",
  details: "More details",
  sections: "Page sections",
};

// Returns a clean, de-duplicated order containing exactly the valid keys for
// the context — preserving the saved order and appending any missing keys.
export function normalizeBlockOrder(order, { includeSections = true } = {}) {
  const valid = includeSections
    ? SERVICE_BLOCKS
    : SERVICE_BLOCKS.filter((key) => key !== "sections");

  const seen = new Set();
  const result = [];
  (Array.isArray(order) ? order : []).forEach((key) => {
    if (valid.includes(key) && !seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  });
  valid.forEach((key) => {
    if (!seen.has(key)) result.push(key);
  });
  return result;
}
