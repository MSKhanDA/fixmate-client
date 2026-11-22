import { requireRole } from "@/lib/session";

/** Only technicians may open these routes; anyone else is sent to their own dashboard. */
export default async function TechnicianLayout({ children }) {
  await requireRole("technician");
  return children;
}
