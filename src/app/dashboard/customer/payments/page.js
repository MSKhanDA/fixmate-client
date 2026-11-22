"use client";

import { ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/Widgets";
import DataTable from "@/components/dashboard/DataTable";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { useApi } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/constants";

const columns = [
  { key: "serviceTitle", header: "Service", render: (p) => <span className="font-bold">{p.serviceTitle}</span> },
  { key: "technicianName", header: "Technician" },
  { key: "amount", header: "Amount", render: (p) => <span className="font-bold text-pine-700">{formatPrice(p.amount)}</span> },
  { key: "transactionId", header: "Transaction ID", render: (p) => <code className="rounded bg-sand px-1.5 py-0.5 text-xs break-all">{p.transactionId}</code> },
  { key: "paidAt", header: "Payment date", render: (p) => formatDateTime(p.paidAt), className: "whitespace-nowrap" },
];

export default function PaymentHistoryPage() {
  const { data, loading, error, reload } = useApi("/api/payments/my");
  const payments = data || [];
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payment history"
        description="Every repair you have paid for through Stripe."
        action={
          payments.length > 0 && (
            <div className="rounded-2xl bg-pine-800 px-5 py-3 text-white">
              <p className="text-xs text-white/70">Total paid</p>
              <p className="font-display text-2xl font-extrabold">{formatPrice(total)}</p>
            </div>
          )
        }
      />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : payments.length ? (
        <DataTable columns={columns} rows={payments} />
      ) : (
        <EmptyState icon={ReceiptText} title="No payments yet" message="Completed jobs can be paid from My Bookings." actionLabel="Go to My Bookings" actionHref="/dashboard/customer/bookings" />
      )}
    </>
  );
}
