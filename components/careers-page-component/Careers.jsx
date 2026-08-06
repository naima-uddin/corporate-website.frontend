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

const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
    <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-full mb-2 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse" />
  </div>
);

const ApplyButton = ({ job }) =>
  (job.applyLink || job.applyEmail) && (
    <a
      href={
        job.applyLink
          ? normalizeUrl(job.applyLink)
          : `mailto:${job.applyEmail}`
      }
      target={job.applyLink ? "_blank" : undefined}
      rel={job.applyLink ? "noopener noreferrer" : undefined}
      className="group shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold transition-colors hover:opacity-90"
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
  );

const JobCard = ({ job, index, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 md:p-8"
  >
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="min-w-0">
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

      <ApplyButton job={job} />
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

  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black min-h-[60vh]">
      <section className="container mx-auto px-6 py-16 text-center">
        <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-primary)]">
          Careers
        </span>
        <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold mt-3 mb-6 leading-tight text-[#0a1a3c]">
          Job Opportunities
        </h1>
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <p className="text-base md:text-lg text-[var(--color-body)] max-w-2xl mx-auto leading-relaxed">
          We foster a culture where people with a can-do attitude can be a
          part of our growing team. Check back here for our current
          openings.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-20 max-w-4xl">
        {loading ? (
          <div className="space-y-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-6">
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
          <div className="text-center bg-white rounded-2xl border border-dashed border-[var(--color-border)] py-20 px-6">
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
