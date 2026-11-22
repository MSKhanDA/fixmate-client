"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, CheckCheck, ClipboardList, Loader2, MapPin, Phone, Play, X } from "lucide-react";
import { FilterPills, PageHeader } from "@/components/dashboard/Widgets";
import DataTable from "@/components/dashboard/DataTable";
import Field from "@/components/ui/Field";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import { PaymentBadge, StatusBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { api, useApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/constants";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function ManageRequestsPage() {
  const { data, loading, error, reload, setData } = useApi("/api/bookings/technician");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const bookings = data || [];
  const rows = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  async function changeStatus(booking, status, extra = {}) {
    setBusy(booking._id);
    try {
      const updated = await api.patch(`/api/bookings/${booking._id}/status`, { status, ...extra });
      setData((list) => list.map((b) => (b._id === updated._id ? updated : b)));
      const messages = { accepted: "Request accepted", rejected: "Request rejected", "in-progress": "Work started", completed: "Job marked completed" };
      toast.success(messages[status]);
      return true;
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) reload();
      return false;
    } finally {
      setBusy(null);
    }
  }

  function openComplete(b) {
    setAmount(String(b.basePrice));
    setAmountError("");
    setCompleting(b);
  }

  async function submitComplete(e) {
    e.preventDefault();
    if (!(Number(amount) > 0)) return setAmountError("Enter a final amount greater than 0");
    if (await changeStatus(completing, "completed", { finalAmount: Number(amount) })) setCompleting(null);
  }

  const actions = (b) => {
    const loadingNow = busy === b._id;
    const spin = loadingNow && <Loader2 className="size-3.5 animate-spin" />;
    switch (b.status) {
      case "requested":
        return (
          <div className="flex justify-end gap-2">
            <button className="btn btn-primary btn-sm" disabled={loadingNow} onClick={() => changeStatus(b, "accepted")}>
              {spin || <Check className="size-3.5" />} Accept
            </button>
            <button className="btn btn-outline btn-sm text-red-600" disabled={loadingNow} onClick={() => setRejecting(b)}>
              <X className="size-3.5" /> Reject
            </button>
          </div>
        );
      case "accepted":
        return (
          <button className="btn btn-primary btn-sm" disabled={loadingNow} onClick={() => changeStatus(b, "in-progress")}>
            {spin || <Play className="size-3.5" />} Start Work
          </button>
        );
      case "in-progress":
        return (
          <button className="btn btn-accent btn-sm" disabled={loadingNow} onClick={() => openComplete(b)}>
            <CheckCheck className="size-3.5" /> Mark Completed
          </button>
        );
      case "completed":
        return <PaymentBadge status={b.paymentStatus} />;
      default:
        return <span className="text-xs text-muted">No action</span>;
    }
  };

  const columns = [
    {
      key: "customer",
      header: "Customer",
      render: (b) => (
        <div className="min-w-0 text-left">
          <p className="font-bold">{b.customerName}</p>
          <p className="flex items-center gap-1 text-xs text-muted">
            <Phone className="size-3" /> {b.customerPhone}
          </p>
          <p className="flex items-start gap-1 text-xs text-muted">
            <MapPin className="mt-0.5 size-3 shrink-0" /> {b.address}
          </p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service & problem",
      render: (b) => (
        <div className="max-w-xs text-left">
          <p className="font-semibold">{b.serviceTitle}</p>
          <p className="line-clamp-3 text-xs text-muted" title={b.problemDescription}>
            {b.problemDescription}
          </p>
        </div>
      ),
    },
    { key: "date", header: "Preferred date", render: (b) => formatDate(b.preferredDate), className: "whitespace-nowrap" },
    {
      key: "amount",
      header: "Amount",
      render: (b) => <span className="font-semibold whitespace-nowrap">{formatPrice(b.status === "completed" ? b.finalAmount : b.basePrice)}</span>,
    },
    { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
    { key: "actions", header: "Actions", className: "text-right", render: actions },
  ];

  return (
    <>
      <PageHeader title="Manage requests" description="Move each job one step forward: accept, start work, then complete with the final amount." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests yet" message="When customers request your services they will appear here." actionLabel="Manage my services" actionHref="/dashboard/technician/my-services" />
      ) : (
        <>
          <FilterPills value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ ...f, count: f.value === "all" ? bookings.length : bookings.filter((b) => b.status === f.value).length }))} />
          {rows.length ? <DataTable columns={columns} rows={rows} /> : <EmptyState title="Nothing here" message="No requests with this status." />}
        </>
      )}

      <ConfirmModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={async () => (await changeStatus(rejecting, "rejected")) && setRejecting(null)}
        loading={busy === rejecting?._id}
        title="Reject this request?"
        message={`${rejecting?.customerName}'s request for "${rejecting?.serviceTitle}" will be rejected. This is final.`}
        confirmLabel="Reject request"
      />

      <Modal open={!!completing} onClose={() => setCompleting(null)} title="Mark job completed" size="sm">
        <form onSubmit={submitComplete} noValidate>
          <p className="text-sm text-muted">
            Confirm the final amount for <span className="font-semibold text-ink">{completing?.serviceTitle}</span>. The customer will be asked to pay this
            amount.
          </p>
          <Field label="Final amount (USD)" htmlFor="final-amount" error={amountError} className="mt-4" hint={`Base price: ${formatPrice(completing?.basePrice)}`}>
            <input
              id="final-amount"
              type="number"
              min="1"
              step="0.01"
              className={`input ${amountError ? "input-error" : ""}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError("");
              }}
              autoFocus
            />
          </Field>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setCompleting(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy === completing?._id}>
              {busy === completing?._id && <Loader2 className="size-4 animate-spin" />} Mark Completed
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
