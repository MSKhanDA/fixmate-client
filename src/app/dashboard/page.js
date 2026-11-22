import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { dashboardPath } from "@/lib/constants";

/** /dashboard → the dashboard of the current user's role. */
export default async function DashboardIndex() {
  const session = await getSession();
  redirect(session ? dashboardPath(session.user.role) : "/sign-in");
}
