"use client";
import { useState, useEffect } from "react";
import {
  Award,
  Code,
  Users,
  Filter,
  Search,
  ChevronDown,
  Star,
  Target,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function EmployeeSection() {
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/employees`,
        );
        const json = await res.json();
        if (json.success) {
          const data = json.data.map((e) => ({ id: e._id, ...e }));
          setTeamMembers(data);
          setFilteredMembers(data);
        } else {
          setTeamMembers([]);
          setFilteredMembers([]);
        }
      } catch (err) {
        console.error("Failed to fetch employees", err);
        setTeamMembers([]);
        setFilteredMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    let result = teamMembers;

    if (activeFilter !== "all") {
      result = result.filter((m) => m.role === activeFilter);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.position || "").toLowerCase().includes(q) ||
          (m.skills || []).some((s) => s.toLowerCase().includes(q)),
      );
    }

    setFilteredMembers(result);
  }, [activeFilter, searchQuery, teamMembers]);

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getRoleIcon = (role) => {
    return role === "developer" ? (
      <Code className="w-4 h-4" />
    ) : (
      <Target className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--color-body)]">
          Loading team...
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meet Our Team"
          title="Our Expert Team"
          subtitle="Meet our talented team of developers, designers, and tech experts who bring innovation to every project."
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-5 bg-white rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-[var(--color-primary)]" />
            <div className="flex flex-wrap gap-2">
              {["all", "developer", "marketing"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                    activeFilter === f
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-surface)] text-[var(--color-heading)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {f === "developer" && <Code className="w-4 h-4" />}
                  {f === "marketing" && <Target className="w-4 h-4" />}
                  {f === "all" && <Users className="w-4 h-4" />}
                  {f === "all"
                    ? "All Team"
                    : f === "developer"
                      ? "Developers"
                      : "Marketing"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-body)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, position or skills..."
              className="w-full pl-11 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-sm text-[var(--color-heading)] placeholder-[var(--color-body)] focus:outline-none focus:border-[var(--color-primary)] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((m) => (
            <div key={m.id} className="group relative">
              <div
                className={`relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all duration-500 flex flex-col ${
                  expandedCard === m.id
                    ? "h-auto shadow-xl border-[var(--color-primary)]"
                    : "h-[460px] shadow-sm hover:shadow-lg"
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-[var(--color-surface)]">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: "center 25%" }}
                  />
                </div>

                <div className="relative p-6 flex-1 flex flex-col">
                  <div className="text-center mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        m.role === "developer"
                          ? "bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {getRoleIcon(m.role)}
                      {m.role === "developer" ? "Developer" : "Marketing"}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--color-heading)] mt-3">
                      {m.name}
                    </h3>
                    <p className="text-[var(--color-primary)] text-sm font-semibold">
                      {m.position}
                    </p>
                  </div>

                  <p
                    className={`text-sm text-[var(--color-body)] text-center leading-relaxed ${
                      expandedCard === m.id ? "" : "line-clamp-2 min-h-[40px]"
                    } mb-5`}
                  >
                    {m.description}
                  </p>

                  <button
                    onClick={() => toggleExpand(m.id)}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 mt-auto ${
                      expandedCard === m.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface)] text-[var(--color-heading)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {expandedCard === m.id ? "Show Less" : "View Details"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCard === m.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedCard === m.id
                        ? "max-h-[1000px] opacity-100 mt-5"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mb-5">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-[var(--color-primary)]" />
                        <span className="text-[var(--color-heading)] font-semibold text-sm">
                          Skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(m.skills || []).map((s, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-body)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {m.achievements?.length > 0 && (
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Award className="w-4 h-4 text-[var(--color-primary)]" />
                          <span className="text-[var(--color-heading)] font-semibold text-sm">
                            Achievements
                          </span>
                        </div>
                        <div className="space-y-2">
                          {m.achievements.map((a, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 px-3 py-2 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)]"
                            >
                              <Star className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-[var(--color-body)]">{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
