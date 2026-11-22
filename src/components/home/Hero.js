/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BadgeCheck, CheckCircle2, CircleDollarSign, Search, ShieldCheck, Star } from "lucide-react";
import { IMAGES } from "@/lib/images";

const QUICK = ["Smartphone", "Laptop & PC", "AC", "Refrigerator"];
const PIPELINE = [
  { label: "Requested", done: true },
  { label: "Accepted", done: true },
  { label: "In Progress", done: true, current: true },
  { label: "Completed", done: false },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <span className="section-eyebrow">
            <BadgeCheck className="size-3.5" /> Verified technicians · Pay after service
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
            Broken device?{" "}
            <span className="relative whitespace-nowrap text-pine-700">
              Get it fixed
              <svg viewBox="0 0 300 12" className="absolute -bottom-1 left-0 h-3 w-full text-lime-400" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9c60-6 160-8 296-3" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            by verified technicians.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Phones, laptops, ACs, fridges and more. Send a request, follow every step of the repair, and pay online only
            when the job is done.
          </p>

          <form action="/services" className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 shadow-[var(--shadow-card)] focus-within:ring-4 focus-within:ring-pine-100">
            <Search className="size-5 shrink-0 text-muted" />
            <input
              name="search"
              placeholder="What needs fixing? e.g. screen, AC gas"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted/70"
              aria-label="Search services"
            />
            <button type="submit" className="btn btn-primary">
              Find a fix
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Popular:</span>
            {QUICK.map((c) => (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-line bg-white px-3 py-1 font-medium transition hover:border-pine-300 hover:bg-pine-50"
              >
                {c}
              </Link>
            ))}
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["120+", "Verified technicians"],
              ["4.8/5", "Average job rating"],
              ["$0", "Paid upfront"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-extrabold sm:text-3xl">{v}</dt>
                <dd className="mt-1 text-xs font-medium text-muted sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual: photo + live job tracker card */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -top-6 -right-6 size-40 rounded-full bg-lime-300/60 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border-8 border-white shadow-[var(--shadow-lift)]">
            <img src={IMAGES.hero} alt="Technician repairing a smartphone circuit board" className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]" />
          </div>

          <div className="absolute -bottom-6 -left-2 w-64 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-lift)] sm:-left-10 sm:w-72">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">Job #FM-2048</p>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">In Progress</span>
            </div>
            <p className="mt-1 font-bold">iPhone 13 screen replacement</p>
            <ol className="mt-3 space-y-2">
              {PIPELINE.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className={`size-4 ${s.done ? (s.current ? "text-amber-500" : "text-pine-500") : "text-line"}`} />
                  <span className={s.done ? "font-semibold" : "text-muted"}>{s.label}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="absolute top-6 -right-2 hidden rounded-2xl bg-pine-800 p-4 text-white shadow-[var(--shadow-lift)] sm:block sm:-right-6">
            <CircleDollarSign className="size-6 text-lime-400" />
            <p className="mt-2 text-sm font-bold">Pay after it&apos;s fixed</p>
            <p className="text-xs text-white/70">Secure Stripe checkout</p>
          </div>

          <div className="absolute right-6 -bottom-4 hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 shadow-[var(--shadow-card)] sm:flex">
            <ShieldCheck className="size-4 text-pine-600" />
            <span className="text-xs font-bold">Admin-approved listings</span>
            <Star className="size-4 fill-lime-400 text-lime-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
