import type { Metadata } from "next";
import { CalendarDays, Clock, ExternalLink, ShieldCheck } from "lucide-react";

import { AppointmentForm } from "@/components/forms/appointment-form";
import { PublicLinkButton } from "@/components/public/link-button";
import { PublicShell } from "@/components/public/public-shell";
import { formatWeeklyHours } from "@/lib/business-hours";
import { doctoraliaUrl } from "@/lib/social-links";
import {
  getAvailabilitySlots,
  getServices,
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
  const [query, services, teamMembers, availabilitySlots, settings] = await Promise.all([
    searchParams,
    getServices(),
    getTeamMembers(),
    getAvailabilitySlots(),
    getSiteSettings(),
  ]);
  const selectedServiceSlug = Array.isArray(query.servicio)
    ? query.servicio[0]
    : query.servicio;
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hola ${settings.brandName}, quiero agendar una cita.`)}`;
  const doctoraliaHref = doctoraliaUrl(settings.doctoralia);
  const businessHours = formatWeeklyHours(availabilitySlots);

  return (
    <PublicShell active="citas" settings={settings}>
      <section
        id="formulario"
        aria-labelledby="citas-form-title"
        className="px-[var(--space-page-x)] py-5 md:py-7 lg:min-h-svh lg:py-6"
      >
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,.7fr)] xl:items-start">
          <div>
            <AppointmentForm
              services={services}
              teamMembers={teamMembers}
              selectedServiceSlug={selectedServiceSlug}
              titleId="citas-form-title"
            />
          </div>

          <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.75rem] border border-[var(--tuodonto-line)] bg-white/64 p-5 shadow-[0_20px_60px_rgba(4,21,67,.07)]">
              <p className="tuodonto-eyebrow">Antes de enviar</p>
              <h2 className="tuodonto-display mt-2 text-3xl leading-none text-[var(--tuodonto-brown)]">
                Coordinamos la agenda contigo.
              </h2>
              <div className="mt-5 flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-[var(--tuodonto-gold)]" />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--tuodonto-brown)]">
                    Horario de atención
                  </h3>
                  <div className="mt-1 space-y-0.5 text-xs leading-5 text-[var(--tuodonto-taupe)]">
                    {businessHours.length > 0 ? (
                      businessHours.map((line) => (
                        <p key={line.days}>
                          <span className="font-medium text-[var(--tuodonto-brown)]">
                            {line.days}:
                          </span>{" "}
                          {line.hours}
                        </p>
                      ))
                    ) : (
                      <p>Te confirmamos disponibilidad por WhatsApp.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 border-t border-[var(--tuodonto-line)] pt-4">
                {[
                {
                  icon: CalendarDays,
                  title: "Valoración inicial",
                  copy: "Define servicio y prioridad clínica.",
                },
                {
                  icon: ShieldCheck,
                  title: "Datos protegidos",
                  copy: "Solo los usamos para responder tu solicitud.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <item.icon className="mt-0.5 size-5 shrink-0 text-[var(--tuodonto-gold)]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--tuodonto-brown)]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-[var(--tuodonto-taupe)]">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            <div className="grid content-start gap-3 rounded-[1.75rem] border border-[var(--tuodonto-line)] bg-white/48 p-4">
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
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
