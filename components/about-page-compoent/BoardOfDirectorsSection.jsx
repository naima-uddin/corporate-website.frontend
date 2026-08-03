"use client";

import React from "react";
import { motion } from "framer-motion";
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

const MemberCard = ({ member, index }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="w-60 md:w-68 shrink-0"
  >
    <div className="border border-[#00f0ff]/20 rounded-lg overflow-hidden shadow-lg hover:border-[#00f0ff]/40 hover:shadow-xl transition-all duration-300">
      <div className="relative h-50 md:h-58 bg-slate-100">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/20 to-[#0066ff]/20">
            <span className="text-3xl font-bold text-[#0066ff]">
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>
      <div className="bg-[#0a0a12] text-center py-2.5 px-2">
        <p className="text-[#00f0ff] font-semibold text-xs sm:text-sm truncate">
          {member.name}
        </p>
        <p className="text-[#ffb020] text-[11px] sm:text-xs truncate">
          {member.title}
        </p>
      </div>
    </div>
  </MotionDiv>
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
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Meet Our <span className="text-[#006dff]">Board of Directors</span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-24 md:w-32 mx-auto mb-4 md:mb-6"></div>
        </MotionDiv>

        <div className="flex flex-col items-center gap-8 md:gap-10">
          {rowNumbers.map((rowNumber) => (
            <div
              key={rowNumber}
              className="flex flex-wrap justify-center gap-6 md:gap-8"
            >
              {rows[rowNumber].map((member, index) => (
                <MemberCard key={index} member={member} index={index} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectorsSection;
