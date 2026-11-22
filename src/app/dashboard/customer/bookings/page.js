"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, CreditCard, GitCommitVertical, Loader2, XCircle } from "lucide-react";
import { PageHeader, FilterPills } from "@/components/dashboard/Widgets";
import DataTable, { ServiceCell } from "@/components/dashboard/DataTable";
import JobTimeline from "@/components/dashboard/JobTimeline";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { api, useApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/constants";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Rejected / Cancelled" },
];

const matches = (b, f) =>
  f === "all" ||
  (f === "active" && ["requested", "accepted", "in-progress"].includes(b.status)) ||
  (f === "completed" && b.status === "completed") ||
  (f === "closed" && ["rejected", "cancelled"].includes(b.status));

export default function MyBookingsPage() {
  const { data, loading, error, reload, setData } = useApi("/api/bookings/my");
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(null);
  const [tracking, setTracking] = useState(null);

  const bookings = data || [];
  const rows = bookings.filter((b) => matches(b, filter));

  async function confirmCancel() {
    setCancelling(true);
    try {
      const updated = await api.patch(`/api/bookings/${cancelTarget._id}/cancel`);
      setData((list) => list.map((b) => (b._id === updated._id ? updated : b)));
      toast.success("Request cancelled");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(booking) {
    setPaying(booking._id);
    try {
      const { url } = await api.post("/api/payments/create-checkout-session", { bookingId: booking._id });
      toast.loading("Redirecting to secure Stripe checkout…");
      window.location.assign(url);
    } catch (err) {
      toast.error(err.message);
      setPaying(null);
    }
  }

  const columns = [
    { key: "service", header: "", render: (b) => <ServiceCell image={b.serviceImage} title={b.serviceTitle} subtitle={b.category} /> },
    { key: "technician", header: "Technician", render: (b) => <span className="font-medium">{b.technicianName}</span> },
    { key: "date", header: "Preferred date", render: (b) => formatDate(b.preferredDate), className: "whitespace-nowrap" },
    {
      key: "amount",
      header: "Amount",
      render: (b) =>
        b.status === "completed" ? (
          <span className="font-bold text-pine-700">{formatPrice(b.finalAmount)}</span>
        ) : (
          <span className="text-muted">from {formatPrice(b.basePrice)}</span>
        ),
      className: "whitespace-nowrap",
    },
    { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
    { key: "payment", header: "Payment", render: (b) => <PaymentBadge status={b.paymentStatus} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (b) => (
        <div className="flex flex-wrap justify-end gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setTracking(b)} title="Track job">
            <GitCommitVertical className="size-3.5" /> Track
          </button>
          {b.status === "requested" && (
            <button className="btn btn-outline btn-sm text-red-600" onClick={() => setCancelTarget(b)}>
              <XCircle className="size-3.5" /> Cancel
            </button>
          )}
          {b.status === "completed" && b.paymentStatus === "unpaid" && (
            <button className="btn btn-accent btn-sm" onClick={() => payNow(b)} disabled={paying === b._id}>
              {paying === b._id ? <Loader2 className="size-3.5 animate-spin" /> : <CreditCard className="size-3.5" />} Pay Now
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My bookings" description="Every repair request you have sent, with its live status." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings yet" message="When you request a repair it will show up here." actionLabel="Browse services" actionHref="/services" />
      ) : (
        <>
          <FilterPills value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ ...f, count: bookings.filter((b) => matches(b, f.value)).length }))} />
          {rows.length ? <DataTable columns={columns} rows={rows} /> : <EmptyState title="Nothing here" message="No bookings match this filter." />}
        </>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this request?"
        message={`Your request for "${cancelTarget?.serviceTitle}" will be cancelled. This can't be undone, but you can send a new request later.`}
        confirmLabel="Yes, cancel request"
      />

      <Modal open={!!tracking} onClose={() => setTracking(null)} title="Job tracker" size="sm">
        {tracking && (
          <>
            <ServiceCell image={tracking.serviceImage} title={tracking.serviceTitle} subtitle={`by ${tracking.technicianName}`} />
            <div className="mt-6">
              <JobTimeline booking={tracking} />
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
