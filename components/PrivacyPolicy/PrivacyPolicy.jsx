"use client";
import React, { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";

const PrivacyPolicy = () => {
  const [legalPage, setLegalPage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal-pages`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.legalPage?.privacyPolicy) {
          setLegalPage(data.legalPage.privacyPolicy);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#eef4ff] to-white text-black min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-16">
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaShieldAlt className="text-3xl text-[var(--color-primary)]" />
            <span className="uppercase tracking-widest text-sm font-bold text-[var(--color-primary)]">
              Legal
            </span>
          </div>
          <h1 className="main-title text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight text-[#0a1a3c]">
            {legalPage?.title || "Privacy Policy"}
          </h1>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
        </section>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-10">
          {legalPage?.content ? (
            <div
              className="text-[var(--color-body)] leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0a1a3c] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:first:mt-0 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0a1a3c] [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_a]:text-[var(--color-primary)] [&_a]:font-semibold [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-primary)]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:my-4 [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: legalPage.content }}
            />
          ) : (
            <p className="text-[var(--color-body)] text-center">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
