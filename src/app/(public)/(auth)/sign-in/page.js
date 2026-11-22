import SignInForm from "@/components/auth/SignInForm";

export const metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }) {
  const { redirect } = await searchParams;
  return <SignInForm redirectTo={Array.isArray(redirect) ? redirect[0] : redirect} />;
}
