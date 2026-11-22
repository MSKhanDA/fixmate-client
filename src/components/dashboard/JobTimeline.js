import { Check, CircleSlash } from "lucide-react";
import { formatDateTime } from "@/lib/constants";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

/** Visual step tracker built from a booking's statusHistory. */
export default function JobTimeline({ booking }) {
  const history = booking.statusHistory || [{ status: "requested", changedAt: booking.createdAt }];
  const at = Object.fromEntries(history.map((h) => [h.status, h.changedAt]));
  const stopped = ["rejected", "cancelled"].includes(booking.status) ? booking.status : null;

  // Index of the furthest step reached.
  const reached = booking.paymentStatus === "paid" ? 4 : Math.max(0, STEPS.findIndex((s) => s.key === booking.status));

  const steps = stopped ? [STEPS[0], { key: stopped, label: stopped === "rejected" ? "Rejected by technician" : "Cancelled by you" }] : STEPS;

  return (
    <ol className="relative space-y-5">
      {steps.map((s, i) => {
        const done = stopped ? true : i <= reached;
        const isStop = s.key === stopped;
        return (
          <li key={s.key} className="relative flex gap-4">
            {i < steps.length - 1 && (
              <span className={`absolute top-8 left-[15px] h-[calc(100%-12px)] w-0.5 ${done && (stopped || i < reached) ? "bg-pine-500" : "bg-line"}`} />
            )}
            <span
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white ${
                isStop ? "bg-red-500 text-white" : done ? "bg-pine-600 text-white" : "border-2 border-line bg-white text-muted"
              }`}
            >
              {isStop ? <CircleSlash className="size-4" /> : done ? <Check className="size-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
            </span>
            <div className="pt-1">
              <p className={`font-bold ${done ? "" : "text-muted"}`}>{s.label}</p>
              <p className="text-xs text-muted">{at[s.key] ? formatDateTime(at[s.key]) : done ? "" : "Waiting"}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
