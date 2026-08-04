"use client";
import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

const ClientSideMap = ({ position, setPosition, officeAddress }) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let map;
    let marker;
    let L;

    const addLeafletCss = () => {
      if (document.querySelector("#leaflet-css")) return;
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    };

    const init = async () => {
      addLeafletCss();
      L = (await import("leaflet")).default;

      // Fix marker icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current, { scrollWheelZoom: true }).setView(
        position,
        16,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      marker = L.marker(position).addTo(map);
      marker.bindPopup(
        `<div class="font-medium"><h3 style="color:#0b4f9e;font-weight:700;margin-bottom:4px;">Our Office</h3><p style="color:#333">${officeAddress}</p></div>`,
      );

      leafletMapRef.current = map;
      markerRef.current = marker;
    };

    init();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isClient]);

  // Recenter the map and marker if the office position changes after
  // the map has already been created (e.g. contact settings loaded from the API)
  useEffect(() => {
    const map = leafletMapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.setLatLng(position);
    marker.setPopupContent(
      `<div class="font-medium"><h3 style="color:#0b4f9e;font-weight:700;margin-bottom:4px;">Our Office</h3><p style="color:#333">${officeAddress}</p></div>`,
    );
    map.setView(position, map.getZoom());
  }, [position, officeAddress]);

  // handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector("input");
    const searchQuery = input.value;
    if (!searchQuery) return;

    const { OpenStreetMapProvider } = await import("leaflet-geosearch");
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results.length > 0) {
      const { x: lng, y: lat } = results[0];
      setPosition([lat, lng]);
      const map = leafletMapRef.current;
      if (map) map.flyTo([lat, lng], 16);
    }
  };

  if (!isClient) {
    return (
      <div className="h-full min-h-[320px] w-full bg-[var(--color-surface)] flex items-center justify-center">
        <p className="text-[var(--color-body)]">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[320px] w-full relative">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000]">
        <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-lg border border-[var(--color-border)]">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search location..."
              className="px-2 sm:px-3 py-1 w-28 sm:w-48 text-sm bg-white border border-[var(--color-border)] text-[var(--color-heading)] rounded-l focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder-[var(--color-body)]/60"
            />
            <button
              type="submit"
              className="bg-[var(--color-primary)] text-white px-3 sm:px-4 py-2 rounded-r hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <FiSearch />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientSideMap;
