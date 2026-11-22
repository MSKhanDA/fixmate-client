import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = { title: "Create an Account" };

export default async function SignUpPage({ searchParams }) {
  const { redirect } = await searchParams;
  return <SignUpForm redirectTo={Array.isArray(redirect) ? redirect[0] : redirect} />;
}
