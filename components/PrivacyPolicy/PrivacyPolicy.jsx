"use client";
import React from "react";
import { FaShieldAlt } from "react-icons/fa";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      sectionKey="privacyPolicy"
      icon={<FaShieldAlt className="text-white" />}
      defaultTitle="Privacy Policy"
    />
  );
};

export default PrivacyPolicy;
