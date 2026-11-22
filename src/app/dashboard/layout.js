import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSession, toClientUser } from "@/lib/session";

export const metadata = { title: "Dashboard" };

/** Every /dashboard route needs a session (checked on the server, so a reload never bounces to sign in). */
export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return <DashboardShell initialUser={toClientUser(session.user)}>{children}</DashboardShell>;
}
