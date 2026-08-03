"use client";
import React from "react";
import { PiTarget } from "react-icons/pi";
import { FiEye } from "react-icons/fi";

const MissionVisionSection = ({ mission, vision }) => {
  if (!mission && !vision) return null;

  return (
    <section className="relative px-6 md:px-20 py-16 bg-white text-black border-t border-[#00f0ff]/20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {mission && (
          <div className="relative rounded-xl border border-[#00f0ff]/20 p-8 shadow-xl hover:border-[#00f0ff]/40 transition-all duration-300">
            <div className="flex items-center gap-2 text-[#0066ff] mb-4">
              <PiTarget className="text-2xl" />
              <span className="uppercase tracking-widest text-sm font-medium">
                {mission.label || "Our Mission"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
              {mission.heading}
            </h2>
            <p className="text-black text-lg leading-relaxed">{mission.body}</p>
          </div>
        )}

        {vision && (
          <div className="relative rounded-xl border border-[#00f0ff]/20 p-8 shadow-xl hover:border-[#00f0ff]/40 transition-all duration-300">
            <div className="flex items-center gap-2 text-[#0066ff] mb-4">
              <FiEye className="text-2xl" />
              <span className="uppercase tracking-widest text-sm font-medium">
                {vision.label || "Our Vision"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
              {vision.heading}
            </h2>
            <p className="text-black text-lg leading-relaxed">{vision.body}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionVisionSection;
