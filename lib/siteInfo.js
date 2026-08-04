const API = process.env.NEXT_PUBLIC_API_URL;

const FALLBACK_SITE = {
  siteName: "MRH",
  logoImage: "/A2ITLogo.png",
};

const FALLBACK_CONTACT = {
  address: "House-320, Road-21, DOHS, Mohakhali, Dhaka, Bangladesh",
  phone: "+880 1711-270825",
  email: "msmdrakibhasan1992@gmail.com",
};

// Server-side helpers for building page metadata / JSON-LD from the
// dashboard-managed SiteSettings & ContactSettings, with safe fallbacks.
export async function getSiteInfo() {
  try {
    const res = await fetch(`${API}/api/site-settings`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.settings) {
        return { ...FALLBACK_SITE, ...data.settings };
      }
    }
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
  }
  return FALLBACK_SITE;
}

// logoImage may be a relative path (bundled asset) or an absolute Cloudinary URL
export function resolveLogoUrl(logoImage, baseUrl = "https://a2itltd.com") {
  const src = logoImage || "/A2ITLogo.png";
  return /^https?:\/\//i.test(src) ? src : `${baseUrl}${src}`;
}

export async function getContactInfo() {
  try {
    const res = await fetch(`${API}/api/contact-settings`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.settings) {
        return { ...FALLBACK_CONTACT, ...data.settings };
      }
    }
  } catch (error) {
    console.error("Failed to fetch contact settings:", error);
  }
  return FALLBACK_CONTACT;
}
