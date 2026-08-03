"use client";
import React, { useEffect, useState } from "react";
import WhoWeAreSection from "./WhoWeAreSection";
import MissionVisionSection from "./MissionVisionSection";
import BoardOfDirectorsSection from "./BoardOfDirectorsSection";
import OurStorySection from "./OurStorySection";

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setAbout(data.about || null);
      } catch (error) {
        console.error("Error fetching about page:", error);
      }
    };

    fetchAbout();
  }, []) ;

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            About <span className="text-[#0066ff]">Us</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-black mb-8 leading-relaxed">
              M/S. MD. RAKIB HASAN — a 1st Class Government Contractor,
              Supplier, General Merchant &amp; Auctioneer, proudly serving
              government departments and institutions across Bangladesh since
              2012.
            </p>
            <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-48 mx-auto mb-12"></div>
          </div>

          {/* Animated floating elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#00f0ff]/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#0066ff]/10 blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Scrolling animation trigger */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 rounded-3xl border-2 border-[#00f0ff] flex justify-center items-start p-2">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* 1. Who We Are */}
      <WhoWeAreSection data={about?.whoWeAre} />

      {/* 2. Mission & Vision */}
      <MissionVisionSection mission={about?.mission} vision={about?.vision} />

      {/* 3. Meet Our Board of Directors */}
      <BoardOfDirectorsSection members={about?.boardOfDirectors} />

      {/* 4. Our Story */}
      <OurStorySection data={about?.ourStory} />
    </div>
  );
};

export default About;
