import { requireRole } from "@/lib/session";

/** Only admins may open these routes; anyone else is sent to their own dashboard. */
export default async function AdminLayout({ children }) {
  await requireRole("admin");
  return children;
}
