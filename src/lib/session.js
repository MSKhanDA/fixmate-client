import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPath } from "./constants";

/** The current BetterAuth session (deduplicated per request), or null. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Plain, serialisable user object for Client Components. */
export function toClientUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || "",
    role: user.role || "customer",
    phone: user.phone || "",
    area: user.area || "",
    bio: user.bio || "",
  };
}

/** Requires a logged-in user with the given role; others are sent to their own dashboard. */
export async function requireRole(role) {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  if (role && session.user.role !== role) redirect(dashboardPath(session.user.role));
  return session.user;
}
