import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Server-rendered pagination links that keep every other query param. */
export default function Pagination({ page, totalPages, searchParams }) {
  if (totalPages <= 1) return null;

  const href = (p) => {
    const q = new URLSearchParams(searchParams);
    if (p > 1) q.set("page", String(p));
    else q.delete("page");
    return `/services${q.size ? `?${q}` : ""}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const base = "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition";

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${base} border border-line bg-white hover:bg-pine-50`} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={`${base} border border-line bg-white opacity-40`}>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${p === page ? "bg-pine-700 text-white" : "border border-line bg-white hover:bg-pine-50"}`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${base} border border-line bg-white hover:bg-pine-50`} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={`${base} border border-line bg-white opacity-40`}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
