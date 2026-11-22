import { getSession } from "@/lib/session";

const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads an image to ImgBB for a logged-in user, keeping the API key on the server. */
export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!process.env.IMGBB_API_KEY) return Response.json({ message: "Image upload is not configured" }, { status: 500 });

  const form = await request.formData();
  const file = form.get("image");
  if (!file || typeof file === "string") return Response.json({ message: "Choose an image" }, { status: 400 });
  if (!file.type?.startsWith("image/")) return Response.json({ message: "Only image files are allowed" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ message: "Image must be under 5 MB" }, { status: 400 });

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, { method: "POST", body });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) return Response.json({ message: "Image upload failed, try another image" }, { status: 502 });
  return Response.json({ url: data.data.display_url || data.data.url });
}
