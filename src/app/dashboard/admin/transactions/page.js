"use client";

import { ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { PageHeader, StatsCard } from "@/components/dashboard/Widgets";
import DataTable from "@/components/dashboard/DataTable";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { useApi } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/constants";

const columns = [
  {
    key: "customer",
    header: "Customer",
    render: (p) => (
      <div className="text-left">
        <p className="font-semibold">{p.customerName}</p>
        <p className="text-xs text-muted">{p.customerEmail}</p>
      </div>
    ),
  },
  { key: "technicianName", header: "Technician" },
  { key: "serviceTitle", header: "Service", render: (p) => <span className="font-medium">{p.serviceTitle}</span> },
  { key: "amount", header: "Amount", render: (p) => <span className="font-bold text-pine-700">{formatPrice(p.amount)}</span> },
  { key: "transactionId", header: "Transaction ID", render: (p) => <code className="rounded bg-sand px-1.5 py-0.5 text-xs break-all">{p.transactionId}</code> },
  { key: "paidAt", header: "Payment date", render: (p) => formatDateTime(p.paidAt), className: "whitespace-nowrap" },
];

export default function TransactionsPage() {
  const { data, loading, error, reload } = useApi("/api/admin/payments");
  const items = data?.items || [];

  return (
    <>
      <PageHeader title="Transactions" description="Every Stripe payment recorded on FixMate." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center justify-between bg-pine-800 p-5 text-white sm:col-span-1">
          <div>
            <p className="text-sm text-white/70">Total revenue</p>
            <p className="mt-1 font-display text-4xl font-extrabold">{loading ? "…" : formatPrice(data?.totalRevenue)}</p>
          </div>
          <span className="grid size-12 place-items-center rounded-2xl bg-lime-400 text-ink">
            <Wallet className="size-6" />
          </span>
        </div>
        <StatsCard label="Transactions" value={items.length} icon={ReceiptText} loading={loading} />
        <StatsCard label="Average job value" value={formatPrice(items.length ? data.totalRevenue / items.length : 0)} icon={TrendingUp} tone="lime" loading={loading} />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : items.length ? (
        <DataTable columns={columns} rows={items} />
      ) : (
        <EmptyState icon={ReceiptText} title="No transactions yet" message="Payments appear here once customers pay for completed jobs." />
      )}
    </>
  );
}
