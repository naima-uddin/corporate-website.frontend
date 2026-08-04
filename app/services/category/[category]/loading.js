export default function Loading() {
  return (
    <div className="bg-[var(--color-surface)]">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-ink-2)]">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          <span className="relative flex h-12 w-12 mb-6">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
          </span>
          <p className="text-white text-lg sm:text-xl font-semibold animate-pulse">
            Details are coming, please wait…
          </p>
        </div>
      </section>

      {/* Services list skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {[1, 2].map((item) => (
          <div
            key={item}
            className={`flex flex-col ${
              item % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-8 lg:gap-12`}
          >
            <div className="w-full lg:w-1/2">
              <div className="h-56 sm:h-64 rounded-lg bg-[var(--color-primary-tint)] animate-pulse" />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-8 w-2/3 rounded-lg bg-[var(--color-primary-tint)] animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-[var(--color-primary-tint)] animate-pulse" />
              <div className="h-4 w-5/6 rounded-lg bg-[var(--color-primary-tint)] animate-pulse" />
              <div className="h-4 w-1/3 rounded-lg bg-[var(--color-primary-tint)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
