"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import { FilterPills, PageHeader } from "@/components/dashboard/Widgets";
import DataTable, { ServiceCell } from "@/components/dashboard/DataTable";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { useApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/constants";

const FILTERS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const columns = [
  { key: "service", header: "", render: (b) => <ServiceCell image={b.serviceImage} title={b.serviceTitle} subtitle={b.category} /> },
  {
    key: "customer",
    header: "Customer",
    render: (b) => (
      <div className="text-left">
        <p className="font-semibold">{b.customerName}</p>
        <p className="text-xs text-muted">{b.customerEmail}</p>
      </div>
    ),
  },
  {
    key: "technician",
    header: "Technician",
    render: (b) => (
      <div className="text-left">
        <p className="font-semibold">{b.technicianName}</p>
        <p className="text-xs text-muted">{b.technicianEmail}</p>
      </div>
    ),
  },
  { key: "date", header: "Date", render: (b) => formatDate(b.preferredDate), className: "whitespace-nowrap" },
  { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
  { key: "payment", header: "Payment", render: (b) => <PaymentBadge status={b.paymentStatus} /> },
  { key: "amount", header: "Amount", render: (b) => <span className="font-bold">{formatPrice(b.finalAmount)}</span>, className: "text-right" },
];

/** Read-only list; the status filter is applied by the API. */
export default function AllBookingsPage() {
  const [status, setStatus] = useState("");
  const { data, loading, error, reload } = useApi(`/api/admin/bookings${status ? `?status=${status}` : ""}`);
  const bookings = data || [];

  return (
    <>
      <PageHeader title="All bookings" description="Every repair job on the platform (read-only)." />
      <FilterPills value={status} onChange={setStatus} options={FILTERS} />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : bookings.length ? (
        <DataTable columns={columns} rows={bookings} />
      ) : (
        <EmptyState icon={ListChecks} title="No bookings" message={status ? "No bookings with this status." : "No repair requests have been made yet."} />
      )}
    </>
  );
}
