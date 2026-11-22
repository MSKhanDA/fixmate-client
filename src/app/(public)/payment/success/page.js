import { Suspense } from "react";
import PaymentVerifier from "@/components/services/PaymentVerifier";
import { Spinner } from "@/components/ui/Feedback";

export const metadata = { title: "Payment Successful" };

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;
  return (
    <Suspense fallback={<Spinner label="Confirming your payment…" />}>
      <PaymentVerifier sessionId={Array.isArray(sessionId) ? sessionId[0] : sessionId} />
    </Suspense>
  );
}
