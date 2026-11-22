"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, UserRound, Wrench, X } from "lucide-react";
import Field from "@/components/ui/Field";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import { signUp } from "@/lib/auth-client";
import { clearApiToken } from "@/lib/api";
import { dashboardPath, safeRedirect } from "@/lib/constants";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { test: (p) => p.length >= 6, label: "At least 6 characters" },
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[a-z]/.test(p), label: "One lowercase letter" },
];

const ROLES = [
  { value: "customer", title: "Customer", text: "I need something repaired", icon: UserRound },
  { value: "technician", title: "Technician", text: "I offer repair services", icon: Wrench },
];

export default function SignUpForm({ redirectTo }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const target = safeRedirect(redirectTo);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = "Enter your full name";
    if (!EMAIL_RX.test(form.email.trim())) found.email = "Enter a valid email address";
    const failed = PASSWORD_RULES.filter((r) => !r.test(form.password));
    if (failed.length) found.password = `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}`;
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    const { data, error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    if (error) {
      setLoading(false);
      const exists = error.code === "USER_ALREADY_EXISTS" || error.code?.includes("EXIST") || error.status === 422;
      return toast.error(exists ? "An account with this email already exists" : error.message || "Could not create account");
    }
    clearApiToken();
    toast.success("Account created! Welcome to FixMate.");
    const role = data.user.role;
    router.replace(role === "customer" && target ? target : dashboardPath(role));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold">Create your account</h1>
      <p className="mt-2 text-muted">Join as a customer to book repairs, or as a technician to offer them.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <fieldset>
          <legend className="label">I am joining as</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const active = form.role === r.value;
              return (
                <label
                  key={r.value}
                  className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition ${
                    active ? "border-pine-600 bg-pine-50" : "border-line bg-white hover:border-pine-200"
                  }`}
                >
                  <input type="radio" name="role" value={r.value} checked={active} onChange={set("role")} className="sr-only" />
                  <r.icon className={`size-6 ${active ? "text-pine-700" : "text-muted"}`} />
                  <span className="mt-2 font-bold">{r.title}</span>
                  <span className="text-xs text-muted">{r.text}</span>
                  {active && (
                    <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-pine-600 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input id="name" autoComplete="name" className={`input ${errors.name ? "input-error" : ""}`} value={form.name} onChange={set("name")} placeholder="e.g. Ayesha Rahman" />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className={`input ${errors.email ? "input-error" : ""}`} value={form.email} onChange={set("email")} placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={set("password")} invalid={!!errors.password} placeholder="Create a password" />
          <ul className="mt-2 grid gap-1 sm:grid-cols-3">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.label} className={`flex items-center gap-1 text-xs ${ok ? "text-pine-600" : "text-muted"}`}>
                  {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />} {r.label}
                </li>
              );
            })}
          </ul>
        </Field>

        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />} Create Account
        </button>
      </form>

      <GoogleButton callbackURL={target || "/dashboard"} />

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={target ? `/sign-in?redirect=${encodeURIComponent(target)}` : "/sign-in"} className="font-bold text-pine-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
