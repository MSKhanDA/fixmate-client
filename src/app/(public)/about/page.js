/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardList, CreditCard, ShieldCheck, UserRound, Wrench } from "lucide-react";
import HowItWorks from "@/components/home/HowItWorks";
import { StatusBadge, PaymentBadge } from "@/components/ui/Badges";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "How It Works" };

const PIPELINE = [
  { status: "requested", who: "Customer", text: "You send the request with your phone, address, date and problem." },
  { status: "accepted", who: "Technician", text: "The technician confirms they can take the job (or rejects it)." },
  { status: "in-progress", who: "Technician", text: "Work starts. You can see your device is being handled." },
  { status: "completed", who: "Technician", text: "Job done. The technician confirms the final amount." },
];

const ROLES = [
  {
    icon: UserRound,
    title: "Customers",
    points: ["Browse approved services by category, mode and price", "Send a repair request in under a minute", "Cancel while the request is still pending", "Pay with Stripe only after completion"],
  },
  {
    icon: Wrench,
    title: "Technicians",
    points: ["List services with photos, prices and coverage area", "Accept or reject incoming requests", "Move jobs through a clear status pipeline", "Set the final amount when the job is done"],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: ["Approve or reject every service listing", "Manage users and their roles", "Monitor all repair jobs on the platform", "Track every Stripe transaction and revenue"],
  },
];

const FAQ = [
  ["Do I pay before the repair?", "No. The Pay Now button only appears after the technician marks your job completed. Until then you pay nothing."],
  ["Who checks the technicians?", "Every service is reviewed by a FixMate admin before it is visible. Edited services go back for review."],
  ["Can I cancel a request?", "Yes, while it is still Requested. Once the technician accepts, the job is in their hands."],
  ["Is online payment safe?", "Payments are processed by Stripe Checkout. FixMate never sees or stores your card details."],
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="section-eyebrow">About FixMate</span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">A repair service where nothing happens in the dark.</h1>
          <p className="section-lead">
            Handing over a phone or calling someone to fix the AC usually means guessing — about the price, the progress,
            and whether you are paying for work that was actually done. FixMate gives every repair a visible status and
            moves payment to the very end.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-primary btn-lg">
              Find a service <ArrowRight className="size-4" />
            </Link>
            <Link href="/sign-up" className="btn btn-outline btn-lg">
              Join as technician
            </Link>
          </div>
        </div>
        <div className="relative">
          <img src={IMAGES.about} alt="Repair tools laid out on a workbench" className="aspect-[4/3] w-full rounded-[2rem] border-8 border-white object-cover shadow-[var(--shadow-lift)]" />
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-pine-800 px-5 py-4 text-white shadow-[var(--shadow-lift)]">
            <BadgeCheck className="size-8 text-lime-400" />
            <div>
              <p className="font-display text-2xl font-extrabold">100%</p>
              <p className="text-xs text-white/70">of listings admin-reviewed</p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20">
        <div className="container-x">
          <div className="text-center">
            <span className="section-eyebrow">The job pipeline</span>
            <h2 className="section-title mt-3">Every job, one clear status at a time</h2>
            <p className="section-lead mx-auto">Only a Requested job can branch off — rejected by the technician or cancelled by you. Every other step moves one stage forward.</p>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {PIPELINE.map((p, i) => (
              <li key={p.status} className="card flex flex-col p-5">
                <span className="text-xs font-bold text-muted">STEP {i + 1}</span>
                <div className="mt-2">
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{p.text}</p>
                <p className="mt-auto pt-4 text-xs font-semibold text-pine-700">Changed by: {p.who}</p>
              </li>
            ))}
            <li className="flex flex-col rounded-[var(--radius-card)] bg-pine-800 p-5 text-white">
              <span className="text-xs font-bold text-white/60">STEP 5</span>
              <div className="mt-2">
                <PaymentBadge status="paid" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/80">You pay the final amount with Stripe. The job is marked paid — once.</p>
              <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold text-lime-300">
                <CreditCard className="size-3.5" /> Changed by: Stripe
              </p>
            </li>
          </ol>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
            <span>Side exits from Requested:</span>
            <StatusBadge status="rejected" />
            <StatusBadge status="cancelled" />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="text-center">
            <span className="section-eyebrow">Built for three roles</span>
            <h2 className="section-title mt-3">One platform, a dashboard for everyone</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-cream p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-pine-700 text-lime-400">
                  <r.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{r.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-ink/80">
                      <ClipboardList className="mt-0.5 size-4 shrink-0 text-pine-500" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title mt-3">Questions people ask us</h2>
            <p className="section-lead">Still unsure? Write to support@fixmate.com and a real person will reply.</p>
          </div>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card group p-5 open:shadow-[var(--shadow-lift)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-pine-50 text-pine-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
