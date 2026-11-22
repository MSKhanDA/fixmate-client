"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-red-50 text-red-600">
        <AlertTriangle className="size-10" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        We hit an unexpected problem while loading this page. Please try again — if it keeps happening, our team has
        been notified.
      </p>
      {error?.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => reset()} className="btn btn-primary btn-lg">
          <RotateCcw className="size-4" /> Try again
        </button>
        <Link href="/" className="btn btn-outline btn-lg">
          <Home className="size-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
