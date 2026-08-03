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

const TeamSection = ({ members }) => {
  if (!Array.isArray(members) || members.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-16 bg-white shadow-2xl mt-4">
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Meet Our <span className="text-[#006dff]">Team</span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-24 md:w-32 mx-auto mb-4 md:mb-6"></div>
          <p className="max-w-2xl mx-auto text-sm text-black px-4">
            The people behind our success and daily operations
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {members.map((member, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl overflow-hidden border shadow-2xl border-[#00f0ff]/20 hover:border-[#00f0ff]/40 transition-all duration-300"
            >
              <div className="md:flex">
                <div className="md:w-6/12 relative">
                  <div className="relative overflow-hidden h-64 md:h-full">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={400}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/20 to-[#0066ff]/20">
                        <span className="text-4xl font-bold text-[#0066ff]">
                          {initials(member.name)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00f0ff]/40 to-transparent hidden md:block"></div>
                </div>

                <div className="md:w-6/12 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#006dff] mb-3 md:mb-4 text-sm md:text-base font-bold">
                    {member.title}
                  </p>
                  <p className="text-black mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                    {member.bio}
                  </p>
                  {member.quote && (
                    <div className="border-l-2 border-[#00f0ff] pl-3 md:pl-4 italic text-black text-sm md:text-base">
                      &quot;{member.quote}&quot;
                    </div>
                  )}
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
