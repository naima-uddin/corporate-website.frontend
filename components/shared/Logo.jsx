"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK_LOGO = "/logo.png";
const FALLBACK_NAME = "Rakibhasan";

const Logo = ({ variant = "default", className = "", showName = true }) => {
  const [settings, setSettings] = useState({
    logoImage: "",
    siteName: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`,
        );

        if (!response.ok) return;

        const data = await response.json();

        if (isMounted && data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const logoSrc = settings.logoImage || FALLBACK_LOGO;
  const siteName = settings.siteName || FALLBACK_NAME;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={logoSrc}
        alt={siteName}
        width={120}
        height={40}
        className={`h-8 w-auto ${variant === "light" ? "brightness-0 invert" : ""}`}
        unoptimized
      />
      {showName && (
        <span
          className={`text-lg font-bold leading-none whitespace-nowrap ${
            variant === "light" ? "text-white" : "text-[var(--color-heading)]"
          }`}
        >
          {siteName}
        </span>
      )}
    </div>
  );
};

export default Logo;
