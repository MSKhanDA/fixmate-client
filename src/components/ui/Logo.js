import Link from "next/link";
import { Wrench } from "lucide-react";

/** FixMate brand mark — same size and style on every page. */
export default function Logo({ light = false, href = "/" }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="FixMate home">
      <span className="grid size-9 place-items-center rounded-xl bg-pine-700 text-lime-400 shadow-sm transition group-hover:rotate-[-8deg]">
        <Wrench className="size-5" strokeWidth={2.4} />
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Fix<span className={light ? "text-lime-400" : "text-pine-600"}>Mate</span>
      </span>
    </Link>
  );
}
