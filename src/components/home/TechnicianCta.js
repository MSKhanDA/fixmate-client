import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export default function TechnicianCta() {
  return (
    <section className="pb-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-pine-800 px-6 py-12 text-white sm:px-12 lg:py-16">
          <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
          <Wrench className="absolute -right-10 -bottom-10 size-64 rotate-12 text-white/5" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-lime-400 px-3 py-1 text-xs font-bold tracking-widest text-ink uppercase">For technicians</span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Skilled with tools? Bring your repair shop online.</h2>
              <p className="mt-3 text-white/75">
                List your services, receive structured repair requests, move jobs through a clear pipeline and get paid
                through Stripe — all from one dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn btn-accent btn-lg">
                Join as Technician <ArrowRight className="size-4" />
              </Link>
              <Link href="/about" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
