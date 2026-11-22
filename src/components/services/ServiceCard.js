/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, Home, MapPin, Store, UserRound } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { CATEGORY_ICONS } from "./categoryIcons";

/** Equal-size service card used on Home and Browse Services. */
export default function ServiceCard({ service, showArea = true }) {
  const Icon = CATEGORY_ICONS[service.category];
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-pine-800 shadow-sm backdrop-blur">
          {Icon && <Icon className="size-3.5" />} {service.category}
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <ModeIcon className="mr-1 inline size-3.5 -translate-y-px" />
          {service.serviceMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-snug font-bold">{service.title}</h3>

        <div className="mt-3 mb-5 space-y-1.5 text-sm text-muted">
          <p className="flex items-center gap-2 truncate">
            <UserRound className="size-4 shrink-0 text-pine-500" /> {service.technicianName}
          </p>
          {showArea && (
            <p className="flex items-center gap-2 truncate">
              <MapPin className="size-4 shrink-0 text-pine-500" /> {service.serviceArea}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">Starting at</p>
            <p className="font-display text-2xl font-extrabold text-pine-700">{formatPrice(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service._id}`} className="btn btn-primary btn-sm">
            View Details <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
