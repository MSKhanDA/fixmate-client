"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, ClipboardList, Hammer, Search } from "lucide-react";
import { ChartCard, PageHeader, StatsCard, StatsGrid } from "@/components/dashboard/Widgets";
import { DonutChart } from "@/components/dashboard/Charts";
import { ServiceCell } from "@/components/dashboard/DataTable";
import { PaymentBadge, STATUS_COLORS, StatusBadge, statusLabel } from "@/components/ui/Badges";
import { EmptyState, ErrorState } from "@/components/ui/Feedback";
import { useApi } from "@/lib/api";
import { formatDate } from "@/lib/constants";

const ACTIVE = ["requested", "accepted", "in-progress"];

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi("/api/bookings/my");
  const bookings = data || [];
  const count = (fn) => bookings.filter(fn).length;

  const chart = Object.keys(STATUS_COLORS).map((s) => ({ name: statusLabel(s), value: count((b) => b.status === s), color: STATUS_COLORS[s] }));

  return (
    <>
      <PageHeader
        title="Customer dashboard"
        description="An overview of your repair requests."
        action={
          <Link href="/services" className="btn btn-primary">
            <Search className="size-4" /> Find a service
          </Link>
        }
      />
      {error && <ErrorState error={error} onRetry={reload} />}

      <StatsGrid>
        <StatsCard label="Total Requests" value={bookings.length} icon={ClipboardList} loading={loading} />
        <StatsCard label="Active Jobs" value={count((b) => ACTIVE.includes(b.status))} icon={Hammer} tone="amber" loading={loading} hint="Requested, accepted or in progress" />
        <StatsCard label="Completed Jobs" value={count((b) => b.status === "completed")} icon={CheckCircle2} tone="emerald" loading={loading} />
      </StatsGrid>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <ChartCard title="Jobs by status" description="Where each of your requests stands right now.">
          {loading ? <div className="skeleton h-48" /> : <DonutChart data={chart} centerLabel="Requests" />}
        </ChartCard>

        <ChartCard title="Recent requests">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-14" />
              ))}
            </div>
          ) : bookings.length ? (
            <ul className="divide-y divide-line">
              {bookings.slice(0, 5).map((b) => (
                <li key={b._id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <ServiceCell image={b.serviceImage} title={b.serviceTitle} subtitle={`${b.technicianName} · ${formatDate(b.preferredDate)}`} />
                  <div className="flex shrink-0 gap-2">
                    <StatusBadge status={b.status} />
                    {b.status === "completed" && <PaymentBadge status={b.paymentStatus} />}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarCheck} title="No requests yet" message="Find a service and send your first repair request." actionLabel="Browse services" actionHref="/services" />
          )}
          {bookings.length > 0 && (
            <Link href="/dashboard/customer/bookings" className="btn btn-outline btn-sm mt-3">
              View all bookings
            </Link>
          )}
        </ChartCard>
      </div>
    </>
  );
}
