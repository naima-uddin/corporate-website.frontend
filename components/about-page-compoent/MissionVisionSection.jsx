"use client";
import React from "react";
import { PiTarget } from "react-icons/pi";
import { FiEye } from "react-icons/fi";
import Image from "next/image";

const Card = ({ data, Icon, fallbackLabel }) => (
  <div className="group rounded-xl border border-[#00f0ff]/20 overflow-hidden shadow-xl hover:border-[#00f0ff]/40 transition-all duration-300 bg-white">
    {data.image && (
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <Image
          src={data.image}
          alt={data.heading || data.label || fallbackLabel}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    )}

    <div className="p-8">
      <div className="flex items-center gap-2 text-[#0066ff] mb-4">
        <Icon className="text-2xl" />
        <span className="uppercase tracking-widest text-sm font-medium">
          {data.label || fallbackLabel}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
        {data.heading}
      </h2>
      <p className="text-black text-lg leading-relaxed">{data.body}</p>
    </div>
  </div>
);

const MissionVisionSection = ({ mission, vision }) => {
  if (!mission && !vision) return null;

  return (
    <section className="relative px-6 md:px-20 py-16 bg-white text-black border-t border-[#00f0ff]/20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {mission && (
          <Card data={mission} Icon={PiTarget} fallbackLabel="Our Mission" />
        )}
        {vision && <Card data={vision} Icon={FiEye} fallbackLabel="Our Vision" />}
      </div>
    </section>
  );
};

export default MissionVisionSection;
