/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, HandCoins, Quote, ShieldCheck, Star } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_IMAGES } from "@/lib/images";
import { CATEGORY_ICONS } from "@/components/services/categoryIcons";
import SectionHeading from "./SectionHeading";

const TRUST = [
  { icon: BadgeCheck, value: "120+", label: "Verified technicians", text: "Every listing is reviewed by our admin team before it goes live." },
  { icon: ShieldCheck, value: "8,500+", label: "Jobs completed", text: "Clear status at each step — no more guessing where your device is." },
  { icon: HandCoins, value: "100%", label: "Pay after service", text: "You pay the final amount only after the technician marks it completed." },
  { icon: Clock3, value: "< 2 hrs", label: "Average response", text: "Technicians accept or reject requests quickly, so you can plan your day." },
];

const TESTIMONIALS = [
  { name: "Farhana Akter", area: "Mirpur, Dhaka", text: "My fridge stopped cooling on a Friday. The technician came the next morning and I paid only after it was cold again." },
  { name: "Sabbir Hossain", area: "Uttara, Dhaka", text: "I could see my laptop go from Accepted to In Progress to Completed. Finally a repair service that keeps you informed." },
  { name: "Nadia Islam", area: "Dhanmondi, Dhaka", text: "Booked an AC servicing before summer. Clean work, fair final price, and the Stripe payment took ten seconds." },
];

export default function Categories() {
  return (
    <section className="py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Popular categories"
          title="What can we fix for you today?"
          lead="Pick a category to see every approved service for it."
          action={
            <Link href="/services" className="btn btn-outline">
              All services <ArrowRight className="size-4" />
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-ink p-4 text-white shadow-[var(--shadow-card)] last:col-span-2 sm:last:col-span-1"
              >
                <img src={CATEGORY_IMAGES[c]} alt="" className="absolute inset-0 size-full object-cover opacity-70 transition duration-500 group-hover:scale-110 group-hover:opacity-55" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="relative grid size-10 place-items-center rounded-xl bg-lime-400 text-ink transition group-hover:-translate-y-1">
                  <Icon className="size-5" />
                </span>
                <span className="relative mt-3 font-display text-base leading-tight font-bold">{c}</span>
                <span className="relative mt-1 inline-flex items-center gap-1 text-xs text-white/75">
                  View services <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Why choose us */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="section-eyebrow">Why choose FixMate</span>
            <h2 className="section-title mt-3">Repairs you can actually trust</h2>
            <p className="section-lead">
              We built FixMate around two promises: you always know the status of your job, and you never pay for work
              that has not been done.
            </p>
            <div className="mt-8 space-y-4">
              {TESTIMONIALS.slice(0, 1).map((t) => (
                <figure key={t.name} className="card relative p-6">
                  <Quote className="absolute top-5 right-5 size-8 text-pine-100" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-lime-400 text-lime-500" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-sm font-bold">
                    {t.name} <span className="font-normal text-muted">· {t.area}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {TRUST.map((t, i) => (
              <div key={t.label} className={`flex h-full flex-col rounded-[var(--radius-card)] p-6 ${i === 0 || i === 3 ? "bg-pine-800 text-white" : "card"}`}>
                <t.icon className={`size-7 ${i === 0 || i === 3 ? "text-lime-400" : "text-pine-600"}`} />
                <p className="mt-5 font-display text-4xl font-extrabold">{t.value}</p>
                <p className={`mt-1 font-bold ${i === 0 || i === 3 ? "text-lime-300" : "text-pine-700"}`}>{t.label}</p>
                <p className={`mt-2 text-sm leading-relaxed ${i === 0 || i === 3 ? "text-white/70" : "text-muted"}`}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex h-full flex-col p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-lime-400 text-lime-500" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/85">“{t.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="grid size-9 place-items-center rounded-full bg-pine-100 text-xs font-bold text-pine-800">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <span className="text-sm">
                  <span className="block font-bold">{t.name}</span>
                  <span className="text-muted">{t.area}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
