"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ClipboardList,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  UserRoundPen,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/Badges";
import UserMenu from "@/components/layout/UserMenu";
import { useCurrentUser } from "@/components/layout/useCurrentUser";

const NAV = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: ReceiptText },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add a Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: ClipboardList },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: ListChecks },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Wallet },
  ],
};

export default function DashboardShell({ initialUser, children }) {
  const pathname = usePathname();
  const { user: liveUser } = useCurrentUser(initialUser);
  const user = liveUser || initialUser;
  const [open, setOpen] = useState(false);

  const links = [...(NAV[user.role] || NAV.customer), { href: "/dashboard/profile", label: "Update Profile", icon: UserRoundPen }];
  const roleRoot = links[0].href;
  const isActive = (href) => (href === roleRoot ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button className="btn btn-ghost p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl bg-pine-800 p-3 text-white">
        <Avatar src={user.image} name={user.name} size="md" className="ring-pine-700" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{user.name}</p>
          <RoleBadge role={user.role} />
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3" onClick={(e) => e.target.closest("a") && setOpen(false)}>
        <p className="px-3 pb-2 text-[11px] font-bold tracking-widest text-muted uppercase">Menu</p>
        {links.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-lime-300 text-ink shadow-sm" : "text-ink/70 hover:bg-sand hover:text-ink"
              }`}
            >
              <l.icon className={`size-[18px] ${active ? "text-pine-800" : "text-muted"}`} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link href="/" className="btn btn-outline w-full">
          <Home className="size-4" /> Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-line bg-white lg:block">{sidebar}</aside>

      {/* Mobile / tablet drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-[var(--shadow-lift)]">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-cream/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <Link href="/" className="btn btn-ghost hidden sm:inline-flex">
              <Home className="size-4" /> Home
            </Link>
          </div>
          <UserMenu user={user} showName />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
