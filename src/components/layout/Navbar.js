"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import UserMenu from "./UserMenu";
import { useCurrentUser } from "./useCurrentUser";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar({ initialUser }) {
  const pathname = usePathname();
  const { user } = useCurrentUser(initialUser);
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive(l.href) ? "bg-pine-700 text-white" : "text-ink/75 hover:bg-sand hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in" className="btn btn-ghost">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
          <button className="btn btn-ghost p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-cream md:hidden">
          <ul className="container-x flex flex-col gap-1 py-3" onClick={(e) => e.target.closest("a") && setOpen(false)}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${isActive(l.href) ? "bg-pine-700 text-white" : "hover:bg-sand"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {!user && (
              <li className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/sign-in" className="btn btn-outline">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-primary">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
