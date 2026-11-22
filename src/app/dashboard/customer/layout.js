import { requireRole } from "@/lib/session";

/** Only customers may open these routes; anyone else is sent to their own dashboard. */
export default async function CustomerLayout({ children }) {
  await requireRole("customer");
  return children;
}
