"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/shared/TopBar";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default function RouteAwareChrome({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const isThankYouRoute =
    pathname === "/thank-you" || pathname === "/thank-you/";

  if (isDashboardRoute || isThankYouRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
