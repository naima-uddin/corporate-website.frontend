import React from "react";
import {
  FaSchool,
  FaHospital,
  FaTree,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { GiBridge, GiWheat, GiFarmTractor } from "react-icons/gi";

const CERTIFICATE_PDF = "/RakibHasanPortfolio.pdf";

const enlistments = [
  {
    name: "Education Engineering Department (EED)",
    icon: FaSchool,
  },
  {
    name: "Health Engineering Department (HED)",
    icon: FaHospital,
  },
  {
    name: "Public Works Department (PWD)",
    icon: GiBridge,
  },
  {
    name: "Bangladesh Agricultural Development Corporation (BADC)",
    icon: GiFarmTractor,
  },
  {
    name: "Directorate General of Food",
    icon: GiWheat,
  },
  {
    name: "Forest Department",
    icon: FaTree,
  },
  {
    name: "Price and Market Information Office",
    icon: FaChartLine,
  },
];

const EnlistmentCard = ({ name, icon: Icon }) => (
  <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-shadow duration-300 p-8">
    <div className="w-20 h-20 rounded-full bg-[#eaf2ff] flex items-center justify-center mb-5">
      <Icon className="text-3xl text-[#0a2a6b]" />
    </div>
    <h3 className="text-lg font-bold text-[#0a1a3c] mb-4 min-h-[3.5rem] flex items-center">
      {name}
    </h3>
    <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
      <FaCheckCircle /> ENLISTED
    </span>
    <a
      href={CERTIFICATE_PDF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm px-5 py-2 rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200"
    >
      View Certificate <FaArrowRight className="text-xs" />
    </a>
  </div>
);

const GovernmentEnlistment = () => {
  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black">
      <section className="container mx-auto px-6 py-16 text-center">
        <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-primary)]">
          Our Credentials
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-6 leading-tight text-[#0a1a3c]">
          Government Enlistment
        </h1>
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <p className="text-base md:text-lg text-[var(--color-body)] max-w-2xl mx-auto leading-relaxed">
          We are enlisted with various government departments and
          organizations. Our registrations reflect our credibility,
          compliance and commitment to quality.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {enlistments.map((item) => (
            <EnlistmentCard key={item.name} name={item.name} icon={item.icon} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GovernmentEnlistment;
