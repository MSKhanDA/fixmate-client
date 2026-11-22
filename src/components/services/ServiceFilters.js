"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";

/**
 * Search, filter and sort controls. They only change the URL; the page re-renders on the
 * server and the API does the actual querying, so filters survive a reload.
 */
export default function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get("search") || "");

  function update(changes) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page"); // any new query starts from page 1
    startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  const category = params.get("category") || "";
  const mode = params.get("mode") || "";
  const sort = params.get("sort") || "newest";
  const hasFilters = params.get("search") || category || mode || (sort && sort !== "newest");

  return (
    <div className="card p-4 sm:p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ search: search.trim() });
        }}
        className="flex flex-col gap-3 lg:flex-row lg:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category…"
            className="input pl-11"
            aria-label="Search services"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
          <select value={category} onChange={(e) => update({ category: e.target.value })} className="input lg:w-44" aria-label="Category">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={mode} onChange={(e) => update({ mode: e.target.value })} className="input lg:w-40" aria-label="Service mode">
            <option value="">Any mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })} className="input col-span-2 sm:col-span-1 lg:w-48" aria-label="Sort">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <SlidersHorizontal className="size-4" />} Search
        </button>
      </form>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs">
          <span className="font-semibold text-muted">Active:</span>
          {params.get("search") && <Chip label={`“${params.get("search")}”`} onClear={() => (setSearch(""), update({ search: "" }))} />}
          {category && <Chip label={category} onClear={() => update({ category: "" })} />}
          {mode && <Chip label={mode} onClear={() => update({ mode: "" })} />}
          {sort !== "newest" && <Chip label={SORT_OPTIONS.find((o) => o.value === sort)?.label} onClear={() => update({ sort: "" })} />}
          <button
            onClick={() => {
              setSearch("");
              startTransition(() => router.push(pathname, { scroll: false }));
            }}
            className="ml-auto font-semibold text-pine-700 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-pine-50 py-1 pr-1 pl-3 font-semibold text-pine-800">
      {label}
      <button onClick={onClear} className="grid size-5 place-items-center rounded-full hover:bg-pine-100" aria-label={`Remove ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  );
}
