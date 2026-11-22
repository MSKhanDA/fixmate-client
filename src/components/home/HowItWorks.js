import { CreditCard, Search, Send, Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  { icon: Search, title: "Find a Service", text: "Search by device or problem, compare prices, modes and technician profiles." },
  { icon: Send, title: "Send a Request", text: "Describe the issue, pick a date and share your address. No payment needed yet." },
  { icon: Wrench, title: "Technician Fixes It", text: "Watch the job move from Accepted to In Progress to Completed in real time." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay the final amount securely with Stripe, only once the work is delivered." },
];

export default function HowItWorks({ standalone = false }) {
  return (
    <section className={standalone ? "" : "bg-white py-20"}>
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="How FixMate works"
          title="From broken to fixed in four clear steps"
          lead="Every job has a visible status, so you always know who is working on your device and what happens next."
        />
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-10 right-[12%] left-[12%] hidden h-0.5 border-t-2 border-dashed border-pine-200 lg:block" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex h-full flex-col items-center rounded-[var(--radius-card)] border border-line bg-cream p-6 text-center">
              <span className="relative grid size-20 place-items-center rounded-3xl bg-pine-700 text-lime-400 shadow-[var(--shadow-card)]">
                <s.icon className="size-8" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-lime-400 text-xs font-extrabold text-ink ring-4 ring-cream">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
