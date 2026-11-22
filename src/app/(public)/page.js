import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
import TechnicianCta from "@/components/home/TechnicianCta";
import SectionHeading from "@/components/home/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/ui/Feedback";
import { publicFetch } from "@/lib/public-api";

async function getFeatured() {
  try {
    const data = await publicFetch("/api/services?sort=newest&limit=6");
    return data?.items || [];
  } catch {
    return []; // keep the landing page up even if the API is briefly unreachable
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />

      <section className="py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured services"
            title="Freshly approved repair services"
            lead="The latest services listed by verified technicians and approved by our team."
            action={
              <Link href="/services" className="btn btn-outline">
                Browse all <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-10">
            {featured.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((s) => (
                  <ServiceCard key={s._id} service={s} showArea={false} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Wrench} title="No services yet" message="Approved services will appear here soon." actionLabel="Become a technician" actionHref="/sign-up" />
            )}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Categories />
      <TechnicianCta />
    </>
  );
}
