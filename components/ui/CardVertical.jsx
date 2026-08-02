import React from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const CardVertical = ({ href, image, icon: Icon, title, description, badge }) => {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-40 w-full overflow-hidden bg-[var(--color-surface)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          Icon && (
            <div className="flex h-full w-full items-center justify-center">
              <Icon className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
          )
        )}
        {badge && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-[var(--color-body)] line-clamp-2">
            {description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
          Know More
          <FiArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default CardVertical;
