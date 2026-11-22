"use client";

import { useCallback, useEffect, useState } from "react";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

let cachedToken = null;
let tokenExpiresAt = 0;
let pendingToken = null;

/** Gets a short-lived API JWT for the current BetterAuth session (cached in memory). */
async function getToken(force = false) {
  if (!force && cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  pendingToken ??= fetch("/api/token", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new ApiError(401, "Please sign in again");
      const { token, expiresIn } = await res.json();
      cachedToken = token;
      tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;
      return token;
    })
    .finally(() => {
      pendingToken = null;
    });
  return pendingToken;
}

export function clearApiToken() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, body, retried = false) {
  const token = await getToken(retried);
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  // A token minted before a role change or that just expired: refresh it once.
  if (res.status === 401 && !retried) return request(method, path, body, true);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message || "Something went wrong");
  return data;
}

/** Authenticated calls to the Express API. */
export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body ?? {}),
  patch: (path, body) => request("PATCH", path, body ?? {}),
  delete: (path) => request("DELETE", path),
};

/** Loads `path` from the API; returns data, loading, error, a setter and reload(). */
export function useApi(path) {
  const [version, setVersion] = useState(0);
  // `for` records which request the stored result belongs to; anything else means "still loading".
  const [state, setState] = useState({ for: null, data: null, error: null });
  const requestKey = `${path}#${version}`;

  useEffect(() => {
    let cancelled = false;
    api.get(path).then(
      (data) => !cancelled && setState({ for: requestKey, data, error: null }),
      (error) => !cancelled && setState({ for: requestKey, data: null, error }),
    );
    return () => {
      cancelled = true;
    };
  }, [path, requestKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback((updater) => {
    setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater }));
  }, []);

  const loading = state.for !== requestKey;
  return { data: loading ? null : state.data, error: loading ? null : state.error, loading, reload, setData };
}

/** Uploads an image file through our /api/upload route (ImgBB key stays on the server). */
export async function uploadImage(file) {
  if (!file) throw new ApiError(400, "Choose an image");
  if (!file.type.startsWith("image/")) throw new ApiError(400, "Only image files are allowed");
  if (file.size > 5 * 1024 * 1024) throw new ApiError(400, "Image must be under 5 MB");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message || "Image upload failed");
  return data.url;
}
