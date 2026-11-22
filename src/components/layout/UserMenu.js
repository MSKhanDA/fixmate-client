"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, LayoutDashboard, LogOut, UserRoundPen } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/Badges";
import { signOut } from "@/lib/auth-client";
import { clearApiToken } from "@/lib/api";
import { dashboardPath } from "@/lib/constants";

/** Avatar button with a dropdown: name, role badge, dashboard, profile, sign out. */
export default function UserMenu({ user, showName = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) return toast.error(error.message || "Could not sign out");
    clearApiToken();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition hover:bg-sand"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={user.image} name={user.name} size="sm" />
        {showName && (
          <span className="hidden text-left sm:block">
            <span className="block max-w-36 truncate text-sm font-bold leading-tight">{user.name}</span>
            <span className="block text-xs capitalize text-muted">{user.role}</span>
          </span>
        )}
        <ChevronDown className={`size-4 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-3 border-b border-line bg-cream/60 p-4">
            <Avatar src={user.image} name={user.name} size="md" />
            <div className="min-w-0">
              <p className="truncate font-bold">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
              <div className="mt-1.5">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
          <div className="p-2" onClick={() => setOpen(false)}>
            <Link href={dashboardPath(user.role)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-pine-50" role="menuitem">
              <LayoutDashboard className="size-4 text-pine-600" /> Dashboard
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-pine-50" role="menuitem">
              <UserRoundPen className="size-4 text-pine-600" /> Update Profile
            </Link>
            <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50" role="menuitem">
              <LogOut className="size-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
