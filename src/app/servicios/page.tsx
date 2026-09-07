import type { Metadata } from "next";

import { PublicShell } from "@/components/public/public-shell";
import { ServiceDetails } from "@/components/public/service-details";
import {
  getBrandImages,
  getNavigationSettings,
  getServiceCategories,
  getServices,
  getSiteSettings,
} from "@/lib/repository";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Conoce los servicios odontológicos disponibles y agenda una valoración clínica.",
};

export const dynamic = "force-dynamic";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const [query, services, categories, settings, brandImages, navigation] = await Promise.all([
    searchParams, getServices(), getServiceCategories(), getSiteSettings(),
    getBrandImages(), getNavigationSettings(),
  ]);
  const selectedServiceSlug = Array.isArray(query.servicio) ? query.servicio[0] : query.servicio;

  return (
    <PublicShell active="servicios" settings={settings}>
      <section className="min-w-0 px-[var(--space-page-x)] py-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 md:mb-12">
            <p className="tuodonto-eyebrow">Nuestros servicios</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--tuodonto-brown)] md:text-5xl">
              Vamos más allá por tu sonrisa.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--tuodonto-taupe)] md:text-base">
              Conoce nuestros servicios. En tu cita te orientamos sobre el cuidado que necesitas.
            </p>
          </header>
          <ServiceDetails
            services={services}
            categories={categories}
            fallbackImage={brandImages.servicesDetail}
            selectedServiceSlug={selectedServiceSlug}
            appointmentsEnabled={navigation.public.citas}
            contactEnabled={navigation.public.contacto}
          />
        </div>
      </section>
    </PublicShell>
  );
}
