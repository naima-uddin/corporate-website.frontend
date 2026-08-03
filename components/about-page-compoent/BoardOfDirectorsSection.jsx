"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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

export const MemberCard = ({ member }) => (
  <div className="flex-1 min-w-[160px] px-2 py-2 md:px-4 md:py-4">
    <div className="relative h-40 sm:h-48 w-full overflow-hidden  bg-slate-100 mb-4">
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

  const preview = members.slice(0, 4);

  return (
    <section className="py-16 px-4 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Meet Our <span className="text-[#0066ff]">Board of Directors</span>
          </h2>

          {members.length > 4 && (
            <Link
              href="/board-of-directors"
              className="shrink-0 inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-black hover:border-[#0066ff] hover:text-[#0066ff] transition-colors"
            >
              View All
            </Link>
          )}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap divide-x divide-slate-200 bg-white border border-slate-200"
        >
          {preview.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

export default BoardOfDirectorsSection;
