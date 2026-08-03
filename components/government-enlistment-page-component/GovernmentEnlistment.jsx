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
} from "react-icons/fa";
import { GiBridge, GiWheat, GiFarmTractor } from "react-icons/gi";

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

const EnlistmentCard = ({ item }) => {
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
        <div className="flex flex-wrap items-center justify-center gap-2">
          {item.certificateFiles.map((file, index) => (
            <a
              key={file + index}
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm px-5 py-2 rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200"
            >
              View Certificate{item.certificateFiles.length > 1 ? ` ${index + 1}` : ""}{" "}
              <FaArrowRight className="text-xs" />
            </a>
          ))}
        </div>
      ) : (
        <span className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-body)] font-semibold text-sm px-5 py-2 rounded-md opacity-60 cursor-not-allowed">
          Certificate coming soon
        </span>
      )}
    </div>
  );
};

const GovernmentEnlistment = () => {
  const [data, setData] = useState(null);

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

      {items.length > 0 && (
        <section className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {items.map((item, index) => (
              <EnlistmentCard key={item.name || index} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GovernmentEnlistment;
