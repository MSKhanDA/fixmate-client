"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { FilterPills, PageHeader } from "@/components/dashboard/Widgets";
import DataTable from "@/components/dashboard/DataTable";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/Badges";
import { ConfirmModal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/Feedback";
import { useCurrentUser } from "@/components/layout/useCurrentUser";
import { api, useApi } from "@/lib/api";
import { formatDate, ROLE_LABELS } from "@/lib/constants";

export default function ManageUsersPage() {
  const { data, loading, error, reload, setData } = useApi("/api/admin/users");
  const { user: me } = useCurrentUser(null);
  const [filter, setFilter] = useState("all");
  const [pending, setPending] = useState(null); // { user, role }
  const [saving, setSaving] = useState(false);

  const users = data || [];
  const rows = filter === "all" ? users : users.filter((u) => (u.role || "customer") === filter);

  async function confirmRole() {
    setSaving(true);
    try {
      const updated = await api.patch(`/api/admin/users/${pending.user._id}/role`, { role: pending.role });
      setData((list) => list.map((u) => (u._id === updated._id ? { ...u, role: updated.role } : u)));
      toast.success(`${updated.name} is now ${ROLE_LABELS[updated.role]}`);
      setPending(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      key: "user",
      header: "",
      render: (u) => (
        <div className="flex items-center gap-3 text-left">
          <Avatar src={u.image} name={u.name} size="md" />
          <div className="min-w-0">
            <p className="truncate font-bold">
              {u.name} {u._id === me?.id && <span className="text-xs font-semibold text-pine-600">(you)</span>}
            </p>
            <p className="truncate text-xs text-muted">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u) => <RoleBadge role={u.role || "customer"} /> },
    { key: "joined", header: "Joined", render: (u) => formatDate(u.createdAt), className: "whitespace-nowrap" },
    {
      key: "change",
      header: "Change role",
      className: "text-right",
      render: (u) =>
        u._id === me?.id ? (
          <span className="text-xs text-muted">You can&apos;t change your own role</span>
        ) : (
          <select
            className="input w-40 py-1.5"
            value={u.role || "customer"}
            onChange={(e) => setPending({ user: u, role: e.target.value })}
            aria-label={`Role for ${u.name}`}
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ),
    },
  ];

  const count = (r) => users.filter((u) => (u.role || "customer") === r).length;

  return (
    <>
      <PageHeader title="Manage users" description="Everyone on FixMate. Change a role and it applies on the user's next request." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users" />
      ) : (
        <>
          <FilterPills
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: users.length },
              { value: "customer", label: "Customers", count: count("customer") },
              { value: "technician", label: "Technicians", count: count("technician") },
              { value: "admin", label: "Admins", count: count("admin") },
            ]}
          />
          <DataTable columns={columns} rows={rows} />
        </>
      )}

      <ConfirmModal
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={confirmRole}
        loading={saving}
        tone={pending?.role === "admin" ? "danger" : "pine"}
        title="Change role?"
        message={`${pending?.user.name} will become a ${ROLE_LABELS[pending?.role] || ""}. ${pending?.role === "admin" ? "Admins have full control of the platform." : ""}`}
        confirmLabel="Change role"
      />
    </>
  );
}
