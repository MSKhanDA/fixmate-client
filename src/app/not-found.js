import Link from "next/link";
import { Home, Search } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const metadata = { title: "Page Not Found" };

/** Repair-themed 404: a disconnected plug and a wrench. */
function BrokenPlugIllustration() {
  return (
    <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-md" aria-hidden="true">
      <ellipse cx="180" cy="182" rx="150" ry="10" fill="#ede9de" />
      <path d="M20 120 C70 120 80 100 120 100" stroke="#124f40" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="116" y="82" width="46" height="36" rx="8" fill="#124f40" />
      <rect x="160" y="88" width="16" height="6" rx="2" fill="#5b6b66" />
      <rect x="160" y="106" width="16" height="6" rx="2" fill="#5b6b66" />
      <path d="M340 120 C290 120 280 100 248 100" stroke="#124f40" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="200" y="82" width="50" height="36" rx="8" fill="#17634f" />
      <rect x="206" y="90" width="6" height="6" rx="1" fill="#0b2e26" />
      <rect x="206" y="104" width="6" height="6" rx="1" fill="#0b2e26" />
      <g stroke="#c3ea5f" strokeWidth="5" strokeLinecap="round">
        <path d="M186 62 l4 -14" />
        <path d="M196 70 l12 -8" />
        <path d="M174 66 l-8 -10" />
      </g>
      <g transform="translate(250 30) rotate(35)">
        <path d="M30 4a14 14 0 0 0-17 17L-30 64a6 6 0 1 0 8 8l43-43a14 14 0 0 0 17-17l-8 8-7-2-2-7z" fill="#c3ea5f" stroke="#0f1f1c" strokeWidth="3" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-x flex h-16 items-center">
        <Logo />
      </header>
      <main className="container-x flex flex-1 flex-col items-center justify-center py-12 text-center">
        <BrokenPlugIllustration />
        <p className="mt-6 font-display text-7xl font-extrabold text-pine-700">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">This page got disconnected</h1>
        <p className="mt-3 max-w-md text-muted">
          We looked in every toolbox but couldn&apos;t find what you were after. The link may be broken, or the service
          is no longer available.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            <Home className="size-4" /> Back to Home
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            <Search className="size-4" /> Browse services
          </Link>
        </div>
      </main>
    </div>
  );
}
