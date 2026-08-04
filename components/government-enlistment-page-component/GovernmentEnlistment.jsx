"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaSchool,
  FaHospital,
  FaTree,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaCertificate,
  FaTimes,
} from "react-icons/fa";
import { GiBridge, GiWheat, GiFarmTractor } from "react-icons/gi";

const isPdfFile = (url) => (url || "").toLowerCase().endsWith(".pdf");

const FALLBACK_ICONS = [
  { match: /education/i, icon: FaSchool },
  { match: /health/i, icon: FaHospital },
  { match: /public works|bridge/i, icon: GiBridge },
  { match: /agricultural|badc/i, icon: GiFarmTractor },
  { match: /food/i, icon: GiWheat },
  { match: /forest/i, icon: FaTree },
  { match: /price|market/i, icon: FaChartLine },
];

const getFallbackIcon = (name = "") => {
  const match = FALLBACK_ICONS.find((entry) => entry.match.test(name));
  return match ? match.icon : FaCertificate;
};

const EnlistmentCard = ({ item, onViewCertificates }) => {
  const Icon = getFallbackIcon(item.name);

  return (
    <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-shadow duration-300 p-8">
      <div className="relative w-20 h-20 rounded-full bg-[#eaf2ff] flex items-center justify-center mb-5 overflow-hidden">
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <Icon className="text-3xl text-[#0a2a6b]" />
        )}
      </div>
      <h3 className="text-lg font-bold text-[#0a1a3c] mb-4 min-h-[3.5rem] flex items-center">
        {item.name}
      </h3>
      <span
        className={`inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 ${
          item.enlisted ? "bg-emerald-600" : "bg-slate-400"
        }`}
      >
        {item.enlisted ? <FaCheckCircle /> : <FaTimesCircle />}
        {item.enlisted ? "ENLISTED" : "NOT ENLISTED"}
      </span>
      {Array.isArray(item.certificateFiles) && item.certificateFiles.length > 0 ? (
        <button
          type="button"
          onClick={() => onViewCertificates(item)}
          className="inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm px-5 py-2 rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200"
        >
          View Certificates <FaArrowRight className="text-xs" />
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-body)] font-semibold text-sm px-5 py-2 rounded-md opacity-60 cursor-not-allowed">
          Certificate coming soon
        </span>
      )}
    </div>
  );
};

const CertificatesModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <h3 className="text-lg font-bold text-[#0a1a3c]">{item.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {item.certificateFiles.map((file, index) =>
            isPdfFile(file) ? (
              <iframe
                key={file + index}
                src={file}
                title={`${item.name} certificate ${index + 1}`}
                className="w-full h-[70vh] rounded-lg border border-[var(--color-border)]"
              />
            ) : (
              <img
                key={file + index}
                src={file}
                alt={`${item.name} certificate ${index + 1}`}
                className="w-full rounded-lg border border-[var(--color-border)]"
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

const EnlistmentCardSkeleton = () => (
  <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
    <div className="w-20 h-20 rounded-full bg-gray-200 mb-5 animate-pulse" />
    <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse" />
    <div className="h-6 bg-gray-200 rounded-full w-24 mb-5 animate-pulse" />
    <div className="h-9 bg-gray-200 rounded-md w-32 animate-pulse" />
  </div>
);

const GovernmentEnlistment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/government-enlistment`,
        );
        if (!response.ok) return;
        const result = await response.json();
        setData(result.governmentEnlistment || null);
      } catch (error) {
        console.error("Error fetching government enlistment page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black">
      <section className="container mx-auto px-6 py-16 text-center">
        <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-primary)]">
          {data?.label || "Our Credentials"}
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6 leading-tight text-[#0a1a3c]">
          {data?.heading || "Government Enlistment"}
        </h1>
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <p className="text-base md:text-lg text-[var(--color-body)] max-w-2xl mx-auto leading-relaxed">
          {data?.description ||
            "We are enlisted with various government departments and organizations. Our registrations reflect our credibility, compliance and commitment to quality."}
        </p>
      </section>

      {loading ? (
        <section className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <EnlistmentCardSkeleton key={item} />
            ))}
          </div>
        </section>
      ) : (
        items.length > 0 && (
          <section className="container mx-auto px-6 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {items.map((item, index) => (
                <EnlistmentCard
                  key={item.name || index}
                  item={item}
                  onViewCertificates={setActiveItem}
                />
              ))}
            </div>
          </section>
        )
      )}

      <CertificatesModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
};

export default GovernmentEnlistment;
