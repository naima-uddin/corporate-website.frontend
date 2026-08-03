"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Truck,
  ShoppingCart,
  Gavel,
  ClipboardCheck,
  Milestone,
  Landmark,
  Wrench,
  Package,
  Hammer,
  Warehouse,
  Users,
  MapPin,
  Factory,
  TreePine,
  Droplet,
  School,
  HeartPulse,
  Wheat,
  Eye,
  X,
  Download,
  ArrowRight,
  Building,
} from "lucide-react";
import StatCounter from "@/components/ui/StatCounter";

const ICON_MAP = {
  Building2,
  Truck,
  ShoppingCart,
  Gavel,
  ClipboardCheck,
  Milestone,
  Landmark,
  Wrench,
  Package,
  Hammer,
  Warehouse,
  Users,
  MapPin,
  Factory,
  TreePine,
  Droplet,
  School,
  HeartPulse,
  Wheat,
};

const getIcon = (name) => ICON_MAP[name] || Building2;

const statusStyles = {
  Completed: "bg-emerald-100 text-emerald-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Upcoming: "bg-amber-100 text-amber-700",
};

const Portfolio = () => {
  const [pageData, setPageData] = useState(null);
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showAllContracts, setShowAllContracts] = useState(false);
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [pageRes, clientsRes, contractsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects-page`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/government-enlistment`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`),
        ]);

        const pageJson = await pageRes.json();
        const clientsJson = await clientsRes.json();
        const contractsJson = await contractsRes.json();

        setPageData(pageJson.projectsPage || null);
        setClients(clientsJson.governmentEnlistment?.items || []);
        setContracts(contractsJson.portfolios || []);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const hero = pageData?.hero || {};
  const contractsSection = pageData?.contractsSection || {};
  const featuredSection = pageData?.featuredSection || {};
  const workCategories = pageData?.workCategories || [];
  const timeline = pageData?.timeline || [];
  const cta = pageData?.cta || {};
  const stats = (pageData?.stats || []).map((s) => ({
    value: s.value,
    suffix: s.suffix,
    label: s.label,
  }));

  const featuredProjects = contracts.filter((c) => c.featured);
  const visibleContracts = showAllContracts ? contracts : contracts.slice(0, 6);
  const visibleFeatured = showAllFeatured
    ? featuredProjects
    : featuredProjects.slice(0, 3);

  const openProject = (project) => {
    setSelectedProject(project);
    setActiveImage(project.image);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setActiveImage("");
  };

  const galleryImages = selectedProject
    ? [
        selectedProject.image,
        ...(Array.isArray(selectedProject.images)
          ? selectedProject.images
          : []),
      ].filter((url, idx, arr) => url && arr.indexOf(url) === idx)
    : [];

  return (
    <div className="bg-white text-[var(--color-heading)]">
      {/* Hero */}
      <div
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-ink)]"
        style={{
          backgroundImage: hero.backgroundImage
            ? `linear-gradient(rgba(11,14,20,0.75), rgba(11,14,20,0.75)), url(${hero.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {hero.label && (
            <span className="uppercase tracking-widest text-sm font-semibold text-[#7fb3ff]">
              {hero.label}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-white">
            {hero.heading || "Our Projects"}{" "}
            {hero.highlight && (
              <span className="text-[#7fb3ff]">{hero.highlight}</span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            {hero.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Government Clients */}
        {clients.length > 0 && (
          <section className="py-12 -mt-10 relative z-10">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-8">
              <p className="text-center uppercase tracking-widest text-xs font-bold text-[var(--color-primary)] mb-8">
                Government Clients
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-5">
                {clients.map((item, idx) => (
                  <div
                    key={item.name || idx}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center overflow-hidden">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <Building className="text-xl text-[var(--color-primary)]" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-body)] leading-tight">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {loading && (
          <div className="text-center py-16 text-[var(--color-body)]">
            Loading projects...
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Recent Government Contracts */}
            <section className="py-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <ClipboardCheck className="text-[var(--color-primary)]" />
                  {contractsSection.heading || "Recent Government Contracts"}
                </h2>
                {contracts.length > 6 && (
                  <button
                    onClick={() => setShowAllContracts((prev) => !prev)}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    {showAllContracts ? "Show Less" : "View All Contracts"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {contracts.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-body)] border border-dashed border-[var(--color-border)] rounded-xl">
                  No contracts found yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--color-ink)] text-white text-left">
                        <th className="px-4 py-3 font-semibold">
                          Contract No.
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Department / Client
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Work / Supply Description
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Contract Value (BDT)
                        </th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-center">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleContracts.map((item, idx) => (
                        <tr
                          key={item._id || idx}
                          className={`${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]"} border-t border-[var(--color-border)]`}
                        >
                          <td className="px-4 py-3 font-medium text-[var(--color-heading)] whitespace-nowrap">
                            {item.contractNo || "—"}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-body)]">
                            {item.client || "—"}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-body)] max-w-xs">
                            {item.title}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-body)] whitespace-nowrap">
                            {item.contractValue || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[item.status] ||
                                statusStyles.Completed
                              }`}
                            >
                              {item.status || "Completed"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => openProject(item)}
                              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                              aria-label={`View ${item.title}`}
                            >
                              <Eye className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Featured Government Projects */}
            {featuredProjects.length > 0 && (
              <section className="py-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {featuredSection.heading || "Featured Government Projects"}
                  </h2>
                  {featuredProjects.length > 3 && (
                    <button
                      onClick={() => setShowAllFeatured((prev) => !prev)}
                      className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                    >
                      {showAllFeatured ? "Show Less" : "View All"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleFeatured.map((project, idx) => (
                    <div
                      key={project._id || idx}
                      className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="relative h-48">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-bold text-[var(--color-heading)]">
                          {project.title}
                        </h3>
                        <div className="text-sm text-[var(--color-body)] space-y-1">
                          <p>
                            <span className="font-semibold">Client:</span>{" "}
                            {project.client || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">Location:</span>{" "}
                            {project.location || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Contract No.:
                            </span>{" "}
                            {project.contractNo || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Contract Value:
                            </span>{" "}
                            {project.contractValue || "—"} BDT
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">Status:</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                statusStyles[project.status] ||
                                statusStyles.Completed
                              }`}
                            >
                              {project.status || "Completed"}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">Completion:</span>{" "}
                            {project.completionYear || "—"}
                          </p>
                        </div>
                        <button
                          onClick={() => openProject(project)}
                          className="mt-3 inline-flex items-center gap-2 border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm px-4 py-2 rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Categories */}
            {workCategories.length > 0 && (
              <section className="py-10">
                <p className="text-center uppercase tracking-widest text-xs font-bold text-[var(--color-primary)] mb-6">
                  Our Work Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {workCategories.map((cat, idx) => {
                    const Icon = getIcon(cat.icon);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-heading)]">
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <section className="py-14">
                <div className="bg-[var(--color-ink)] rounded-2xl px-6 py-10">
                  <StatCounter stats={stats} dark />
                </div>
              </section>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <section className="py-14">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">
                  Our Project Timeline
                </h2>
                <div className="relative overflow-x-auto pb-4">
                  <div className="relative flex items-start min-w-max px-2">
                    <span className="absolute left-0 right-0 top-[46px] h-px bg-[var(--color-border)]" />
                    {timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex flex-col items-center text-center w-32 shrink-0"
                      >
                        <span className="font-bold text-[var(--color-primary)] mb-2">
                          {item.year}
                        </span>
                        <span className="relative z-10 w-3 h-3 rounded-full bg-[var(--color-primary)] mb-2 ring-4 ring-white" />
                        <p className="text-xs text-[var(--color-body)] leading-snug px-2">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section className=" py-14 mt-6">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            {cta.heading || "Let's Build a Better Tomorrow Together"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={cta.buttonLink || "/contact"}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text- font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {cta.buttonText || "Contact Us"} <ArrowRight className="w-4 h-4" />
            </Link>
            {cta.secondaryButtonLink && (
              <a
                href={cta.secondaryButtonLink}
                download
                className="inline-flex items-center justify-center bg-gray-400 gap-2 border border-white/40 text-black font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />{" "}
                {cta.secondaryButtonText || "Download Company Profile"}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm p-3 sm:p-4 md:p-8 overflow-y-auto"
          onClick={closeProject}
        >
          <div
            className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-64 shrink-0">
              <img
                src={activeImage || selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={closeProject}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 border-b border-[var(--color-border)] shrink-0">
                {galleryImages.map((url, idx) => (
                  <button
                    key={`${url}-${idx}`}
                    onClick={() => setActiveImage(url)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      (activeImage || selectedProject.image) === url
                        ? "border-[var(--color-primary)]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${selectedProject.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <p className="text-[var(--color-body)]">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">
                    Contract No.
                  </p>
                  <p className="font-semibold">
                    {selectedProject.contractNo || "N/A"}
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">
                    Department / Client
                  </p>
                  <p className="font-semibold">
                    {selectedProject.client || "N/A"}
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">Location</p>
                  <p className="font-semibold">
                    {selectedProject.location || "N/A"}
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">
                    Contract Value
                  </p>
                  <p className="font-semibold">
                    {selectedProject.contractValue
                      ? `${selectedProject.contractValue} BDT`
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">Status</p>
                  <p className="font-semibold">
                    {selectedProject.status || "Completed"}
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-3">
                  <p className="text-[var(--color-body)] text-xs">
                    Completion Year
                  </p>
                  <p className="font-semibold">
                    {selectedProject.completionYear || "N/A"}
                  </p>
                </div>
              </div>

              {selectedProject.result && (
                <div>
                  <h4 className="font-semibold mb-1">Result</h4>
                  <p className="text-[var(--color-body)] text-sm">
                    {selectedProject.result}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
