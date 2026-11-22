"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import Field from "@/components/ui/Field";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import { signIn } from "@/lib/auth-client";
import { clearApiToken } from "@/lib/api";
import { dashboardPath, safeRedirect } from "@/lib/constants";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ redirectTo }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!EMAIL_RX.test(form.email.trim())) found.email = "Enter a valid email address";
    if (!form.password) found.password = "Password is required";
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    const { data, error } = await signIn.email({ email: form.email.trim(), password: form.password });
    if (error) {
      setLoading(false);
      return toast.error(error.status === 401 ? "Wrong email or password" : error.message || "Could not sign in");
    }
    clearApiToken();
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
    router.replace(target || dashboardPath(data.user.role));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold">Sign in to FixMate</h1>
      <p className="mt-2 text-muted">Track your repairs, manage jobs and payments.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className={`input ${errors.email ? "input-error" : ""}`} value={form.email} onChange={set("email")} placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={set("password")} invalid={!!errors.password} placeholder="Your password" />
        </Field>
        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Sign In
        </button>
      </form>

      <GoogleButton callbackURL={target || "/dashboard"} />

      <p className="mt-8 text-center text-sm text-muted">
        New to FixMate?{" "}
        <Link href={target ? `/sign-up?redirect=${encodeURIComponent(target)}` : "/sign-up"} className="font-bold text-pine-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
