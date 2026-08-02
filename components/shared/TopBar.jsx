"use client";
import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="bg-[var(--color-ink)] text-white/70 px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center text-xs">
      <div className="flex items-center gap-4 mb-1 sm:mb-0">
        <a
          href="tel:+8801846937397"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <FaPhoneAlt className="text-[10px]" />
          <span className="font-medium">+88 01846 937397</span>
        </a>
        <span className="hidden sm:inline text-white/20">|</span>
        <a
          href="mailto:info@a2itltd.com"
          className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <FaEnvelope className="text-[10px]" />
          <span className="font-medium">info@a2itltd.com</span>
        </a>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://www.facebook.com/A2ITLtd"
          className="hover:text-white transition-colors"
          aria-label="Facebook"
        >
          <FaFacebookF className="text-xs" />
        </a>
        <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
          <FaTwitter className="text-xs" />
        </a>
        <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
          <FaYoutube className="text-xs" />
        </a>
        <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
          <FaInstagram className="text-xs" />
        </a>
        <a
          href="https://www.linkedin.com/in/a2itlimited/"
          className="hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="text-xs" />
        </a>
      </div>
    </div>
  );
};

export default TopBar;
