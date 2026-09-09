import type { Metadata } from "next";
import {
  ChevronDown,
  CircleHelp,
  CreditCard,
  ExternalLink,
} from "lucide-react";

import { AppointmentForm } from "@/components/forms/appointment-form";
import { PublicLinkButton } from "@/components/public/link-button";
import { PublicShell } from "@/components/public/public-shell";
import { doctoraliaUrl } from "@/lib/social-links";
import {
  getBookableServices,
  getLandingCopy,
  getSiteSettings,
  getTeamMembers,
} from "@/lib/repository";

export const metadata: Metadata = {
  title: "Citas",
  description: "Solicita una valoración odontológica y elige el servicio que necesitas.",
};

export const dynamic = "force-dynamic";

export default async function CitasPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  const [query, services, teamMembers, settings, landing] = await Promise.all([
    searchParams,
    getBookableServices(),
    getTeamMembers(),
    getSiteSettings(),
    getLandingCopy(),
  ]);
  const selectedServiceSlug = Array.isArray(query.servicio)
    ? query.servicio[0]
    : query.servicio;
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hola ${settings.brandName}, quiero agendar una cita.`)}`;
  const doctoraliaHref = doctoraliaUrl(settings.doctoralia);

  return (
    <PublicShell active="citas" settings={settings}>
      <section
        id="formulario"
        aria-labelledby="citas-form-title"
        className="px-[var(--space-page-x)] py-5 md:py-7 lg:min-h-svh lg:py-6"
      >
        <div className="mx-auto max-w-3xl">
          <div>
            <AppointmentForm
              services={services}
              teamMembers={teamMembers}
              selectedServiceSlug={selectedServiceSlug}
              titleId="citas-form-title"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <PublicLinkButton
              href={whatsappHref}
              external
              variant="sky"
              icon="whatsapp"
              className="w-full"
            >
              Prefiero WhatsApp
            </PublicLinkButton>
            {doctoraliaHref ? (
              <a
                href={doctoraliaHref}
                target="_blank"
                rel="noreferrer"
                className="tuodonto-focus inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--tuodonto-line)] bg-white/70 px-6 text-sm font-semibold text-[var(--tuodonto-brown)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Agendar por Doctoralia
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {landing.patientInfo ? (
        <section
          aria-labelledby="citas-info-title"
          className="border-t border-[var(--tuodonto-line)] bg-[var(--tuodonto-pearl)] px-[var(--space-page-x)] py-14"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-[var(--tuodonto-line)] bg-white/62 p-6 shadow-[0_20px_60px_rgba(4,21,67,.06)] md:p-8">
              <CreditCard className="size-7 text-[var(--tuodonto-gold)]" aria-hidden="true" />
              <p className="tuodonto-eyebrow mt-5">Opciones de pago</p>
              <h2 id="citas-info-title" className="tuodonto-display mt-2 text-4xl leading-none text-[var(--tuodonto-brown)]">
                {landing.patientInfo.financingTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[var(--tuodonto-taupe)]">
                {landing.patientInfo.financingCopy}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <CircleHelp className="size-6 text-[var(--tuodonto-gold)]" aria-hidden="true" />
                <p className="tuodonto-eyebrow">Preguntas frecuentes</p>
              </div>
              <div className="mt-5 divide-y divide-[var(--tuodonto-line)] border-y border-[var(--tuodonto-line)]">
                {landing.patientInfo.faq.map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="tuodonto-focus flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--tuodonto-brown)] marker:hidden">
                      <span>{item.question}</span>
                      <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--tuodonto-taupe)]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </PublicShell>
  );
}
