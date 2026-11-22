"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Info, Loader2, Wrench } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { api } from "@/lib/api";

const localToday = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function validate(form) {
  const errors = {};
  if (!/^\+?[\d\s-]{7,20}$/.test(form.customerPhone.trim())) errors.customerPhone = "Enter a valid phone number";
  if (form.address.trim().length < 5) errors.address = "Enter the full service / pickup address";
  if (!form.preferredDate) errors.preferredDate = "Choose a date";
  else if (form.preferredDate < localToday()) errors.preferredDate = "Pick today or a future date";
  if (form.problemDescription.trim().length < 20) errors.problemDescription = "Describe the problem in at least 20 characters";
  return errors;
}

/** Request Repair button + form; behaviour depends on who is looking. */
export default function RequestRepair({ service, user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ customerPhone: user?.phone || "", address: "", preferredDate: "", problemDescription: "" });

  if (user && user.role !== "customer") {
    return (
      <div>
        <button className="btn btn-primary btn-lg w-full" disabled>
          <Wrench className="size-4" /> Request Repair
        </button>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  function handleClick() {
    if (!user) return router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`);
    setDone(false);
    setOpen(true);
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await api.post("/api/bookings", { serviceId: service._id, ...form });
      toast.success("Repair request sent!", {
        description: "The technician will review it shortly.",
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setDone(true);
      setForm((f) => ({ ...f, address: "", preferredDate: "", problemDescription: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={handleClick} className="btn btn-primary btn-lg w-full">
        <Wrench className="size-4" /> Request Repair
      </button>
      {!user && <p className="mt-3 text-center text-xs text-muted">You&apos;ll be asked to sign in as a customer first.</p>}

      <Modal open={open} onClose={() => !submitting && setOpen(false)} title={done ? "Request sent" : "Request a repair"} size="lg">
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto size-14 text-pine-500" />
            <p className="mt-4 text-lg font-bold">Your request is on its way</p>
            <p className="mt-1 text-sm text-muted">
              Track its status — Requested, Accepted, In Progress, Completed — from your bookings.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button className="btn btn-outline" onClick={() => setOpen(false)}>
                Close
              </button>
              <Link href="/dashboard/customer/bookings" className="btn btn-primary">
                Go to My Bookings
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="rounded-2xl bg-cream px-4 py-3 text-sm">
              <span className="text-muted">Service:</span> <span className="font-bold">{service.title}</span>
              <span className="text-muted"> · by {service.technicianName}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="rq-name">
                <input id="rq-name" className="input" value={user?.name || ""} readOnly disabled />
              </Field>
              <Field label="Email" htmlFor="rq-email">
                <input id="rq-email" className="input" value={user?.email || ""} readOnly disabled />
              </Field>
              <Field label="Phone" htmlFor="rq-phone" error={errors.customerPhone}>
                <input id="rq-phone" className={`input ${errors.customerPhone ? "input-error" : ""}`} value={form.customerPhone} onChange={set("customerPhone")} placeholder="+880 17xx-xxxxxx" />
              </Field>
              <Field label="Preferred date" htmlFor="rq-date" error={errors.preferredDate}>
                <input id="rq-date" type="date" min={localToday()} className={`input ${errors.preferredDate ? "input-error" : ""}`} value={form.preferredDate} onChange={set("preferredDate")} />
              </Field>
            </div>
            <Field label={service.serviceMode === "Shop Drop-off" ? "Pickup / contact address" : "Service address"} htmlFor="rq-address" error={errors.address}>
              <input id="rq-address" className={`input ${errors.address ? "input-error" : ""}`} value={form.address} onChange={set("address")} placeholder="House, road, area, city" />
            </Field>
            <Field label="Problem description" htmlFor="rq-problem" error={errors.problemDescription} hint={`${form.problemDescription.trim().length}/20 characters minimum`}>
              <textarea
                id="rq-problem"
                rows={4}
                className={`input resize-none ${errors.problemDescription ? "input-error" : ""}`}
                value={form.problemDescription}
                onChange={set("problemDescription")}
                placeholder="What is wrong with the device? When did it start?"
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn btn-outline" onClick={() => setOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />} Send Request
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
