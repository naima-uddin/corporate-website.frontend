"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const MotionDiv =
  motion?.div ||
  (({
    children,
    initial,
    whileInView,
    transition,
    whileHover,
    whileTap,
    ...props
  }) => <div {...props}>{children}</div>);

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const MemberCard = ({ member }) => (
  <div className="flex-1 min-w-[160px] px-5 py-5 sm:px-6 sm:py-6">
    <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-md bg-slate-100 mb-4">
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/15 to-[#0066ff]/15">
          <span className="text-2xl font-bold text-[#0066ff]">
            {initials(member.name)}
          </span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-1.5">
      <p className="font-bold text-sm sm:text-base text-black uppercase tracking-tight truncate">
        {member.name}
      </p>
      <ArrowRight className="w-3.5 h-3.5 text-black shrink-0" />
    </div>
    <p className="text-slate-500 text-xs sm:text-sm mt-1">{member.title}</p>
  </div>
);

const BoardOfDirectorsSection = ({ members }) => {
  if (!Array.isArray(members) || members.length === 0) return null;

  const rows = members.reduce((acc, member) => {
    const rowNumber = member.row || 1;
    if (!acc[rowNumber]) acc[rowNumber] = [];
    acc[rowNumber].push(member);
    return acc;
  }, {});

  const rowNumbers = Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <section className="py-16 px-4 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Meet Our <span className="text-[#0066ff]">Board of Directors</span>
          </h2>
        </MotionDiv>

        <div className="flex flex-col gap-4">
          {rowNumbers.map((rowNumber) => (
            <MotionDiv
              key={rowNumber}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap divide-x divide-slate-200 bg-white border border-slate-200"
            >
              {rows[rowNumber].map((member, index) => (
                <MemberCard key={index} member={member} />
              ))}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectorsSection;
