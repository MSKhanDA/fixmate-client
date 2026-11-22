"use client";

import { useSession } from "@/lib/auth-client";

/**
 * Live session user, falling back to the user the server rendered with until the
 * client session loads. Profile edits call `refetch()` so the navbar updates instantly.
 */
export function useCurrentUser(initialUser) {
  const { data, isPending, refetch } = useSession();
  const user = isPending ? initialUser : data?.user ?? null;
  return { user, refetch };
}
