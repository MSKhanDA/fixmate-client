import jwt from "jsonwebtoken";
import { getSession } from "@/lib/session";

const EXPIRES_IN = 60 * 60; // seconds

/** Exchanges the BetterAuth session cookie for a short-lived JWT the Express API verifies. */
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { id, email, role } = session.user;
  const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
  return Response.json({ token, expiresIn: EXPIRES_IN }, { headers: { "Cache-Control": "no-store" } });
}
