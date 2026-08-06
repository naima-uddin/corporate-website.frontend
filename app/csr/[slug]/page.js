import CSRDetailClient from "@/components/csr-page-component/CSRDetailClient";
import { getSiteInfo } from "@/lib/siteInfo";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    const resp = await fetch(`${API}/api/csr-activities`);
    if (!resp.ok) return [];

    const data = await resp.json();
    const activities = Array.isArray(data.activities) ? data.activities : [];

    return activities
      .filter((item) => item.slug)
      .map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("Failed to fetch CSR activity slugs for static export:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const site = await getSiteInfo();

  try {
    const resp = await fetch(`${API}/api/csr-activities/${slug}`);

    if (resp.ok) {
      const data = await resp.json();
      const activity = data.activity;

      return {
        title: `${activity?.title || "CSR Activity"} | ${site.siteName}`,
        description:
          activity?.excerpt ||
          activity?.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
          `Read about ${site.siteName}'s CSR initiatives.`,
        openGraph: {
          title: `${activity?.title || "CSR Activity"} | ${site.siteName}`,
          description: activity?.excerpt,
          images: activity?.images?.[0] ? [{ url: activity.images[0] }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch CSR activity metadata:", error);
  }

  return {
    title: `CSR | ${site.siteName}`,
    description: `${site.siteName}'s corporate social responsibility initiatives.`,
  };
}

export default async function CSRActivityDetailPage({ params }) {
  const { slug } = await params;
  return <CSRDetailClient slug={slug} />;
}
