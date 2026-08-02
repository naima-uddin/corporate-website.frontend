"use client";
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  const routes = {
    HOME: "/",
    PORTFOLIO: "/portfolio",
    ABOUT: "/about",
    BLOGS: "/blog",
    PRIVACY: "/privacy-policy",
    TERMS: "/terms-of-service",
    SITEMAP: "/contact",
    CONTACT: "/contact",
  };

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://www.facebook.com/A2ITLtd" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
    { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/in/a2itlimited/" },
  ];

  const quickLinks = [
    { name: "Home", path: routes.HOME },
    { name: "Portfolio", path: routes.PORTFOLIO },
    { name: "About Us", path: routes.ABOUT },
    { name: "Blogs", path: routes.BLOGS },
    { name: "Contact", path: routes.CONTACT },
  ];

  const serviceLinks = [
    { name: "Design & Development", path: "/services/design-development" },
    { name: "E-Commerce", path: "/services/e-commerce" },
    { name: "Amazon", path: "/services/amazon" },
    { name: "Shopify", path: "/services/shopify" },
    { name: "ERP System Development", path: "/services/erp" },
    { name: "SEO / SEM / PPC", path: "/services/seo" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", path: routes.PRIVACY },
    { name: "Terms of Service", path: routes.TERMS },
    { name: "Sitemap", path: routes.SITEMAP },
  ];

  return (
    <footer className="bg-[var(--color-ink)] text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-white font-semibold mb-2">Build Your Dreams</p>
            <p className="text-sm leading-relaxed">
              Transforming ideas into digital reality.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-5">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-[var(--color-primary)] mt-1 flex-shrink-0" />
                <p>
                  Plot No 470
                  <br />
                  Road No 06
                  <br />
                  DOHS Mirpur, Dhaka
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="tel:+8801846937397" className="hover:text-white transition-colors">
                  +880 1846-937397
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-[var(--color-primary)] flex-shrink-0" />
                <a href="mailto:info@a2itltd.com" className="hover:text-white transition-colors">
                  info@a2itltd.com
                </a>
              </div>
            </address>

            <div className="flex gap-3 mt-5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} A2IT Ltd. All Rights Reserved
          </p>
          <div className="flex gap-5">
            {policyLinks.map((policy) => (
              <a
                key={policy.name}
                href={policy.path}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {policy.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
