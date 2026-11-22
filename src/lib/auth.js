import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "./db";

const SELF_SIGNUP_ROLES = ["customer", "technician"];

const trustedOrigins = [process.env.BETTER_AUTH_URL, ...(process.env.TRUSTED_ORIGINS || "").split(",")]
  .map((o) => o?.trim())
  .filter(Boolean);

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  // No client passed: transactions stay off so a standalone local MongoDB works too.
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: googleEnabled
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {},
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: false },
      area: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Only customer or technician can be chosen at sign up; anything else (e.g. "admin") becomes customer.
        // Google sign-ups send no role and land here as customers too.
        before: async (user) => ({
          data: { ...user, role: SELF_SIGNUP_ROLES.includes(user.role) ? user.role : "customer" },
        }),
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", { message: "Password must contain an uppercase and a lowercase letter" });
        }
      }
      // role is input-enabled only so sign up can pick customer/technician. It can never be changed
      // through BetterAuth afterwards; only an admin can, via the Express API.
      if (ctx.path === "/update-user" && ctx.body && "role" in ctx.body) {
        throw new APIError("FORBIDDEN", { message: "Role cannot be changed here" });
      }
    }),
  },
  plugins: [nextCookies()],
});
