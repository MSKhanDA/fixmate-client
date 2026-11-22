import { ROLE_LABELS } from "@/lib/constants";

const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset";
const dot = "size-1.5 rounded-full bg-current";

// Same colours on every dashboard.
const STATUS = {
  requested: { label: "Requested", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  accepted: { label: "Accepted", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  "in-progress": { label: "In Progress", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" },
  cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-600 ring-slate-200" },
};

const APPROVAL = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" },
};

const ROLE = {
  customer: "bg-sky-50 text-sky-700 ring-sky-200",
  technician: "bg-pine-50 text-pine-700 ring-pine-200",
  admin: "bg-violet-50 text-violet-700 ring-violet-200",
};

export const STATUS_COLORS = {
  requested: "#2563eb",
  accepted: "#4f46e5",
  "in-progress": "#d97706",
  completed: "#059669",
  rejected: "#dc2626",
  cancelled: "#94a3b8",
};

export const statusLabel = (s) => STATUS[s]?.label || s;

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.requested;
  return (
    <span className={`${base} ${s.cls}`}>
      <span className={dot} />
      {s.label}
    </span>
  );
}

export function PaymentBadge({ status }) {
  return status === "paid" ? (
    <span className={`${base} bg-emerald-600 text-white ring-emerald-600`}>Paid</span>
  ) : (
    <span className={`${base} bg-white text-slate-600 ring-slate-300`}>Unpaid</span>
  );
}

export function ApprovalBadge({ status }) {
  const s = APPROVAL[status] || APPROVAL.pending;
  return (
    <span className={`${base} ${s.cls}`}>
      <span className={dot} />
      {s.label}
    </span>
  );
}

export function RoleBadge({ role }) {
  return <span className={`${base} ${ROLE[role] || ROLE.customer}`}>{ROLE_LABELS[role] || "Customer"}</span>;
}
