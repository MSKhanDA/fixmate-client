import { requireRole } from "@/lib/session";

/** Payment result pages are for customers only. */
export default async function PaymentLayout({ children }) {
  await requireRole("customer");
  return <div className="container-x flex min-h-[60vh] items-center justify-center py-16">{children}</div>;
}
