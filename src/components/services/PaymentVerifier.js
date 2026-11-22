"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, BadgeCheck, ReceiptText } from "lucide-react";
import { Spinner } from "@/components/ui/Feedback";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/constants";

/** Confirms the Stripe session with the API, which saves the payment exactly once. */
export default function PaymentVerifier({ sessionId }) {
  const [state, setState] = useState({ loading: Boolean(sessionId), payment: null, error: sessionId ? null : "Missing payment session." });
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;
    api
      .get(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((payment) => {
        setState({ loading: false, payment, error: null });
        toast.success("Payment successful — thank you!");
      })
      .catch((err) => {
        setState({ loading: false, payment: null, error: err.message });
        toast.error(err.message);
      });
  }, [sessionId]);

  if (state.loading) return <Spinner label="Confirming your payment with Stripe…" />;

  if (state.error) {
    return (
      <div className="card w-full max-w-lg p-8 text-center sm:p-10">
        <AlertCircle className="mx-auto size-14 text-red-500" />
        <h1 className="mt-4 text-2xl font-extrabold">We couldn&apos;t confirm this payment</h1>
        <p className="mt-2 text-muted">{state.error}</p>
        <Link href="/dashboard/customer/bookings" className="btn btn-primary mt-8">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const p = state.payment;
  return (
    <div className="card w-full max-w-lg overflow-hidden">
      <div className="bg-pine-800 px-8 py-10 text-center text-white">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-lime-400 text-ink">
          <BadgeCheck className="size-8" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Payment successful</h1>
        <p className="mt-2 text-white/75">Your repair job is now marked as paid.</p>
      </div>
      <dl className="divide-y divide-line px-8 py-4 text-sm">
        {[
          ["Service", p.serviceTitle],
          ["Technician", p.technicianName],
          ["Amount paid", <span key="a" className="font-display text-lg font-extrabold text-pine-700">{formatPrice(p.amount)}</span>],
          ["Transaction ID", <code key="t" className="rounded bg-sand px-1.5 py-0.5 text-xs break-all">{p.transactionId}</code>],
          ["Paid at", formatDateTime(p.paidAt)],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2 px-8 pb-8 sm:flex-row">
        <Link href="/dashboard/customer/bookings" className="btn btn-primary flex-1">
          Back to My Bookings
        </Link>
        <Link href="/dashboard/customer/payments" className="btn btn-outline flex-1">
          <ReceiptText className="size-4" /> Payment History
        </Link>
      </div>
    </div>
  );
}
