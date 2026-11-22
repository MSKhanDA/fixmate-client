import Link from "next/link";
import { Inbox, Loader2 } from "lucide-react";

export function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-muted ${className}`} role="status">
      <Loader2 className="size-8 animate-spin text-pine-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, actionLabel, actionHref, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-pine-50 text-pine-700">
        <Icon className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary mt-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="font-semibold text-red-700">{error?.message || "Something went wrong"}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="card space-y-3 p-5">
      <div className="skeleton h-5 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full" />
      ))}
    </div>
  );
}
