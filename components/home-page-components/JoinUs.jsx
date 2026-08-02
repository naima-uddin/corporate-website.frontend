"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const KnowMoreButton = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide border border-[var(--color-border)] text-[var(--color-heading)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${className}`}
  >
    {children}
  </Link>
);

const JoinUs = () => {
  const [settings, setSettings] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchJoinUs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/join-us`,
        );

        if (!response.ok) return;

        const data = await response.json();

        if (isMounted) {
          setSettings(data.settings || null);
          setCards(data.cards || []);
        }
      } catch (error) {
        console.error("Error fetching Join Us section:", error);
      }
    };

    fetchJoinUs();
    return () => {
      isMounted = false;
    };
  }, []);

  if (cards.length === 0) return null;

  const [featured, ...rest] = cards;

  const renderCard = (card, isFeatured) => {
    const content = (
      <>
        <img
          src={card.image}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
          <span className="text-base sm:text-lg font-semibold text-white">
            {card.title}
          </span>
          {isFeatured && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-white"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
        </div>
      </>
    );

    const className = `group relative block h-64 sm:h-80 lg:h-[26rem] overflow-hidden rounded-md transition-transform duration-300 hover:-translate-y-1 ${
      isFeatured ? "flex-[2]" : "flex-1"
    }`;

    if (card.link) {
      return (
        <Link key={card._id} href={card.link} className={className}>
          {content}
        </Link>
      );
    }

    return (
      <div key={card._id} className={className}>
        {content}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
          <SectionHeading
            eyebrow={null}
            title={settings?.heading || "Join Us"}
            subtitle={settings?.subtitle}
            align="left"
            className="mb-0"
          />
          {settings?.buttonText && settings?.buttonLink && (
            <KnowMoreButton
              href={settings.buttonLink}
              className="mb-2 hidden md:inline-flex"
            >
              {settings.buttonText}
            </KnowMoreButton>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 lg:gap-5">
          {renderCard(featured, true)}
          {rest.map((card) => renderCard(card, false))}
        </div>

        {settings?.buttonText && settings?.buttonLink && (
          <div className="mt-8 text-center md:hidden">
            <KnowMoreButton href={settings.buttonLink}>
              {settings.buttonText}
            </KnowMoreButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default JoinUs;
