"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MemberCard } from "./BoardOfDirectorsSection";

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

const BoardOfDirectorsFull = () => {
  const [members, setMembers] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setMembers(data.about?.boardOfDirectors || []);
      } catch (error) {
        console.error("Error fetching board of directors:", error);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section className="py-16 px-4 md:px-16 bg-white text-black min-h-[60vh]">
      <div className="max-w-6xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Meet Our <span className="text-[#0066ff]">Board of Directors</span>
          </h1>
        </MotionDiv>

        {members === null ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-slate-500 text-sm">No board members yet.</p>
        ) : (
          <div className="flex flex-wrap divide-x divide-slate-200 bg-white border border-slate-200">
            {members.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BoardOfDirectorsFull;
