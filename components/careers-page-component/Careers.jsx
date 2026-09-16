"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Mail,
  X,
} from "lucide-react";
import { BlogSkeleton } from "@/components/shared/PageSkeletons";

const formatDeadline = (deadline) => {
  if (!deadline) return "";
  return new Date(deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const normalizeUrl = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const isJobExpired = (deadline) => {
  if (!deadline) return false;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return new Date(deadline) < startOfToday;
};

const ApplyButton = ({ job, expired }) =>
  (job.applyLink || job.applyEmail) &&
  (expired ? (
    <span className="shrink-0 inline-flex w-full md:w-auto items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed">
      Applications Closed
    </span>
  ) : (
    <a
      href={
        job.applyLink
          ? normalizeUrl(job.applyLink)
          : `mailto:${job.applyEmail}`
      }
      target={job.applyLink ? "_blank" : undefined}
      rel={job.applyLink ? "noopener noreferrer" : undefined}
      className="group shrink-0 inline-flex w-full md:w-auto items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold transition-colors hover:opacity-90"
    >
      {job.applyLink ? (
        <>
          Apply Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </>
      ) : (
        <>
          Apply via Email
          <Mail className="w-4 h-4" />
        </>
      )}
    </a>
  ));

const JobCard = ({ job, index, onViewDetails }) => {
  const expired = isJobExpired(job.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-300 px-4 py-5 md:p-8 ${
        expired ? "border-[var(--color-border)] opacity-70" : "border-[var(--color-border)]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-xl md:text-2xl font-bold text-[#0a1a3c]">
              {job.title}
            </h3>
            {expired && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500">
                Expired
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-body,#555)]">
            {job.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                {job.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
              {job.jobType}
            </span>
            {job.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                {expired
                  ? `Closed on ${formatDeadline(job.deadline)}`
                  : `Apply before ${formatDeadline(job.deadline)}`}
              </span>
            )}
          </div>
        </div>

        <ApplyButton job={job} expired={expired} />
      </div>

      {job.description && (
        <p className="mt-5 text-sm md:text-base leading-relaxed text-[var(--color-body,#555)] whitespace-pre-line line-clamp-3">
          {job.description}
        </p>
      )}

      {job.description && (
        <button
          type="button"
          onClick={() => onViewDetails(job)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          See Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
};

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-5 md:p-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0a1a3c] mb-2">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-body,#555)]">
              {job.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  {job.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
                {job.jobType}
              </span>
              {job.deadline && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  Apply before {formatDeadline(job.deadline)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <p className="text-sm md:text-base leading-relaxed text-[var(--color-body,#555)] whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="border-t border-[var(--color-border)] p-5 md:p-6">
          <ApplyButton job={job} />
        </div>
      </div>
    </div>
  );
};

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-opportunities`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (error) {
        console.error("Error fetching job opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black min-h-[60vh]">
      <section className="container mx-auto px-3 sm:px-6 py-5 md:py-16 text-center">
        <span className="uppercase tracking-widest text-xs sm:text-sm font-bold text-[var(--color-primary)]">
          Careers
        </span>
        <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold mt-2 md:mt-3 mb-4 md:mb-6 leading-tight text-[#0a1a3c]">
          Job Opportunities
        </h1>
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-5 md:mb-8">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <p className="text-sm md:text-lg text-[var(--color-body)] max-w-2xl mx-auto leading-relaxed">
          We foster a culture where people with a can-do attitude can be a
          part of our growing team. Check back here for our current
          openings.
        </p>
      </section>

      <section className="container mx-auto px-2 sm:px-4 pb-12 md:pb-20 max-w-4xl">
        {jobs.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {jobs.map((job, index) => (
              <JobCard
                key={job._id || index}
                job={job}
                index={index}
                onViewDetails={setActiveJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-2xl border border-dashed border-[var(--color-border)] py-12 md:py-20 px-6">
            <p className="text-lg md:text-xl font-semibold text-[#0a1a3c] mb-2">
              No current job opportunities right now
            </p>
            <p className="text-sm md:text-base text-[var(--color-body,#555)]">
              Please check back later — new openings will be posted here as
              soon as they become available.
            </p>
          </div>
        )}
      </section>

      <JobDetailsModal job={activeJob} onClose={() => setActiveJob(null)} />
    </div>
  );
};

export default Careers;
