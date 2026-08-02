import React from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const NewsCard = ({ href, image, date, category, title, excerpt }) => {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[var(--color-surface)]">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          {category && <span>{category}</span>}
          {date && <span className="text-[var(--color-body)]">{date}</span>}
        </div>
        <h3 className="mt-3 text-lg font-bold text-[var(--color-heading)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-[var(--color-body)] line-clamp-2">
            {excerpt}
          </p>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
          Read More
          <FiArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default NewsCard;
