"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  LayoutGrid,
  Building2,
  Users,
  Handshake,
} from "lucide-react";

// Icon shown next to each category tab
const CATEGORY_ICONS = {
  All: LayoutGrid,
  A2it: Building2,
  Team: Users,
  Consulting: Handshake,
};

// Repeating 4-row layout: row of 3 singles, big-left/small-right,
// small-left/big-right (mirrored), row of 3 singles — then repeats.
const ROW_PATTERN = [1, 1, 1, 2, 1, 1, 2, 1, 1, 1];
const getColSpan = (index) => ROW_PATTERN[index % ROW_PATTERN.length];

export default function CompanyGallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [companyImages, setCompanyImages] = useState([]);
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch gallery images from the dashboard-managed API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`)
      .then((res) => res.json())
      .then((data) =>
        setCompanyImages(
          (data.images || []).map((img) => ({
            id: img._id,
            src: img.image,
            alt: img.title,
            title: img.title,
            category: img.category || "General",
          }))
        )
      )
      .catch((err) => console.error("Error fetching gallery images:", err));
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initially set to true for SSR
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMobile, currentSlide]);

  // Category tabs: "All" plus every unique category found in the data
  const categories = useMemo(
    () => ["All", ...new Set(companyImages.map((img) => img.category))],
    [companyImages]
  );

  // Images to display for the currently selected tab
  const filteredImages = useMemo(
    () =>
      activeCategory === "All"
        ? companyImages
        : companyImages.filter((img) => img.category === activeCategory),
    [companyImages, activeCategory]
  );

  // Reset slider/modal state whenever the selected category changes
  useEffect(() => {
    setCurrentSlide(0);
    setSelectedImageIndex(null);
  }, [activeCategory]);

  // Calculate total slides for mobile
  const totalSlides = filteredImages.length;

  // Slider functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const openModal = (index) => setSelectedImageIndex(index);
  const closeModal = () => setSelectedImageIndex(null);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const MobileImageCard = ({ image, index }) => (
    <div
      onClick={() => openModal(index)}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#12121a] h-full border border-[#00f0ff]/20 min-w-full cursor-pointer"
    >
      <div className="relative overflow-hidden h-full">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
        />

        {/* Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/90 via-[#0a0a12]/10 to-transparent flex flex-col justify-end p-4">
          <h3 className="font-bold text-md text-[#e0e0ff]">{image.title}</h3>
        </div>
      </div>
    </div>
  );

  const DesktopImageCard = ({ image, index }) => {
    if (!image) return null;
    const colSpan = getColSpan(index);

    return (
      <div
        onClick={() => openModal(index)}
        className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#12121a] h-full border border-[#00f0ff]/20 cursor-pointer ${
          colSpan === 2 ? "md:col-span-2" : ""
        }`}
      >
        <div className="relative overflow-hidden h-full">
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full ${
              colSpan === 2 ? "h-72" : "h-56"
            } object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75`}
          />

          {/* Title Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/90 via-[#0a0a12]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
            <h3 className="font-bold text-md text-[#e0e0ff] transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
              {image.title}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className=" bg-white mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-3">
            Our <span className="text-[#006dff]">Company Gallery</span>
          </h2>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] mx-auto mb-3 md:mb-4"></div>
          <p className="text-base md:text-lg text-black max-w-3xl mx-auto px-2">
            Explore our comprehensive IT services through our company gallery
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-10">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category] || LayoutGrid;
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                  isActive
                    ? "bg-[#0a1e3f] border-[#0a1e3f] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#006dff]/50 hover:text-[#006dff]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category}
              </button>
            );
          })}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {filteredImages.map((image, index) => (
            <DesktopImageCard key={image.id} image={image} index={index} />
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative w-full">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {filteredImages.map((image, index) => (
              <div key={image.id} className="flex-shrink-0 w-full px-2">
                <MobileImageCard image={image} index={index} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a0a12] shadow-lg rounded-full w-8 h-8 border flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a0a12] shadow-lg rounded-full w-8 h-8 border flex items-center justify-center z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Counter */}
          <div className="text-center mt-2 text-[#b0b0ff] text-sm">
            {currentSlide + 1} / {filteredImages.length}
          </div>
        </div>

      </div>

      {/* Fullscreen Modal with responsive fixes */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-[#0a0a12]/95 z-50 flex items-center justify-center p-2 md:p-4">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 md:top-4 right-3 md:right-4 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-1.5 md:p-2 rounded-md"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Navigation Arrows - Larger on mobile for touch */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-2 md:p-2 rounded-md w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-2 md:p-2 rounded-md w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 md:w-5 md:h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#0a0a12]/90 text-[#e0e0ff] px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-[#00f0ff]/20">
            {selectedImageIndex + 1} / {filteredImages.length}
          </div>

          {/* Action Buttons - Mobile: bottom, Desktop: bottom center */}
          <div className="absolute bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
            <button className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:from-[#00c0ff] hover:to-[#0044ff] text-[#0a0a12] border border-[#00f0ff] backdrop-blur-sm px-3 py-1.5 md:px-3 md:py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap">
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">DL</span>
            </button>
            <button className="bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 backdrop-blur-sm px-3 py-1.5 md:px-3 md:py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap">
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">SH</span>
            </button>
          </div>

          {/* Main Image Content */}
          <div className="relative w-full h-full max-w-6xl max-h-[60vh] md:max-h-[70vh]">
            <img
              src={filteredImages[selectedImageIndex].src}
              alt={filteredImages[selectedImageIndex].alt}
              className="w-full h-full object-contain rounded-md"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a12]/95 to-transparent p-3 md:p-4 rounded-b-md">
              <h3 className="text-[#e0e0ff] text-sm md:text-md font-bold line-clamp-1">
                {filteredImages[selectedImageIndex].title}
              </h3>
            </div>
          </div>

          {/* Thumbnail Strip - Mobile: smaller and scrollable */}
          <div className="absolute bottom-20 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-1 max-w-[90vw] md:max-w-full overflow-x-auto px-2 py-1 md:py-1">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-10 h-8 md:w-12 md:h-9 rounded-sm overflow-hidden border transition-all ${
                  index === selectedImageIndex
                    ? "border-[#00f0ff] scale-110 md:scale-110"
                    : "border-[#b0b0ff]/30 hover:border-[#00f0ff]/60"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}