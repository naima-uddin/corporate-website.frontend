import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/ServicePage/ServiceDetailClient";

const normalizeSlug = (path) =>
  String(path || "")
    .replace(/^\/services\//, "")
    .replace(/^\//, "")
    .toLowerCase();

async function getServiceBySlug(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const services = Array.isArray(data.services) ? data.services : [];
  return services.find((service) => normalizeSlug(service.path) === slug) || null;
}

async function getCategoryDisplayName(categoryName) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const categories = Array.isArray(data.categories) ? data.categories : [];
  return categories.find((category) => category.name === categoryName)?.displayName || null;
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
  if (!res.ok) return [];
  const data = await res.json();
  const services = Array.isArray(data.services) ? data.services : [];
  return services
    .filter((service) => service.path)
    .map((service) => ({ slug: normalizeSlug(service.path) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return {};

  return {
    title: `${service.title} | A2IT Ltd`,
    description: service.description,
    alternates: {
      canonical: `https://a2itltd.com${service.path}`,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `https://a2itltd.com${service.path}`,
      siteName: "A2IT Ltd",
      images: service.image ? [{ url: service.image }] : undefined,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const categoryLabel = await getCategoryDisplayName(service.category);

  return (
    <>
      <ServiceDetailClient
        service={service}
        categoryLabel={categoryLabel}
        categorySlug={service.category}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: {
              "@type": "Organization",
              name: "A2IT",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
          }),
        }}
      />
    </>
  );
}
