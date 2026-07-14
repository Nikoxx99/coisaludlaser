import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, CircleCheck, Sparkles } from "lucide-react";

import { PublicLinkButton } from "@/components/public/link-button";
import { Reveal } from "@/components/public/motion";
import { PublicShell } from "@/components/public/public-shell";
import { ServiceDetails } from "@/components/public/service-details";
import {
  getBrandImages,
  getLandingCopy,
  getNavigationSettings,
  getServiceCategories,
  getServices,
  getSiteSettings,
} from "@/lib/repository";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Conoce los servicios odontológicos disponibles y agenda una valoración clínica.",
};

export const dynamic = "force-dynamic";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const [query, services, categories, settings, landing, brandImages, navigation] = await Promise.all([
    searchParams,
    getServices(),
    getServiceCategories(),
    getSiteSettings(),
    getLandingCopy(),
    getBrandImages(),
    getNavigationSettings(),
  ]);
  const selectedServiceSlug = Array.isArray(query.servicio)
    ? query.servicio[0]
    : query.servicio;

  return (
    <PublicShell active="servicios" settings={settings}>
      <section className="min-w-0 px-[var(--space-page-x)] py-6 md:py-8">
        <div className="mx-auto grid min-w-0 max-w-7xl gap-7">
          <Reveal>
            <div className="flex flex-col gap-4 border-b border-[var(--tuodonto-line)] pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="tuodonto-display text-4xl leading-none text-[var(--tuodonto-brown)] md:text-5xl">
                  Elige tu servicio.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tuodonto-taupe)]">
                  Revisa cada opción y agenda una valoración para definir el tratamiento indicado.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                {navigation.public.citas ? (
                  <PublicLinkButton href="/citas">Agendar valoración</PublicLinkButton>
                ) : null}
                {navigation.public.contacto ? (
                  <PublicLinkButton href="/contacto" variant="sky">
                    Hacer una pregunta
                  </PublicLinkButton>
                ) : null}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="min-w-0">
            <ServiceDetails
              services={services}
              categories={categories}
              fallbackImage={brandImages.servicesDetail}
              selectedServiceSlug={selectedServiceSlug}
              appointmentsEnabled={navigation.public.citas}
              contactEnabled={navigation.public.contacto}
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[var(--tuodonto-line)] bg-[var(--tuodonto-pearl)] px-[var(--space-page-x)] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <Reveal className="relative min-h-[32rem] overflow-hidden rounded-[2.4rem]">
            <Image
              src={brandImages.servicesDetail.src}
              alt={brandImages.servicesDetail.alt}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              style={{ objectFit: brandImages.servicesDetail.fit }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(70,53,42,.52),transparent_65%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <Sparkles className="size-8 text-[var(--tuodonto-gold-light)]" />
              <h2 className="tuodonto-display mt-4 max-w-2xl text-5xl leading-none">
                {services[0]?.summary ?? "Servicios por configurar y publicar."}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="tuodonto-eyebrow">Tu cita en {settings.brandName}</p>
            <div className="mt-6 divide-y divide-[var(--tuodonto-line)] border-y border-[var(--tuodonto-line)]">
              {landing.method.steps.map((item, index) => (
                <div key={item} className="flex items-center gap-5 py-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full tuodonto-sky-fill text-sm font-bold text-[var(--tuodonto-brown)]">
                    {index + 1}
                  </span>
                  <span className="text-lg font-semibold text-[var(--tuodonto-brown)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--space-page-x)] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <Reveal key={service.id}>
              <div className="flex min-h-40 flex-col justify-between border-t border-[var(--tuodonto-line)] pt-5">
                <CircleCheck className="size-7 text-[var(--tuodonto-gold)]" />
                <p className="mt-8 text-xl leading-8 text-[var(--tuodonto-brown)]">
                  {service.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-[var(--space-page-x)] pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2.4rem] bg-[linear-gradient(135deg,rgba(3,210,246,.16),rgba(255,255,255,.88))] p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <CalendarCheck className="size-8 text-[var(--tuodonto-gold)]" />
            <h2 className="tuodonto-display mt-4 text-5xl leading-none text-[var(--tuodonto-brown)]">
              Elige el servicio en tu cita.
            </h2>
          </div>
          {navigation.public.citas ? (
            <PublicLinkButton href="/citas">Reservar</PublicLinkButton>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
