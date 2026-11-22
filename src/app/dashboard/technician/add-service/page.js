"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/Widgets";
import ServiceForm from "@/components/dashboard/ServiceForm";
import { useCurrentUser } from "@/components/layout/useCurrentUser";
import { api } from "@/lib/api";

export default function AddServicePage() {
  const router = useRouter();
  const { user } = useCurrentUser(null);

  async function handleSubmit(payload) {
    try {
      await api.post("/api/services", payload);
      toast.success("Service submitted!", { description: "It is waiting for admin approval before going live." });
      router.push("/dashboard/technician/my-services");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  return (
    <>
      <PageHeader title="Add a service" description="New services go live after an admin approves them." />
      <div className="card p-5 sm:p-8">
        <ServiceForm technician={user} submitLabel="Submit for approval" onSubmit={handleSubmit} />
      </div>
    </>
  );
}
