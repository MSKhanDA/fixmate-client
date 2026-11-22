"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Wallet, Wrench } from "lucide-react";
import { ChartCard, PageHeader, StatsCard, StatsGrid } from "@/components/dashboard/Widgets";
import { DonutChart, RevenueChart, SimpleBarChart } from "@/components/dashboard/Charts";
import { ErrorState } from "@/components/ui/Feedback";
import { STATUS_COLORS, statusLabel } from "@/components/ui/Badges";
import { useApi } from "@/lib/api";
import { formatPrice } from "@/lib/constants";

/** Last six month keys ("YYYY-MM"), oldest first, so empty months still show on the chart. */
function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1));
    return { key: d.toISOString().slice(0, 7), label: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) };
  });
}

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi("/api/admin/stats");
  const s = data || {};

  const revenue = lastSixMonths().map((m) => ({ label: m.label, value: s.revenueByMonth?.find((r) => r.month === m.key)?.total || 0 }));
  const statuses = Object.keys(STATUS_COLORS).map((st) => ({
    name: statusLabel(st),
    value: s.bookingsByStatus?.find((b) => b.status === st)?.count || 0,
    color: STATUS_COLORS[st],
  }));
  const categories = (s.servicesByCategory || []).map((c) => ({ label: c.category.replace(" & PC", "").replace("Washing Machine", "Washer"), value: c.count }));

  return (
    <>
      <PageHeader title="Admin dashboard" description="Platform health: users, services awaiting review, jobs and revenue." />
      {error && <ErrorState error={error} onRetry={reload} />}

      <StatsGrid>
        <StatsCard label="Total Users" value={s.totalUsers} icon={Users} loading={loading} hint={`${s.totalCustomers ?? 0} customers`} />
        <StatsCard label="Total Technicians" value={s.totalTechnicians} icon={Wrench} tone="violet" loading={loading} />
        <StatsCard label="Pending Services" value={s.pendingServices} icon={ShieldCheck} tone="amber" loading={loading} hint={`${s.approvedServices ?? 0} approved and live`} />
      </StatsGrid>

      {!loading && s.pendingServices > 0 && (
        <Link href="/dashboard/admin/services" className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100">
          {s.pendingServices} service{s.pendingServices > 1 ? "s are" : " is"} waiting for your review
          <ArrowRight className="size-4" />
        </Link>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Revenue — last 6 months" description="Stripe payments recorded on the platform.">
          {loading ? <div className="skeleton h-60" /> : <RevenueChart data={revenue} />}
        </ChartCard>
        <div className="card flex flex-col justify-between bg-pine-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Total revenue</p>
            <span className="grid size-11 place-items-center rounded-2xl bg-lime-400 text-ink">
              <Wallet className="size-5" />
            </span>
          </div>
          <p className="mt-4 font-display text-5xl font-extrabold">{loading ? "…" : formatPrice(s.totalRevenue)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm">
            <div>
              <p className="text-white/60">All bookings</p>
              <p className="text-xl font-bold">{s.totalBookings ?? "…"}</p>
            </div>
            <div>
              <p className="text-white/60">Paid jobs</p>
              <p className="text-xl font-bold">{s.paidBookings ?? "…"}</p>
            </div>
          </div>
          <Link href="/dashboard/admin/transactions" className="btn btn-accent mt-6">
            View transactions <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Bookings by status">{loading ? <div className="skeleton h-48" /> : <DonutChart data={statuses} centerLabel="Bookings" />}</ChartCard>
        <ChartCard title="Services by category">{loading ? <div className="skeleton h-60" /> : <SimpleBarChart data={categories} color="#1f7a63" />}</ChartCard>
      </div>
    </>
  );
}
