"use client";
import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import Logo from "./Logo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) throw new Error("Subscription failed");

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
    }
  };

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
    { name: "Design & Development", path: "/services/category/development" },
    { name: "E-Commerce", path: "/services/e-commerce" },
    { name: "Amazon", path: "/services/category/ecommerce" },
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
    <footer className="rounded-t-3xl sm:rounded-t-[2.5rem] overflow-hidden bg-[var(--color-ink)] text-white/60">
      <div className="bg-[var(--color-ink-2)] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="eyebrow text-[var(--color-primary)] mb-3">
              Stay In The Loop
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-sm text-white/50 max-w-md">
              Get product updates, industry insights, and company news
              delivered straight to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto shrink-0"
          >
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 p-1.5 focus-within:border-[var(--color-primary)] transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your email"
                className="w-full md:w-64 bg-transparent px-3.5 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
              >
                {status === "success" ? (
                  <>
                    <FiCheck /> Subscribed
                  </>
                ) : (
                  <>
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>

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
