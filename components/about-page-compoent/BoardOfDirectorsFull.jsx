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
          <div className="flex flex-wrap divide-x divide-slate-200 bg-white border border-slate-200">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-full sm:w-1/2 lg:w-1/4 p-6 space-y-3">
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
                <div className="h-3 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
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
