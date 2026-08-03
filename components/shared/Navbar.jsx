"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaShopify,
  FaEbay,
  FaAmazon,
  FaSearch,
  FaUsers,
  FaVectorSquare,
  FaDownload,
  FaLaptopCode,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const timeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

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
        searchRef.current &&
        !searchRef.current.contains(event.target)
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

  const services = [
    [
      "Design & Development",
      "/services/category/development",
      <FaLaptopCode />,
      "Websites, apps & product design built for scale",
    ],
    [
      "E-Commerce",
      "/services/e-commerce",
      <FaCartShopping />,
      "Storefronts and marketplace integrations",
    ],
    [
      "Amazon",
      "/services/category/ecommerce",
      <FaAmazon />,
      "FBA, vendor central & marketplace growth",
    ],
    [
      "Shopify",
      "/services/shopify",
      <FaShopify />,
      "Store setup, theming & conversion optimisation",
    ],
    [
      "ERP System Development",
      "/services/erp",
      <FaVectorSquare />,
      "Custom enterprise resource planning systems",
    ],
    [
      "SEO / SEM / PPC",
      "/services/seo",
      <FaSearch />,
      "Search visibility and performance marketing",
    ],
    [
      "Server & Hosting",
      "/services/server-hosting",
      <FaUsers />,
      "Cloud infrastructure, hosting & support",
    ],
    [
      "E-bay",
      "/services/e-bay",
      <FaEbay />,
      "Listing, fulfillment & account management",
    ],
  ];

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
                    alt="A2IT portfolio"
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
                      download="A2IT-Portfolio"
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
              Government Enlistment
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
            onSubmit={(e) => e.preventDefault()}
            className={`absolute right-0 top-full mt-3 w-64 rounded-lg shadow-lg overflow-hidden border z-20 ${
              overlay
                ? "bg-white/95 border-white/40"
                : "bg-white border-[var(--color-border)]"
            }`}
          >
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="w-full px-4 py-2.5 text-sm text-[var(--color-heading)] outline-none"
            />
          </form>
        )}
      </div>

      <div className="md:hidden">
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
            Government Enlistment
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

          <div className="pt-2 pl-4">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-[var(--color-heading)]"
            >
              <FaSearch className="text-xs" /> Search
            </button>
            {searchOpen && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-2 rounded-lg border border-[var(--color-border)] overflow-hidden"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="w-full px-4 py-2.5 text-sm text-[var(--color-heading)] outline-none"
                />
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
