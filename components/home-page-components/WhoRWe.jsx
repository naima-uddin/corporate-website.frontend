"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import StatCounter from "@/components/ui/StatCounter";

const stats = [
  { value: 5, label: "Years of Excellence" },
  { value: 200, label: "Projects Delivered" },
  { value: 100, label: "Clients Worldwide" },
  { value: 15, label: "Team Members" },
];

const WhoRWe = () => {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow mb-4">Who We Are</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-heading)] mb-6">
              What is A2IT?
            </h2>
            <div className="space-y-4 text-[var(--color-body)] text-base md:text-lg leading-relaxed">
              <p>
                A2IT is a service provider of business-minded, well-focused
                young IT professionals — built on a passion for solving real
                business problems through technology.
              </p>
              <p>
                We provide quality, expedient services and understand our
                clients&apos; needs from launch to scale. Our teams across web
                development, e-commerce, design and digital marketing craft
                clean, unique and resourceful work you can rely on.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <a
                href="https://www.facebook.com/A2ITLtd"
                className="w-10 h-10 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/a2itlimited/"
                className="w-10 h-10 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-10"
          >
            <StatCounter stats={stats} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoRWe;
