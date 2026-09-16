"use client";
import React from "react";
import { FaFileContract } from "react-icons/fa";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

const TermsOfService = () => {
  return (
    <LegalPageLayout
      sectionKey="termsOfService"
      icon={<FaFileContract className="text-white" />}
      defaultTitle="Terms of Service"
    />
  );
};

export default TermsOfService;
