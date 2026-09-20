import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/ServicePage/ServiceDetailClient";
import { getSiteInfo, resolveLogoUrl } from "@/lib/siteInfo";

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

const findSection = (service, sectionSlug) =>
  (service?.sections || []).find((sec) => sec.slug === sectionSlug) || null;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
  if (!res.ok) return [];
  const data = await res.json();
  const services = Array.isArray(data.services) ? data.services : [];

  const params = [];
  services.forEach((service) => {
    if (!service.path) return;
    const slug = normalizeSlug(service.path);
    (service.sections || []).forEach((sec) => {
      if (sec.slug) params.push({ slug, section: sec.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, section } = await params;
  const [service, site] = await Promise.all([
    getServiceBySlug(slug),
    getSiteInfo(),
  ]);

  const sec = findSection(service, section);
  if (!service || !sec) return {};

  return {
    title: `${sec.title} | ${service.title} | ${site.siteName}`,
    description: sec.description,
    alternates: {
      canonical: `https://horizoninternational.com/services/${slug}/${section}`,
    },
    openGraph: {
      title: sec.title,
      description: sec.description,
      url: `https://horizoninternational.com/services/${slug}/${section}`,
      siteName: site.siteName,
      images: sec.image ? [{ url: sec.image }] : undefined,
      type: "website",
    },
  };
}

export default async function SectionDetailPage({ params }) {
  const { slug, section } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const sec = findSection(service, section);
  if (!sec) notFound();

  const site = await getSiteInfo();

  return (
    <>
      <ServiceDetailClient
        service={sec}
        backHref={service.path}
        backLabel={service.title}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: sec.title,
            description: sec.description,
            isPartOf: {
              "@type": "Service",
              name: service.title,
            },
            provider: {
              "@type": "Organization",
              name: site.siteName,
              url: "https://horizoninternational.com",
              logo: resolveLogoUrl(site.logoImage),
            },
            areaServed: {
              "@type": "Country",
              name: "Bangladesh",
            },
          }),
        }}
      />
    </>
  );
}
