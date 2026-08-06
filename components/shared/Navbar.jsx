"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaDownload,
  FaLaptopCode,
  FaBars,
  FaTimes,
  FaBuilding,
  FaIndustry,
  FaTruck,
  FaNewspaper,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const CATEGORY_ICONS = {
  construction: <FaBuilding />,
  infrastructure: <FaIndustry />,
  supply: <FaTruck />,
};

const getCategoryIcon = (name) =>
  CATEGORY_ICONS[String(name || "").toLowerCase()] || <FaLaptopCode />;

const SEARCH_TYPE_META = {
  services: { label: "Services", icon: <FaLaptopCode /> },
  portfolio: { label: "Projects", icon: <FaBuilding /> },
  news: { label: "News & Media", icon: <FaNewspaper /> },
};

const EMPTY_SEARCH_RESULTS = { services: [], portfolio: [], news: [] };
const EMPTY_SEARCH_COUNTS = { services: 0, portfolio: 0, news: 0, total: 0 };

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(EMPTY_SEARCH_RESULTS);
  const [searchCounts, setSearchCounts] = useState(EMPTY_SEARCH_COUNTS);
  const [searchLoading, setSearchLoading] = useState(false);
  const timeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const isHome = pathname === "/";
  const overlay = isHome && !isScrolled;

  const isActive = (path) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const isServicesActive = () => {
    if (!pathname) return false;
    return pathname.startsWith("/services/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/navbar-categories`,
        );
        if (!res.ok) return;
        const data = await res.json();
        const categories = Array.isArray(data.categories)
          ? data.categories
          : [];

        setServices(
          categories.map((category) => {
            const desc = String(category.description || "").trim();
            return [
              category.displayName,
              category.link || `/services/category/${category.name}`,
              getCategoryIcon(category.icon || category.name),
              desc.length > 90 ? `${desc.slice(0, 90)}...` : desc,
            ];
          }),
        );
      } catch (error) {
        console.error("Error fetching navbar categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults(EMPTY_SEARCH_RESULTS);
      setSearchCounts(EMPTY_SEARCH_COUNTS);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    setSearchLoading(true);

    const debounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}&limit=4`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        setSearchResults(data.results || EMPTY_SEARCH_RESULTS);
        setSearchCounts(data.counts || EMPTY_SEARCH_COUNTS);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search failed:", error);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  const renderSearchSuggestions = () => {
    if (searchQuery.trim().length < 2) return null;

    return (
      <div className="max-h-96 overflow-y-auto border-t border-[var(--color-border)]">
        {searchLoading && (
          <div className="px-4 py-3 text-xs text-[var(--color-body)]">
            Searching...
          </div>
        )}

        {!searchLoading && searchCounts.total === 0 && (
          <div className="px-4 py-3 text-xs text-[var(--color-body)]">
            No results found.
          </div>
        )}

        {!searchLoading && searchCounts.total > 0 && (
          <>
            {["services", "portfolio", "news"].map((type) =>
              searchResults[type]?.length > 0 ? (
                <div key={type} className="py-2">
                  <div className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-body)]">
                    {SEARCH_TYPE_META[type].label}
                  </div>
                  {searchResults[type].map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-surface)] transition-colors"
                    >
                      <span className="text-[var(--color-primary)] shrink-0 text-sm">
                        {SEARCH_TYPE_META[type].icon}
                      </span>
                      <span className="text-sm text-[var(--color-heading)] line-clamp-1">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null,
            )}
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
              onClick={closeSearch}
              className="block px-4 py-3 text-sm font-semibold text-[var(--color-primary)] border-t border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
            >
              View all results for &ldquo;{searchQuery.trim()}&rdquo;
            </Link>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button[aria-label='Toggle menu']")
      ) {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }

      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("button[onClick]")
      ) {
        setDropdownOpen(false);
      }

      if (
        searchOpen &&
        !(searchRef.current && searchRef.current.contains(event.target)) &&
        !(mobileSearchRef.current && mobileSearchRef.current.contains(event.target))
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, dropdownOpen, searchOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleToggleClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setServicesOpen(false);
  };

  const toggleMobileServices = () => {
    setServicesOpen((prev) => !prev);
  };

  const handleServiceClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkColorClasses = (active) =>
    `relative py-2 transition-colors duration-200 ${
      overlay
        ? active
          ? "text-white"
          : "text-white/85 hover:text-white"
        : active
          ? "text-[var(--color-primary)]"
          : "hover:text-[var(--color-primary)]"
    }`;

  const underlineClasses = overlay ? "bg-white" : "bg-[var(--color-primary)]";

  const iconButtonClasses = `flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
    overlay
      ? "border-white/50 text-white hover:bg-white/10"
      : "border-[var(--color-border)] text-[var(--color-heading)] hover:bg-[var(--color-surface)]"
  }`;

  return (
    <nav
      className={`px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between z-50 sticky top-0 transition-colors duration-300 ${
        overlay
          ? "bg-transparent text-white border-b border-transparent shadow-none"
          : `bg-white text-[var(--color-heading)] border-b border-[var(--color-border)] ${
              isScrolled ? "shadow-md" : "shadow-none"
            }`
      }`}
    >
      <Link href="/" className="flex items-center space-x-2 shrink-0">
        <Logo variant={overlay ? "light" : "default"} />
      </Link>

      <ul className="hidden md:flex gap-6 lg:gap-8 items-center text-sm font-semibold relative">
          <li>
            <Link href="/" className={linkColorClasses(isActive("/"))}>
              Home
              {isActive("/") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleToggleClick}
              className={`flex items-center gap-1 ${linkColorClasses(
                isServicesActive(),
              )}`}
            >
              Our Services
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
              {isServicesActive() && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[95vw] sm:w-[720px] lg:w-[920px] bg-white text-[var(--color-heading)] grid grid-cols-1 lg:grid-cols-3 rounded-lg shadow-2xl z-20 border border-[var(--color-border)] overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-1 p-6">
                  {services.map(([title, path, icon, desc], idx) => (
                    <Link
                      href={path}
                      key={idx}
                      className={`flex items-start gap-3 rounded-md p-3 hover:bg-[var(--color-surface)] transition-colors duration-200 ${
                        isActive(path) ? "bg-[var(--color-primary-tint)]" : ""
                      }`}
                      onClick={handleServiceClick}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-base ${
                          isActive(path)
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
                        }`}
                      >
                        {icon}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-semibold leading-tight ${
                            isActive(path) ? "text-[var(--color-primary)]" : ""
                          }`}
                        >
                          {title}
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-body)] leading-snug">
                          {desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="hidden lg:flex flex-col justify-center bg-[var(--color-ink)] p-6 relative overflow-hidden">
                  <Image
                    src="/assets/banner.avif"
                    alt="MRH portfolio"
                    width="400"
                    height="400"
                    unoptimized
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="relative z-10">
                    <h3 className="text-white font-bold mb-2">
                      Download our PDF portfolio
                    </h3>
                    <p className="text-sm text-white/60 mb-5">
                      See our project experience & offerings in detail.
                    </p>
                    <a
                      href="/RakibHasanPortfolio.pdf"
                      download="MRH-Portfolio"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-md text-sm font-semibold text-white transition-colors"
                      onClick={handleServiceClick}
                    >
                      <FaDownload /> Download
                    </a>
                  </div>
                </div>
              </div>
            )}
          </li>

          <li>
            <Link href="/about" className={linkColorClasses(isActive("/about"))}>
              About
              {isActive("/about") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/government-enlistment"
              className={linkColorClasses(isActive("/government-enlistment"))}
            >
              Govt. Enlistment
              {isActive("/government-enlistment") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/projects"
              className={linkColorClasses(isActive("/projects"))}
            >
              Projects
              {isActive("/projects") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li>
            <Link href="/csr" className={linkColorClasses(isActive("/csr"))}>
              CSR
              {isActive("/csr") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/gallery"
              className={linkColorClasses(isActive("/gallery"))}
            >
              Gallery
              {isActive("/gallery") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className={linkColorClasses(isActive("/contact"))}
            >
              Contact
              {isActive("/contact") && (
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${underlineClasses}`}
                />
              )}
            </Link>
          </li>
        </ul>

      <div className="hidden md:block relative shrink-0" ref={searchRef}>
        <button
          type="button"
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Toggle search"
          className={iconButtonClasses}
        >
          <FaSearch className="text-xs" />
        </button>

        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className={`absolute right-0 top-full mt-3 w-96 shadow-lg overflow-hidden border z-20 ${
              overlay
                ? "bg-white/95 border-white/40"
                : "bg-white border-[var(--color-border)]"
            }`}
          >
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, projects, news..."
              className="w-full px-4 py-2.5 text-sm text-[var(--color-heading)] outline-none"
            />
            {renderSearchSuggestions()}
          </form>
        )}
      </div>

      <div className="md:hidden flex items-center gap-3">
        <div ref={mobileSearchRef}>
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            className={iconButtonClasses}
          >
            <FaSearch className="text-xs" />
          </button>

          {searchOpen && (
            <form
              onSubmit={handleSearchSubmit}
              className={`absolute left-0 right-0 top-full border-t shadow-lg z-20 ${
                overlay
                  ? "bg-white/95 border-white/40"
                  : "bg-white border-[var(--color-border)]"
              }`}
            >
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, projects, news..."
                className="w-full px-4 py-3 text-sm text-[var(--color-heading)] outline-none"
              />
              {renderSearchSuggestions()}
            </form>
          )}
        </div>

        <button onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-white text-[var(--color-heading)] px-6 py-4 space-y-1 z-40 shadow-lg border-t border-[var(--color-border)]"
        >
          <Link
            href="/"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Home
          </Link>

          <div>
            <button
              onClick={toggleMobileServices}
              className={`flex items-center justify-between w-full py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
                isServicesActive()
                  ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                  : "pl-4"
              }`}
            >
              <span>Our Services</span>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {servicesOpen && (
              <div className="mt-1 space-y-1">
                {services.map(([title, path], idx) => (
                  <Link
                    href={path}
                    key={idx}
                    className={`block text-sm py-2 hover:text-[var(--color-primary)] transition-colors duration-200 ${
                      isActive(path)
                        ? "text-[var(--color-primary)] font-semibold bg-[var(--color-primary-tint)] border-l-4 border-[var(--color-primary)] pl-6"
                        : "pl-8"
                    }`}
                    onClick={handleServiceClick}
                  >
                    {title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/about")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            About
          </Link>

          <Link
            href="/government-enlistment"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/government-enlistment")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Govt. Enlistment
          </Link>

          <Link
            href="/projects"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/projects")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Projects
          </Link>

          <Link
            href="/csr"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/csr")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            CSR
          </Link>

          <Link
            href="/gallery"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/gallery")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Gallery
          </Link>

          <Link
            href="/contact"
            className={`block py-2.5 hover:text-[var(--color-primary)] transition-colors duration-200 ${
              isActive("/contact")
                ? "text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
