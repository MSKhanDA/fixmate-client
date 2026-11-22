"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" }[size];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative max-h-[92vh] w-full ${width} overflow-y-auto rounded-t-3xl bg-white p-6 shadow-[var(--shadow-lift)] sm:rounded-3xl`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost -mr-2 -mt-1 p-2" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Asks before a destructive action (delete, cancel, reject). */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", loading = false, tone = "danger" }) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose} title={title} size="sm">
      <div className="flex gap-4">
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tone === "danger" ? "bg-red-50 text-red-600" : "bg-pine-50 text-pine-700"}`}>
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-sm leading-relaxed text-muted">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn btn-outline" onClick={onClose} disabled={loading}>
          Keep it
        </button>
        <button className={`btn ${tone === "danger" ? "btn-danger" : "btn-primary"}`} onClick={onConfirm} disabled={loading}>
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
