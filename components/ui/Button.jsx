import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const VARIANTS = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm",
  outline:
    "bg-transparent text-white border border-white/70 hover:bg-white hover:text-[var(--color-ink)]",
  "outline-dark":
    "bg-transparent text-[var(--color-heading)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  link: "bg-transparent text-[var(--color-primary)] px-0 py-0 font-semibold hover:gap-3",
};

const Button = ({
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  children,
  showArrow = variant === "link",
  ...rest
}) => {
  const base =
    variant === "link"
      ? "inline-flex items-center gap-2 text-sm transition-all duration-200"
      : "inline-flex items-center justify-center gap-2 px-6 py-3  text-sm font-semibold tracking-wide transition-all duration-200";

  const classes = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && <FiArrowRight className="transition-transform duration-200" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default Button;
