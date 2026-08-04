import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import RouteAwareChrome from "@/components/shared/RouteAwareChrome";
import { AuthProvider } from "@/context/AuthContext";
import LoadingProvider from "@/components/shared/LoadingProvider";
import { getSiteInfo, getContactInfo, resolveLogoUrl } from "@/lib/siteInfo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

// 🔹 Global SEO metadata, sourced from the dashboard-managed SiteSettings
export async function generateMetadata() {
  const site = await getSiteInfo();
  const title = `${site.siteName} | IT Services, Web Development, eCommerce & Digital Solutions`;

  return {
    title,
    description: `${site.siteName} provides IT services including web development, mobile apps, UI/UX design, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.`,
    icons: {
      icon: site.logoImage || "/A2ITLogo.png",
    },
    openGraph: {
      title,
      description: `Professional IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions from ${site.siteName}.`,
      url: "https://a2itltd.com",
      siteName: site.siteName,
      images: [
        {
          url: site.logoImage || "/A2ITLogo.png", // 👉 site-wide OG image
          width: 1200,
          height: 630,
          alt: `${site.siteName} - IT Services and Digital Solutions`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${site.siteName} offers IT services, web development, mobile apps, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions.`,
      images: [site.logoImage || "/A2ITLogo.png"],
    },
  };
}

export default async function RootLayout({ children }) {
  const [site, contact] = await Promise.all([getSiteInfo(), getContactInfo()]);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${workSans.variable} antialiased`}
      >
        <AuthProvider>
           <LoadingProvider>

          <RouteAwareChrome>{children}</RouteAwareChrome>
           </LoadingProvider>
        </AuthProvider>
        {/* 🔹 JSON-LD structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.siteName,
              url: "https://a2itltd.com",
              logo: resolveLogoUrl(site.logoImage),
              sameAs: [
                "https://www.facebook.com/",
                "https://www.linkedin.com/",
                "https://twitter.com/",
              ],
              description: `${site.siteName} provides IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.`,
              contactPoint: [
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
      </body>
    </html>
  );
}
