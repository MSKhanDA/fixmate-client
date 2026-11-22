/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarClock, ChevronRight, Clock3, Home, MapPin, ShieldCheck, Store, Wallet } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import RequestRepair from "@/components/services/RequestRepair";
import { CATEGORY_ICONS } from "@/components/services/categoryIcons";
import { publicFetch } from "@/lib/public-api";
import { getSession, toClientUser } from "@/lib/session";
import { formatPrice } from "@/lib/constants";

async function getService(id) {
  return /^[a-f\d]{24}$/i.test(id) ? publicFetch(`/api/services/${id}`) : null;
}

export async function generateMetadata({ params }) {
  const service = await getService((await params).id);
  return { title: service?.title || "Service not found" };
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  const [service, session] = await Promise.all([getService(id), getSession()]);
  if (!service) notFound(); // missing, unapproved or unavailable

  const Icon = CATEGORY_ICONS[service.category];
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const facts = [
    { icon: Wallet, label: "Starting price", value: formatPrice(service.basePrice) },
    { icon: Clock3, label: "Estimated duration", value: service.estimatedDuration },
    { icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <div className="container-x py-10 lg:py-14">
      <nav className="flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-pine-700">Home</Link>
        <ChevronRight className="size-4" />
        <Link href="/services" className="hover:text-pine-700">Services</Link>
        <ChevronRight className="size-4" />
        <span className="truncate font-medium text-ink">{service.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] border-8 border-white bg-sand shadow-[var(--shadow-card)]">
            <img src={service.image} alt={service.title} className="aspect-[16/9] w-full object-cover" />
          </div>

          <div className="mt-8">
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-pine-50 px-3 py-1 text-xs font-bold text-pine-800 hover:bg-pine-100"
            >
              {Icon && <Icon className="size-3.5" />} {service.category}
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{service.title}</h1>

            <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="card p-4">
                  <f.icon className="size-5 text-pine-600" />
                  <dt className="mt-2 text-xs font-semibold text-muted">{f.label}</dt>
                  <dd className="mt-0.5 font-bold">{f.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 text-xl font-bold">What this service includes</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-ink/80">{service.description}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [ShieldCheck, "Admin-approved listing"],
                [CalendarClock, "Track every status update"],
                [BadgeCheck, "Pay only after completion"],
              ].map(([I, t]) => (
                <div key={t} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold">
                  <I className="size-5 shrink-0 text-pine-600" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-xs font-bold tracking-wider text-muted uppercase">Starting at</p>
            <p className="font-display text-4xl font-extrabold text-pine-700">{formatPrice(service.basePrice)}</p>
            <p className="mt-1 text-sm text-muted">Final amount is confirmed by the technician when the job is completed.</p>
            <div className="mt-6">
              <RequestRepair service={service} user={toClientUser(session?.user)} />
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs font-bold tracking-wider text-muted uppercase">Your technician</p>
            <div className="mt-4 flex items-center gap-4">
              <Avatar src={service.technician.image} name={service.technician.name} size="lg" />
              <div>
                <p className="flex items-center gap-1.5 text-lg font-bold">
                  {service.technician.name} <BadgeCheck className="size-5 text-pine-500" />
                </p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  <MapPin className="size-4" /> {service.technician.area}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/80">
              {service.technician.bio || "Verified FixMate technician."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
