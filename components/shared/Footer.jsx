"use client";
import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import Logo from "./Logo";

const SOCIAL_ICON_MAP = {
  facebook: FaFacebookF,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
};

const FALLBACK_FOOTER = {
  topBandImage: "",
  topBandEyebrow: "Let's Work Together",
  topBandHeading: "Ready to build your next digital product?",
  topBandSubtitle:
    "Tell us about your project and our team will get back to you within one business day.",
  topBandButtons: [
    { text: "Get In Touch", link: "/contact" },
    { text: "View Our Work", link: "/portfolio" },
  ],
  logoImage: "",
  tagline: "Transforming ideas into digital reality.",
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", url: "/" },
        { label: "Portfolio", url: "/portfolio" },
        { label: "About Us", url: "/about" },
        { label: "Blogs", url: "/blog" },
        { label: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Design & Development", url: "/services/category/development" },
        { label: "E-Commerce", url: "/services/e-commerce" },
        { label: "Amazon", url: "/services/category/ecommerce" },
        { label: "Shopify", url: "/services/shopify" },
        { label: "ERP System Development", url: "/services/erp" },
        { label: "SEO / SEM / PPC", url: "/services/seo" },
      ],
    },
  ],
  address: "Plot No 470, Road No 06, DOHS Mirpur, Dhaka",
  phone: "+8801846937397",
  email: "info@a2itltd.com",
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/A2ITLtd" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/a2itlimited/" },
  ],
  copyrightText: "© {year} A2IT Ltd. All Rights Reserved",
  legalLinks: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms of Service", url: "/terms-of-service" },
    { label: "Sitemap", url: "/contact" },
  ],
};

const Footer = () => {
  const [footer, setFooter] = useState(FALLBACK_FOOTER);

  useEffect(() => {
    let isMounted = true;

    const fetchFooter = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/footer`,
        );

        if (!response.ok) return;

        const data = await response.json();

        if (isMounted && data.footer) {
          setFooter({ ...FALLBACK_FOOTER, ...data.footer });
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
      }
    };

    fetchFooter();
    return () => {
      isMounted = false;
    };
  }, []);

  const copyrightText = (footer.copyrightText || FALLBACK_FOOTER.copyrightText).replace(
    "{year}",
    new Date().getFullYear(),
  );

  return (
    <footer className="rounded-t-3xl sm:rounded-t-[2.5rem] overflow-hidden bg-[var(--color-ink)] text-white/60">
      {/* Top hero band */}
      <div
        className="relative bg-[var(--color-ink)] bg-cover bg-center"
        style={
          footer.topBandImage
            ? { backgroundImage: `url(${footer.topBandImage})` }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-[var(--color-ink)]/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            {footer.topBandEyebrow && (
              <span className="eyebrow text-white/80 mb-3">
                {footer.topBandEyebrow}
              </span>
            )}
            {footer.topBandHeading && (
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {footer.topBandHeading}
              </h2>
            )}
            {footer.topBandSubtitle && (
              <p className="mt-3 text-white/60 max-w-xl">
                {footer.topBandSubtitle}
              </p>
            )}
          </div>

          {footer.topBandButtons?.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              {footer.topBandButtons.map((btn, index) =>
                btn.text && btn.link ? (
                  <Button
                    key={index}
                    href={btn.link}
                    variant="outline"
                    showArrow
                    className="text-foreground"
                  >
                    {btn.text}
                  </Button>
                ) : null,
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {footer.logoImage ? (
                <img src={footer.logoImage} alt="Logo" className="h-16 w-auto" />
              ) : (
                <Logo variant="light" />
              )}
            </div>
            {footer.tagline && (
              <p className="text-sm leading-relaxed">{footer.tagline}</p>
            )}
          </div>

          {(footer.columns || []).map((column, colIndex) => (
            <div key={colIndex}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-5">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {(column.links || []).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3 text-sm">
              {footer.address && (
                <div className="flex items-start gap-2.5">
                  <FaMapMarkerAlt className="text-[var(--color-primary)] mt-1 flex-shrink-0" />
                  <p>{footer.address}</p>
                </div>
              )}
              {footer.phone && (
                <div className="flex items-center gap-2.5">
                  <FaPhone className="text-[var(--color-primary)] flex-shrink-0" />
                  <a
                    href={`tel:${footer.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {footer.phone}
                  </a>
                </div>
              )}
              {footer.email && (
                <div className="flex items-center gap-2.5">
                  <FaEnvelope className="text-[var(--color-primary)] flex-shrink-0" />
                  <a
                    href={`mailto:${footer.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {footer.email}
                  </a>
                </div>
              )}
            </address>

            {footer.socialLinks?.length > 0 && (
              <div className="flex gap-3 mt-5">
                {footer.socialLinks.map((social, index) => {
                  const Icon =
                    SOCIAL_ICON_MAP[social.platform?.toLowerCase()] || FaGlobe;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6">
          <p className="text-xs text-white/40">{copyrightText}</p>
          <div className="flex gap-5">
            {(footer.legalLinks || []).map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
