# FixMate — Client

**Smart Device & Home Appliance Repair Service Platform**

FixMate connects customers with verified repair technicians for smartphones, laptops, ACs, refrigerators, TVs, washing machines and electrical work. Every job has a clear, trackable status (Requested → Accepted → In Progress → Completed), and customers pay online **only after the work is done**.

- **Live site:** https://fixmate-client-rho-coral.vercel.app
- **API repository:** https://github.com/MSKhanDA/fixmate-server

## Test accounts

| Role       | Email                     | Password       |
| ---------- | ------------------------- | -------------- |
| Admin      | `admin@fixmate.com`       | `Admin@123`    |
| Technician | `rafiq.tech@fixmate.com`  | `Tech@1234`    |
| Technician | `nusrat.tech@fixmate.com` | `Tech@1234`    |
| Customer   | `customer@fixmate.com`    | `Customer@123` |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- **Three roles, three dashboards** — Customer, Technician and Admin, each with its own sidebar menu, stats cards and charts (Recharts).
- **BetterAuth + MongoDB** — email/password sign up with role selection (customer/technician only; anything else is saved as customer on the server), password rules (6+ chars, upper & lower case) enforced on both client and server, optional Google login.
- **Role-protected routes** — `/dashboard/*` is checked on the server on every load, so reloading a private page never bounces a signed-in user to Sign In; a user opening another role's dashboard is sent to their own.
- **JWT bridge to the API** — `/api/token` exchanges the BetterAuth session for a short-lived JWT that the Express server verifies (`verifyToken`, `verifyCustomer`, `verifyTechnician`, `verifyAdmin`).
- **Server-side search, filter, sort and pagination** on Browse Services; all state lives in the URL, so filters survive reloads and Home category cards open `/services?category=AC` pre-filtered.
- **Repair request flow** — logged-out users are sent to Sign In and back; technicians/admins see a disabled button; customers get a validated modal (future date, 20+ character problem description). Duplicate active requests are refused by the server.
- **Job pipeline** — technicians accept/reject, start work and complete jobs with a final amount; customers can cancel only while a job is requested. A visual **job timeline tracker** shows each step with timestamps.
- **Pay after service with Stripe Checkout** — the amount always comes from the database; the payment is saved exactly once whether it arrives through the success page, the webhook, or Stripe's retries.
- **Service moderation** — new or edited services wait for admin approval; technicians can toggle availability; admins approve/reject, change user roles, monitor all bookings and see revenue.
- **ImgBB uploads** for service images and profile photos through a server route, so the API key never reaches the browser.
- **Profile updates** refresh the navbar and dashboard top bar immediately, without signing out.
- Custom loading skeletons, 404 page with a repair illustration, error boundary, toasts for every action, empty states and confirmation modals; fully responsive (tables turn into cards on mobile).

## Tech stack & npm packages

| Package                                     | Used for                                     |
| ------------------------------------------- | -------------------------------------------- |
| `next` 16 (App Router), `react` 19          | Framework                                    |
| `tailwindcss` 4                             | Styling (custom design tokens, no UI kit)    |
| `better-auth`                               | Authentication (MongoDB adapter)             |
| `mongodb`                                   | BetterAuth database connection               |
| `jsonwebtoken`                              | Signing API tokens for the Express server    |
| `sonner`                                    | Toast notifications                          |
| `lucide-react`                              | Icons                                        |
| `recharts`                                  | Dashboard charts                             |
| `server-only`                               | Keeps server modules out of client bundles   |

## Run locally

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000
```

Environment variables (`.env.local`):

| Variable                                      | Description                                                         |
| --------------------------------------------- | ------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`                          | Long random string                                                  |
| `BETTER_AUTH_URL`                             | This app's URL (`http://localhost:3000` or the production domain)   |
| `TRUSTED_ORIGINS`                             | Extra comma-separated origins BetterAuth should trust (optional)    |
| `MONGODB_URI`, `DB_NAME`                      | Same database as the server                                         |
| `JWT_SECRET`                                  | **Must equal** the server's `JWT_SECRET`                            |
| `IMGBB_API_KEY`                               | ImgBB key (server-side only)                                        |
| `NEXT_PUBLIC_API_URL`                         | Express API base URL                                                |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_ENABLED` | Optional Google login                    |

## Deploying (Vercel)

1. Import the repository in Vercel and add every variable above (with `BETTER_AUTH_URL` = your production URL).
2. After the first deploy, put the production URL in the server's `CLIENT_URL` so CORS and Stripe redirects allow it.
3. Seed the live database from the server repo: `SEED_AUTH_URL=https://fixmate-client-rho-coral.vercel.app npm run seed`.
