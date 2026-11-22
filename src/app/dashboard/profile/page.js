"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2, Lock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/Widgets";
import Field from "@/components/ui/Field";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/Badges";
import { Spinner, ErrorState } from "@/components/ui/Feedback";
import { useCurrentUser } from "@/components/layout/useCurrentUser";
import { api, uploadImage, useApi } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { refetch } = useCurrentUser(null);
  const { data: profile, loading, error, reload, setData } = useApi("/api/users/me");
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialise the form once the profile loads (render-time state sync).
  if (profile && !form) {
    setForm({ name: profile.name || "", phone: profile.phone || "", area: profile.area || "", bio: profile.bio || "" });
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function chooseFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Only image files are allowed");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setFile(f);
    setPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = "Name must be at least 2 characters";
    if (form.phone.trim() && !/^\+?[\d\s-]{7,20}$/.test(form.phone.trim())) found.phone = "Enter a valid phone number";
    if (form.bio.length > 500) found.bio = "Keep the bio under 500 characters";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const image = file ? await uploadImage(file) : profile.image || "";
      const updated = await api.patch("/api/users/profile", { ...form, image });
      setData(updated);
      setFile(null);
      await refetch(); // navbar + dashboard top bar pick up the new name/photo immediately
      router.refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading && !form) return <Spinner label="Loading your profile…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!form || !profile) return null;

  const photo = preview || profile.image;

  return (
    <>
      <PageHeader title="Update profile" description="Your name and photo appear across FixMate. Email and role can't be changed here." />
      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card flex flex-col items-center p-6 text-center lg:self-start">
          <label className="group relative cursor-pointer">
            {photo ? (
              <img src={photo} alt="Profile" className="size-32 rounded-full object-cover ring-4 ring-pine-100" />
            ) : (
              <Avatar name={form.name} size="xl" className="!size-32 ring-4 ring-pine-100" />
            )}
            <span className="absolute right-1 bottom-1 grid size-10 place-items-center rounded-full bg-pine-700 text-white shadow-lg ring-4 ring-white transition group-hover:bg-pine-800">
              <Camera className="size-4" />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={chooseFile} />
          </label>
          <p className="mt-4 text-lg font-bold">{form.name || profile.name}</p>
          <p className="text-sm text-muted">{profile.email}</p>
          <div className="mt-2">
            <RoleBadge role={profile.role} />
          </div>
          <p className="mt-4 text-xs text-muted">Click the photo to upload a new one (hosted on ImgBB).</p>
        </div>

        <div className="card space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="p-name" error={errors.name}>
              <input id="p-name" className={`input ${errors.name ? "input-error" : ""}`} value={form.name} onChange={set("name")} />
            </Field>
            <Field label="Phone" htmlFor="p-phone" error={errors.phone}>
              <input id="p-phone" className={`input ${errors.phone ? "input-error" : ""}`} value={form.phone} onChange={set("phone")} placeholder="+880 17xx-xxxxxx" />
            </Field>
            <Field label={<span className="flex items-center gap-1.5">Email <Lock className="size-3 text-muted" /></span>} htmlFor="p-email">
              <input id="p-email" className="input" value={profile.email} readOnly disabled />
            </Field>
            <Field label={<span className="flex items-center gap-1.5">Role <Lock className="size-3 text-muted" /></span>} htmlFor="p-role">
              <input id="p-role" className="input capitalize" value={profile.role} readOnly disabled />
            </Field>
          </div>
          <Field label="Area" htmlFor="p-area" hint="City or area, e.g. Mirpur, Dhaka">
            <input id="p-area" className="input" value={form.area} onChange={set("area")} placeholder="Mirpur, Dhaka" />
          </Field>
          <Field label="Bio" htmlFor="p-bio" error={errors.bio} hint={profile.role === "technician" ? "Your skills and experience — shown on your service pages." : "A short line about yourself."}>
            <textarea id="p-bio" rows={4} className={`input resize-y ${errors.bio ? "input-error" : ""}`} value={form.bio} onChange={set("bio")} />
          </Field>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />} Save changes
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
