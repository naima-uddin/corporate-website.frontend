import React from "react";

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}) => {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col ${alignClass} mb-10 md:mb-14 ${className}`}>
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      <h2
        className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${
          dark ? "text-white" : "text-[var(--color-heading)]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed ${
            dark ? "text-white/70" : "text-[var(--color-body)]"
          } ${align === "left" ? "" : "mx-auto"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
