import ServicesIndexClient from "@/components/ServicePage/ServicesIndexClient";
import { getSiteInfo, resolveLogoUrl } from "@/lib/siteInfo";

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.services) ? data.services : [];
}

export async function generateMetadata() {
  const site = await getSiteInfo();
  const description = `Explore the full range of services from ${site.siteName} — construction and civil works, public infrastructure, government supply and procurement, event management and CSR initiatives across Bangladesh.`;

  return {
    title: `Our Services | ${site.siteName}`,
    description,
    keywords: [
      "Government Contractor",
      "Construction",
      "Civil Works",
      "Infrastructure",
      "Irrigation",
      "Government Supply",
      "Procurement",
      "Event Management",
      "CSR",
      "Bangladesh",
    ],
    alternates: {
      canonical: "https://a2itltd.com/services",
    },
    openGraph: {
      title: `Our Services | ${site.siteName}`,
      description,
      url: "https://a2itltd.com/services",
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Our Services | ${site.siteName}`,
      description,
    },
  };
}

export default async function ServicesPage() {
  const [site, services] = await Promise.all([getSiteInfo(), getServices()]);

  return (
    <>
      <ServicesIndexClient
        heading="Our Services"
        subheading={`${site.siteName} — a 1st Class Government Contractor, Supplier, General Merchant & Auctioneer serving departments and institutions across Bangladesh since 2012.`}
        services={services}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Government Contracting & Supply",
            provider: {
              "@type": "Organization",
              name: site.siteName,
              url: "https://a2itltd.com",
              logo: resolveLogoUrl(site.logoImage),
            },
            areaServed: {
              "@type": "Country",
              name: "Bangladesh",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Our Services",
              itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: service.title,
                  description: service.description,
                },
              })),
            },
          }),
        }}
      />
    </>
  );
}
