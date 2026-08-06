"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
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

export const SpeechModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-lg border border-slate-200 p-6"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 pr-6">
            {member.image ? (
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/15 to-[#0066ff]/15">
                <span className="text-sm font-bold text-[#0066ff]">
                  {initials(member.name)}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-black uppercase tracking-tight">
                {member.name}
              </p>
              <p className="text-slate-500 text-sm">{member.title}</p>
            </div>
          </div>

          <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
            {member.speech}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const MemberCard = ({ member, onOpenSpeech }) => {
  const hasSpeech = Boolean(member.speech && member.speech.trim());

  return (
    <div className="flex-1 min-w-[160px] px-0.5  md:px-1">
      <div className="relative h-44 md:h-62 w-full overflow-hidden   mb-2">
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

      <div
        className={`flex items-center gap-1.5 ${
          hasSpeech ? "cursor-pointer group" : ""
        }`}
        onClick={hasSpeech ? () => onOpenSpeech?.(member) : undefined}
      >
        <p className="font-bold text-sm sm:text-base text-black uppercase tracking-tight truncate">
          {member.name}
        </p>
        {hasSpeech && (
          <ArrowRight className="w-3.5 h-3.5 text-black shrink-0 group-hover:text-[#0066ff] transition-colors" />
        )}
      </div>
      <p className="text-slate-500 text-xs sm:text-sm mt-1">{member.title}</p>
    </div>
  );
};

const BoardOfDirectorsSection = ({ members }) => {
  const [activeMember, setActiveMember] = useState(null);

  if (!Array.isArray(members) || members.length === 0) return null;

  const preview = members.slice(0, 4);

  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-8 md:mb-10"
        >
          <h2 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
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
            <MemberCard
              key={index}
              member={member}
              onOpenSpeech={setActiveMember}
            />
          ))}
        </MotionDiv>
      </div>

      <SpeechModal member={activeMember} onClose={() => setActiveMember(null)} />
    </section>
  );
};

export default BoardOfDirectorsSection;
