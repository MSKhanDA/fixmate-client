import Link from "next/link";
import { CircleX, RotateCcw } from "lucide-react";

export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="card w-full max-w-lg p-8 text-center sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-amber-600">
        <CircleX className="size-8" />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold">Payment cancelled</h1>
      <p className="mt-3 text-muted">No worries — nothing was charged and your booking is unchanged. You can pay whenever you are ready.</p>
      <Link href="/dashboard/customer/bookings" className="btn btn-primary btn-lg mt-8">
        <RotateCcw className="size-4" /> Try Again
      </Link>
    </div>
  );
}
