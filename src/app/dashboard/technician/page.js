"use client";

import Link from "next/link";
import { BadgeCheck, ClipboardList, DollarSign, PlusCircle, Wrench } from "lucide-react";
import { ChartCard, PageHeader, StatsCard, StatsGrid } from "@/components/dashboard/Widgets";
import { DonutChart, SimpleBarChart } from "@/components/dashboard/Charts";
import { ErrorState } from "@/components/ui/Feedback";
import { STATUS_COLORS, statusLabel } from "@/components/ui/Badges";
import { useApi } from "@/lib/api";
import { formatPrice } from "@/lib/constants";

export default function TechnicianOverview() {
  const services = useApi("/api/services/mine");
  const jobs = useApi("/api/bookings/technician");
  const loading = services.loading || jobs.loading;
  const s = services.data || [];
  const b = jobs.data || [];

  const earnings = b.filter((x) => x.paymentStatus === "paid").reduce((sum, x) => sum + x.finalAmount, 0);
  const byStatus = Object.keys(STATUS_COLORS).map((st) => ({
    label: statusLabel(st),
    value: b.filter((x) => x.status === st).length,
    color: STATUS_COLORS[st],
  }));
  const approval = [
    { name: "Approved", value: s.filter((x) => x.approvalStatus === "approved").length, color: "#059669" },
    { name: "Pending", value: s.filter((x) => x.approvalStatus === "pending").length, color: "#d97706" },
    { name: "Rejected", value: s.filter((x) => x.approvalStatus === "rejected").length, color: "#dc2626" },
  ];

  return (
    <>
      <PageHeader
        title="Technician dashboard"
        description="Your services, incoming jobs and earnings at a glance."
        action={
          <Link href="/dashboard/technician/add-service" className="btn btn-primary">
            <PlusCircle className="size-4" /> Add a service
          </Link>
        }
      />
      {(services.error || jobs.error) && <ErrorState error={services.error || jobs.error} onRetry={() => (services.reload(), jobs.reload())} />}

      <StatsGrid>
        <StatsCard label="Total Services" value={s.length} icon={Wrench} loading={loading} />
        <StatsCard label="Approved Services" value={approval[0].value} icon={BadgeCheck} tone="emerald" loading={loading} hint={`${approval[1].value} waiting for review`} />
        <StatsCard label="Pending Requests" value={b.filter((x) => x.status === "requested").length} icon={ClipboardList} tone="blue" loading={loading} hint="Waiting for you to accept or reject" />
      </StatsGrid>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Jobs by status" description="All repair requests you have received.">
          {loading ? <div className="skeleton h-60" /> : <SimpleBarChart data={byStatus} />}
        </ChartCard>
        <div className="space-y-6">
          <div className="card flex items-center justify-between gap-4 bg-pine-800 p-6 text-white">
            <div>
              <p className="text-sm text-white/70">Earnings from paid jobs</p>
              <p className="mt-1 font-display text-4xl font-extrabold">{loading ? "…" : formatPrice(earnings)}</p>
            </div>
            <span className="grid size-12 place-items-center rounded-2xl bg-lime-400 text-ink">
              <DollarSign className="size-6" />
            </span>
          </div>
          <ChartCard title="Service approval">{loading ? <div className="skeleton h-48" /> : <DonutChart data={approval} centerLabel="Services" />}</ChartCard>
        </div>
      </div>
    </>
  );
}
