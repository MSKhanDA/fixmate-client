"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink, ShieldCheck, X } from "lucide-react";
import { FilterPills, PageHeader } from "@/components/dashboard/Widgets";
import DataTable, { ServiceCell } from "@/components/dashboard/DataTable";
import { ApprovalBadge } from "@/components/ui/Badges";
import { ConfirmModal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { api, useApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/constants";

export default function ServiceApprovalPage() {
  const { data, loading, error, reload, setData } = useApi("/api/admin/services");
  const [filter, setFilter] = useState("pending"); // pending first by default
  const [busy, setBusy] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const services = data || [];
  const rows = filter === "all" ? services : services.filter((s) => s.approvalStatus === filter);

  async function decide(service, approvalStatus) {
    setBusy(service._id);
    try {
      const updated = await api.patch(`/api/admin/services/${service._id}/approval`, { approvalStatus });
      setData((list) => list.map((s) => (s._id === updated._id ? updated : s)));
      toast.success(approvalStatus === "approved" ? "Service approved and live" : "Service rejected");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusy(null);
    }
  }

  const columns = [
    { key: "service", header: "", render: (s) => <ServiceCell image={s.image} title={s.title} subtitle={`${s.category} · ${s.serviceMode}`} /> },
    {
      key: "tech",
      header: "Technician",
      render: (s) => (
        <div className="text-left">
          <p className="font-semibold">{s.technicianName}</p>
          <p className="text-xs text-muted">{s.technicianEmail}</p>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (s) => <span className="font-bold">{formatPrice(s.basePrice)}</span> },
    { key: "created", header: "Submitted", render: (s) => formatDate(s.updatedAt || s.createdAt), className: "whitespace-nowrap" },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <div className="flex flex-col items-end gap-1 md:items-start">
          <ApprovalBadge status={s.approvalStatus} />
          {!s.isAvailable && <span className="text-[11px] text-muted">Hidden by technician</span>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (s) => (
        <div className="flex flex-wrap justify-end gap-2">
          {s.approvalStatus === "approved" && s.isAvailable && (
            <Link href={`/services/${s._id}`} target="_blank" className="btn btn-ghost btn-sm" title="View public page">
              <ExternalLink className="size-3.5" />
            </Link>
          )}
          {s.approvalStatus !== "approved" && (
            <button className="btn btn-primary btn-sm" disabled={busy === s._id} onClick={() => decide(s, "approved")}>
              <Check className="size-3.5" /> Approve
            </button>
          )}
          {s.approvalStatus !== "rejected" && (
            <button className="btn btn-outline btn-sm text-red-600" disabled={busy === s._id} onClick={() => setRejecting(s)}>
              <X className="size-3.5" /> Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  const count = (st) => services.filter((s) => s.approvalStatus === st).length;

  return (
    <>
      <PageHeader title="Service approval" description="Only approved and available services appear on public pages." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          <FilterPills
            value={filter}
            onChange={setFilter}
            options={[
              { value: "pending", label: "Pending", count: count("pending") },
              { value: "approved", label: "Approved", count: count("approved") },
              { value: "rejected", label: "Rejected", count: count("rejected") },
              { value: "all", label: "All", count: services.length },
            ]}
          />
          {rows.length ? (
            <DataTable columns={columns} rows={rows} />
          ) : (
            <EmptyState icon={ShieldCheck} title={filter === "pending" ? "All caught up!" : "Nothing here"} message={filter === "pending" ? "No services are waiting for review." : "No services with this status."} />
          )}
        </>
      )}

      <ConfirmModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={async () => (await decide(rejecting, "rejected")) && setRejecting(null)}
        loading={busy === rejecting?._id}
        title="Reject this service?"
        message={`"${rejecting?.title}" will be hidden from customers. The technician can edit it and resubmit.`}
        confirmLabel="Reject service"
      />
    </>
  );
}
