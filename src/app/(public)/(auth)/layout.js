/* eslint-disable @next/next/no-img-element */
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { dashboardPath } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

const POINTS = ["Admin-verified technicians", "Live job status from request to completion", "Pay securely only after the fix"];

/** Sign in / sign up shell. Logged-in users go straight to their dashboard. */
export default async function AuthLayout({ children }) {
  const session = await getSession();
  if (session) redirect(dashboardPath(session.user.role));

  return (
    <div className="container-x py-10 lg:py-16">
      <div className="card grid overflow-hidden lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-pine-800 p-10 text-white lg:flex lg:flex-col lg:justify-end">
          <img src={IMAGES.heroSide} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900 via-pine-900/70 to-pine-900/20" />
          <div className="relative">
            <h2 className="text-3xl leading-tight font-bold">Repairs without the guesswork.</h2>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-white/85">
                  <CheckCircle2 className="size-5 shrink-0 text-lime-400" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">{children}</div>
      </div>
    </div>
  );
}
