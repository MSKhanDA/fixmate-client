"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, PlusCircle, Trash2, Wrench } from "lucide-react";
import { FilterPills, PageHeader } from "@/components/dashboard/Widgets";
import DataTable, { ServiceCell } from "@/components/dashboard/DataTable";
import ServiceForm from "@/components/dashboard/ServiceForm";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import { ApprovalBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { api, useApi } from "@/lib/api";
import { formatPrice } from "@/lib/constants";

function AvailabilitySwitch({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 ${checked ? "bg-pine-600" : "bg-slate-300"}`}
      title={checked ? "Available — click to hide" : "Hidden — click to make available"}
    >
      <span className={`inline-block size-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function MyServicesPage() {
  const { data, loading, error, reload, setData } = useApi("/api/services/mine");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(null);

  const services = data || [];
  const rows = filter === "all" ? services : services.filter((s) => s.approvalStatus === filter);
  const replace = (updated) => setData((list) => list.map((s) => (s._id === updated._id ? updated : s)));

  async function toggle(service) {
    setBusy(service._id);
    try {
      const updated = await api.patch(`/api/services/${service._id}/availability`, { isAvailable: !service.isAvailable });
      replace(updated);
      toast.success(updated.isAvailable ? "Service is available again" : "Service hidden from public pages");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function saveEdit(payload) {
    try {
      const updated = await api.patch(`/api/services/${editing._id}`, payload);
      replace(updated);
      setEditing(null);
      toast.success("Service updated", { description: "It is back in the approval queue." });
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  async function confirmDelete() {
    setBusy(deleting._id);
    try {
      await api.delete(`/api/services/${deleting._id}`);
      setData((list) => list.filter((s) => s._id !== deleting._id));
      toast.success("Service deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  const columns = [
    { key: "service", header: "", render: (s) => <ServiceCell image={s.image} title={s.title} subtitle={`${s.serviceMode} · ${s.serviceArea}`} /> },
    { key: "category", header: "Category" },
    { key: "price", header: "Price", render: (s) => <span className="font-bold">{formatPrice(s.basePrice)}</span> },
    { key: "approval", header: "Approval", render: (s) => <ApprovalBadge status={s.approvalStatus} /> },
    {
      key: "available",
      header: "Available",
      render: (s) => (
        <div className="flex items-center justify-end gap-2 md:justify-start">
          <AvailabilitySwitch checked={s.isAvailable} onChange={() => toggle(s)} disabled={busy === s._id} />
          <span className="text-xs text-muted">{s.isAvailable ? "On" : "Off"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (s) => (
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setEditing(s)}>
            <Pencil className="size-3.5" /> Edit
          </button>
          <button className="btn btn-outline btn-sm text-red-600" onClick={() => setDeleting(s)}>
            <Trash2 className="size-3.5" /> Delete
          </button>
        </div>
      ),
    },
  ];

  const count = (st) => services.filter((s) => s.approvalStatus === st).length;

  return (
    <>
      <PageHeader
        title="My services"
        description="Edit, hide or remove your listings. Edited services are re-reviewed by an admin."
        action={
          <Link href="/dashboard/technician/add-service" className="btn btn-primary">
            <PlusCircle className="size-4" /> Add a service
          </Link>
        }
      />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" message="Add your first repair service so customers can find you." actionLabel="Add a service" actionHref="/dashboard/technician/add-service" />
      ) : (
        <>
          <FilterPills
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: services.length },
              { value: "approved", label: "Approved", count: count("approved") },
              { value: "pending", label: "Pending", count: count("pending") },
              { value: "rejected", label: "Rejected", count: count("rejected") },
            ]}
          />
          {rows.length ? <DataTable columns={columns} rows={rows} /> : <EmptyState title="Nothing here" message="No services match this filter." />}
        </>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" size="lg">
        {editing && <ServiceForm key={editing._id} initial={editing} submitLabel="Save changes" onSubmit={saveEdit} onCancel={() => setEditing(null)} />}
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={busy === deleting?._id}
        title="Delete this service?"
        message={`"${deleting?.title}" will be removed permanently. Existing bookings keep their details.`}
        confirmLabel="Delete service"
      />
    </>
  );
}
