import "server-only";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

/** Server-side fetch of public API data; returns null on 404. */
export async function publicFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed (${res.status}) for ${path}`);
  return res.json();
}
