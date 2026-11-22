import { Suspense } from "react";
import { SearchX } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters from "@/components/services/ServiceFilters";
import Pagination from "@/components/services/Pagination";
import { EmptyState } from "@/components/ui/Feedback";
import { publicFetch } from "@/lib/public-api";

export const metadata = { title: "Browse Services" };

const PAGE_SIZE = 9;
const KEYS = ["search", "category", "mode", "sort", "page"];

export default async function ServicesPage({ searchParams }) {
  const raw = await searchParams;
  const query = new URLSearchParams();
  for (const key of KEYS) {
    const value = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
    if (value) query.set(key, value);
  }

  const apiQuery = new URLSearchParams(query);
  apiQuery.set("limit", String(PAGE_SIZE));
  const data = (await publicFetch(`/api/services?${apiQuery}`)) || { items: [], total: 0, page: 1, totalPages: 1 };
  const filtered = ["search", "category", "mode"].some((k) => query.get(k));

  return (
    <div className="container-x py-12 lg:py-16">
      <span className="section-eyebrow">Browse services</span>
      <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <h1 className="section-title">{query.get("category") ? `${query.get("category")} repair services` : "All repair services"}</h1>
        <p className="text-sm font-medium text-muted">
          {data.total} service{data.total === 1 ? "" : "s"} found
        </p>
      </div>
      <p className="section-lead">Every listing here is approved by FixMate and currently accepting requests.</p>

      <div className="mt-8">
        <Suspense fallback={<div className="card skeleton h-[74px]" />}>
          <ServiceFilters key={query.get("search") || ""} />
        </Suspense>
      </div>

      <div className="mt-8">
        {data.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={filtered ? "No services match your search" : "No services available yet"}
            message={filtered ? "Try another keyword, or clear the filters to see everything." : "Check back soon — technicians are adding services."}
            actionLabel={filtered ? "Clear filters" : undefined}
            actionHref={filtered ? "/services" : undefined}
          />
        )}
      </div>

      <Pagination page={data.page} totalPages={data.totalPages} searchParams={query.toString()} />
    </div>
  );
}
