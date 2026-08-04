"use client";
import React, { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const SOCIAL_ICON_MAP = {
  facebook: FaFacebookF,
  twitter: FaTwitter,
  x: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

const FALLBACK_CONTACT = {
  phone: "+880 1711-270825 (Mobile) / +880 2-9833330 (Landline)",
  email: "msmdrakibhasan1992@gmail.com",
};

const FALLBACK_SOCIAL_LINKS = [
  { platform: "facebook", url: "#" },
  { platform: "twitter", url: "#" },
  { platform: "youtube", url: "#" },
  { platform: "instagram", url: "#" },
  { platform: "linkedin", url: "#" },
];

const TopBar = () => {
  const [contact, setContact] = useState(FALLBACK_CONTACT);
  const [socialLinks, setSocialLinks] = useState(FALLBACK_SOCIAL_LINKS);

  useEffect(() => {
    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.settings) {
          setContact((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/footer`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.footer?.socialLinks?.length) {
          setSocialLinks(data.footer.socialLinks);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const primaryPhone = contact.phone.split("/")[0].trim();
  const telHref = `tel:${primaryPhone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="bg-[var(--color-ink)] text-white/70 px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center text-xs">
      <div className="flex items-center gap-4 mb-1 sm:mb-0">
        <a
          href={telHref}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <FaPhoneAlt className="text-[10px]" />
          <span className="font-medium">{contact.phone}</span>
        </a>
        <span className="hidden sm:inline text-white/20">|</span>
        <a
          href={`mailto:${contact.email}`}
          className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <FaEnvelope className="text-[10px]" />
          <span className="font-medium">{contact.email}</span>
        </a>
      </div>

      <div className="flex items-center gap-3">
        {socialLinks.map((link) => {
          const Icon = SOCIAL_ICON_MAP[link.platform?.toLowerCase()];
          if (!Icon) return null;
          return (
            <a
              key={link.platform}
              href={link.url || "#"}
              className="hover:text-white transition-colors"
              aria-label={link.platform}
            >
              <Icon className="text-xs" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default TopBar;
