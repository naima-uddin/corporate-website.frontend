import React from "react";

const GovernmentEnlistment = () => {
  return (
    <div className="bg-white text-black">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Government <span className="text-[#0066ff]">Enlistment</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-2xl text-black mb-8 leading-relaxed">
              A2IT Ltd is an enlisted IT service provider, recognized for
              delivering reliable and compliant technology solutions to
              government and public sector organizations.
            </p>
            <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-48 mx-auto mb-8"></div>
          </div>

          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#00f0ff]/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#0066ff]/10 blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Enlistment details coming soon
          </h2>
          <p className="text-base text-[var(--color-body)]">
            We&apos;re preparing detailed information about our government
            enlistment credentials and certifications. Please check back
            soon, or{" "}
            <a
              href="/contact"
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              contact us
            </a>{" "}
            for more information.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GovernmentEnlistment;
