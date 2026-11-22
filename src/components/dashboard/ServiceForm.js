"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import Field from "@/components/ui/Field";
import { uploadImage } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";

const EMPTY = { title: "", category: "", description: "", basePrice: "", estimatedDuration: "", serviceMode: "Home Visit", serviceArea: "" };

function validate(form, hasImage) {
  const e = {};
  if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters";
  if (!CATEGORIES.includes(form.category)) e.category = "Choose a category";
  if (form.description.trim().length < 20) e.description = "Describe the service in at least 20 characters";
  if (!(Number(form.basePrice) > 0)) e.basePrice = "Enter a positive price";
  if (!form.estimatedDuration.trim()) e.estimatedDuration = "e.g. 2-3 hours";
  if (!SERVICE_MODES.includes(form.serviceMode)) e.serviceMode = "Choose a mode";
  if (form.serviceArea.trim().length < 2) e.serviceArea = "Where do you work?";
  if (!hasImage) e.image = "Upload a service image";
  return e;
}

/**
 * Add / edit a service. The image is uploaded to ImgBB (through /api/upload) on submit.
 * onSubmit receives the complete payload including the hosted image URL.
 */
export default function ServiceForm({ initial, technician, submitLabel = "Save service", onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...pick(initial) }));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function chooseFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErrors((er) => ({ ...er, image: "Only image files are allowed" }));
    if (f.size > 5 * 1024 * 1024) return setErrors((er) => ({ ...er, image: "Image must be under 5 MB" }));
    setFile(f);
    setPreview((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setErrors((er) => ({ ...er, image: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form, Boolean(file || initial?.image));
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    let image = initial?.image;
    if (file) {
      try {
        image = await uploadImage(file);
      } catch (err) {
        toast.error(err.message);
        return setSaving(false);
      }
    }
    try {
      await onSubmit({ ...form, basePrice: Number(form.basePrice), image });
    } catch {
      // the caller already showed the error toast; keep the form filled in
    } finally {
      setSaving(false);
    }
  }

  const err = (k) => (errors[k] ? "input-error" : "");

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <Field label="Service title" htmlFor="sf-title" error={errors.title}>
          <input id="sf-title" className={`input ${err("title")}`} value={form.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="sf-category" error={errors.category}>
            <select id="sf-category" className={`input ${err("category")}`} value={form.category} onChange={set("category")}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Base price (USD)" htmlFor="sf-price" error={errors.basePrice}>
            <input id="sf-price" type="number" min="1" step="0.01" className={`input ${err("basePrice")}`} value={form.basePrice} onChange={set("basePrice")} placeholder="45" />
          </Field>
          <Field label="Estimated duration" htmlFor="sf-duration" error={errors.estimatedDuration}>
            <input id="sf-duration" className={`input ${err("estimatedDuration")}`} value={form.estimatedDuration} onChange={set("estimatedDuration")} placeholder="2-3 hours" />
          </Field>
          <Field label="Service area" htmlFor="sf-area" error={errors.serviceArea}>
            <input id="sf-area" className={`input ${err("serviceArea")}`} value={form.serviceArea} onChange={set("serviceArea")} placeholder="Dhanmondi, Dhaka" />
          </Field>
        </div>
        <fieldset>
          <legend className="label">Service mode</legend>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_MODES.map((m) => (
              <label key={m} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${form.serviceMode === m ? "border-pine-600 bg-pine-50" : "border-line bg-white"}`}>
                <input type="radio" name="serviceMode" value={m} checked={form.serviceMode === m} onChange={set("serviceMode")} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Description" htmlFor="sf-desc" error={errors.description} hint="What is included, parts, warranty…">
          <textarea id="sf-desc" rows={5} className={`input resize-y ${err("description")}`} value={form.description} onChange={set("description")} />
        </Field>
        {technician && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Technician name">
              <input className="input" value={technician.name} readOnly disabled />
            </Field>
            <Field label="Technician email">
              <input className="input" value={technician.email} readOnly disabled />
            </Field>
          </div>
        )}
      </div>

      <div>
        <span className="label">Service image</span>
        <label
          className={`group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white text-center transition hover:border-pine-400 ${
            errors.image ? "border-red-400" : "border-line"
          }`}
        >
          {preview ? (
            <>
              <img src={preview} alt="Service preview" className="absolute inset-0 size-full object-cover" />
              <span className="relative rounded-full bg-ink/75 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">Change image</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-9 text-pine-500" />
              <span className="mt-2 text-sm font-semibold">Upload an image</span>
              <span className="text-xs text-muted">PNG or JPG, up to 5 MB</span>
            </>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={chooseFile} />
        </label>
        {errors.image && <p className="field-error">{errors.image}</p>}
        <p className="mt-2 text-xs text-muted">Hosted on ImgBB when you save.</p>

        <div className="mt-6 flex flex-col gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />} {saving ? "Saving…" : submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function pick(s) {
  if (!s) return {};
  const { title, category, description, basePrice, estimatedDuration, serviceMode, serviceArea } = s;
  return { title, category, description, basePrice: String(basePrice), estimatedDuration, serviceMode, serviceArea };
}
