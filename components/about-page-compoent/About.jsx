"use client";
import React, { useEffect, useState } from "react";
import WhoWeAreSection from "./WhoWeAreSection";
import MissionVisionSection from "./MissionVisionSection";
import BoardOfDirectorsSection from "./BoardOfDirectorsSection";
import OurStorySection from "./OurStorySection";
import AwardsSection from "./AwardsSection";

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
     

      {/* 1. Who We Are */}
      <WhoWeAreSection data={about?.whoWeAre} />

      {/* 2. Mission & Vision */}
      <MissionVisionSection mission={about?.mission} vision={about?.vision} />

      {/* 3. Meet Our Board of Directors */}
      <BoardOfDirectorsSection members={about?.boardOfDirectors} />

      {/* 4. Our Story */}
      <OurStorySection data={about?.ourStory} />

      {/* Awards & Accolades */}
      <AwardsSection awards={about?.awards} />
    </div>
  );
};

export default About;
