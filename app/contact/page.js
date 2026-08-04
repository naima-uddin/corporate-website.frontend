import ContactUsWrapper from "@/components/contact-page-component/ContactUsWrapper";
import React from "react";
import { getSiteInfo, getContactInfo, resolveLogoUrl } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    metadataBase: new URL("https://a2itltd.com"),
    title: `Contact Us | ${site.siteName} | Get in Touch`,
    description: `Get in touch with ${site.siteName} for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.`,
    keywords: [
      `Contact ${site.siteName}`,
      "IT Services Inquiry",
      "Web Development Contact",
      "eCommerce Consultation",
      "Digital Marketing Contact",
      "Shopify Contact",
      "Amazon Services Inquiry",
    ],
    alternates: {
      canonical: "https://a2itltd.com/contact",
    },
    openGraph: {
      title: `Contact Us | ${site.siteName} | Get in Touch`,
      description: `Reach out to ${site.siteName} for any queries regarding web development, mobile apps, eCommerce, Shopify, Amazon, or digital marketing services.`,
      url: "https://a2itltd.com/contact",
      siteName: site.siteName,
      images: [
        {
          url: "/og-contact.jpg", // Place this in /public
          width: 1200,
          height: 630,
          alt: `Contact ${site.siteName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Contact Us | ${site.siteName} | Get in Touch`,
      description: `Contact ${site.siteName} for inquiries about IT services, web development, eCommerce, Shopify, Amazon, and digital marketing solutions.`,
      images: ["/og-contact.jpg"],
    },
  };
}

export default async function Page() {
  const [site, contact] = await Promise.all([getSiteInfo(), getContactInfo()]);

  return (
    <>
      <ContactUsWrapper />

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us",
            url: "https://a2itltd.com/contact",
            description: `Get in touch with ${site.siteName} for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.`,
            publisher: {
              "@type": "Organization",
              name: site.siteName,
              url: "https://a2itltd.com",
              logo: resolveLogoUrl(site.logoImage),
            },
            contactOption: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: contact.phone,
                email: contact.email,
                areaServed: "Worldwide",
              },
            ],
          }),
        }}
      />
    </>
  );
}
