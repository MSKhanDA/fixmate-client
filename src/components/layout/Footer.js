import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcons";
import { CATEGORIES } from "@/lib/constants";

const SOCIALS = [
  { name: "x", label: "FixMate on X", href: "https://x.com" },
  { name: "facebook", label: "FixMate on Facebook", href: "https://facebook.com" },
  { name: "instagram", label: "FixMate on Instagram", href: "https://instagram.com" },
  { name: "linkedin", label: "FixMate on LinkedIn", href: "https://linkedin.com" },
  { name: "youtube", label: "FixMate on YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-pine-900 text-white/80">
      <div className="bg-grid-light absolute inset-0" aria-hidden="true" />
      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Verified technicians for every device at home. Track each step of the job, and pay only after it is fixed.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-lime-400 hover:text-ink"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold tracking-wider text-white uppercase">Quick links</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-lime-400">Home</Link></li>
            <li><Link href="/services" className="hover:text-lime-400">Services</Link></li>
            <li><Link href="/about" className="hover:text-lime-400">How It Works</Link></li>
            <li><Link href="/sign-up" className="hover:text-lime-400">Become a Technician</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-sm font-bold tracking-wider text-white uppercase">Popular categories</h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="hover:text-lime-400">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-sm font-bold tracking-wider text-white uppercase">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><Mail className="size-4 shrink-0 text-lime-400" /> support@fixmate.com</li>
            <li className="flex gap-3"><Phone className="size-4 shrink-0 text-lime-400" /> +880 1700-000000</li>
            <li className="flex gap-3"><MapPin className="size-4 shrink-0 text-lime-400" /> House 12, Road 7, Dhanmondi, Dhaka 1205</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Fixed right. Paid after.</p>
        </div>
      </div>
    </footer>
  );
}
