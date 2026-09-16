"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const slugify = (text) =>
  text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Injects an id into each <h2> in the raw HTML so the sidebar can deep-link to it.
const withHeadingIds = (html) => {
  const toc = [];
  const seen = {};
  const taggedHtml = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text) || `section-${toc.length + 1}`;
    if (seen[id] != null) {
      seen[id] += 1;
      id = `${id}-${seen[id]}`;
    } else {
      seen[id] = 0;
    }
    toc.push({ id, text });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { taggedHtml, toc };
};

const ContentSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {[1, 2, 3].map((section) => (
      <div key={section} className="space-y-3">
        <div className="h-6 w-48 rounded-lg bg-[var(--color-border)]" />
        <div className="h-4 w-full rounded-lg bg-[var(--color-border)]/70" />
        <div className="h-4 w-full rounded-lg bg-[var(--color-border)]/70" />
        <div className="h-4 w-2/3 rounded-lg bg-[var(--color-border)]/70" />
      </div>
    ))}
  </div>
);

export default function LegalPageLayout({ sectionKey, icon, defaultTitle }) {
  const [legalPage, setLegalPage] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal-pages`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.legalPage?.[sectionKey]) {
          setLegalPage(data.legalPage[sectionKey]);
        }
        setStatus("done");
      })
      .catch(() => {
        if (!cancelled) setStatus("done");
      });
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  const { taggedHtml, toc } = useMemo(() => {
    if (!legalPage?.content) return { taggedHtml: "", toc: [] };
    return withHeadingIds(legalPage.content);
  }, [legalPage]);

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-[var(--color-primary-tint)]/40">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 pt-24 pb-10 text-white md:px-16">
        <div className="relative mx-auto flex max-w-4xl items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 [&_svg]:text-lg">
            {icon}
          </div>
          <h1 className="text-2xl font-bold leading-tight md:text-3xl">{legalPage?.title || defaultTitle}</h1>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-16">
        <div className="grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-[240px_1fr]">
          {/* Table of contents */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                  On this page
                </p>
                <nav>
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-5 border-t border-[var(--color-border)] pt-4 text-sm">
                  <p className="mb-2 text-[var(--color-body)]">Have questions?</p>
                  <Link href="/contact" className="font-semibold text-[var(--color-primary)] hover:underline">
                    Contact us
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* Content card */}
          <div
            className={`rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-10 lg:mt-0 ${
              toc.length > 0 ? "" : "lg:col-span-2"
            }`}
          >
            {isLoading ? (
              <ContentSkeleton />
            ) : taggedHtml ? (
              <div
                className="text-[var(--color-body)] leading-relaxed [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0a1a3c] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:first:mt-0 [&_h3]:scroll-mt-28 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0a1a3c] [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_a]:text-[var(--color-primary)] [&_a]:font-semibold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-primary)]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:my-4 [&_img]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: taggedHtml }}
              />
            ) : (
              <p className="text-center text-[var(--color-body)]">Content unavailable right now.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
