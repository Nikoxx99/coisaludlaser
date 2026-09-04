import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { PublicLinkButton } from "@/components/public/link-button";
import type { BrandImage, Service, ServiceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const serviceGuides: Record<
  string,
  {
    outcome: string;
    checks: string[];
    path: string[];
    note: string;
  }
> = {
  ortodoncia: {
    outcome:
      "Busca alinear dientes, mejorar mordida y hacer que la sonrisa se vea más proporcionada sin perder naturalidad.",
    checks: ["Mordida y apiñamiento", "Espacios y línea media", "Hábitos y controles"],
    path: ["Valoración", "Plan de movimiento", "Controles periódicos"],
    note: "La alternativa se define después del diagnóstico, no antes.",
  },
  endodoncia: {
    outcome:
      "Ayuda a conservar un diente afectado por dolor profundo, caries avanzada o compromiso del nervio.",
    checks: ["Origen del dolor", "Estado de la raíz", "Restauración posterior"],
    path: ["Diagnóstico", "Tratamiento del conducto", "Control y rehabilitación"],
    note: "La prioridad es controlar la molestia y proteger la pieza dental.",
  },
  periodoncia: {
    outcome:
      "Protege encías, hueso y soporte dental para evitar inflamación crónica, sangrado o movilidad.",
    checks: ["Sangrado e inflamación", "Profundidad periodontal", "Mantenimiento"],
    path: ["Evaluación periodontal", "Limpieza profunda", "Controles de soporte"],
    note: "Una sonrisa estable empieza por encías sanas.",
  },
  "odontologia-general": {
    outcome:
      "Resuelve necesidades frecuentes de salud oral y orienta el plan cuando hay varios hallazgos clínicos.",
    checks: ["Caries y restauraciones", "Encías y sensibilidad", "Prioridad clínica"],
    path: ["Valoración integral", "Tratamiento indicado", "Seguimiento preventivo"],
    note: "Es la puerta de entrada para ordenar el cuidado de la boca.",
  },
  "higiene-oral": {
    outcome:
      "Remueve placa, cálculo y pigmentaciones superficiales mientras ajusta tu rutina diaria de cuidado.",
    checks: ["Acúmulo de placa", "Técnica de cepillado", "Sensibilidad"],
    path: ["Revisión inicial", "Profilaxis", "Guía de cuidado en casa"],
    note: "El resultado se sostiene con hábitos claros y controles a tiempo.",
  },
  "rehabilitacion-oral": {
    outcome:
      "Recupera función, mordida y estética cuando hay desgaste, fracturas, ausencias o restauraciones antiguas.",
    checks: ["Mordida y estabilidad", "Dientes comprometidos", "Materiales indicados"],
    path: ["Diagnóstico por fases", "Plan restaurativo", "Ajuste y control"],
    note: "Se planea para que la sonrisa se vea bien y funcione bien.",
  },
  odontopediatria: {
    outcome:
      "Acompaña a niños y adolescentes con prevención, manejo temprano de caries y visitas más tranquilas.",
    checks: ["Hábitos e higiene", "Caries temprana", "Crecimiento y controles"],
    path: ["Acercamiento amable", "Tratamiento preventivo", "Seguimiento familiar"],
    note: "La experiencia importa tanto como el tratamiento.",
  },
  "diseno-de-sonrisa": {
    outcome:
      "Planea color, forma y proporción para lograr una sonrisa armónica, natural y clínicamente viable.",
    checks: ["Expectativas estéticas", "Fotografías y proporción", "Salud previa"],
    path: ["Diagnóstico estético", "Propuesta de ruta", "Tratamiento por fases"],
    note: "Primero se valida salud y mordida; luego se define la estética.",
  },
  "urgencias-odontologicas": {
    outcome:
      "Busca controlar la situación inicial, entender el origen de la molestia y ordenar los siguientes pasos.",
    checks: ["Dolor y síntomas", "Trauma o inflamación", "Prioridad clínica"],
    path: ["Valoración prioritaria", "Manejo inicial", "Tratamiento o remisión"],
    note: "La prioridad y el tratamiento se definen después de revisar el caso.",
  },
  exodoncias: {
    outcome:
      "Retira una pieza cuando conservarla no es viable o cuando existe una indicación clínica confirmada.",
    checks: ["Antecedentes de salud", "Imagen diagnóstica", "Cuidados posteriores"],
    path: ["Valoración", "Planeación del procedimiento", "Control"],
    note: "No toda molestia termina en extracción; primero se confirma la indicación.",
  },
  "frenillectomia-laser": {
    outcome:
      "Aborda un frenillo que limita movilidad o función cuando la evaluación confirma la indicación.",
    checks: ["Movilidad y función", "Tejidos involucrados", "Plan de recuperación"],
    path: ["Valoración funcional", "Procedimiento indicado", "Seguimiento"],
    note: "El uso del láser y el plan posterior dependen de la valoración.",
  },
  "gingivoplastia-laser": {
    outcome:
      "Armoniza el contorno de las encías respetando su salud y las proporciones de la sonrisa.",
    checks: ["Salud de encías", "Proporciones", "Expectativa estética"],
    path: ["Valoración", "Planeación del contorno", "Control"],
    note: "La estética se trabaja solo después de comprobar la salud de los tejidos.",
  },
  "aclaramiento-dental": {
    outcome:
      "Busca mejorar el tono dental con una técnica elegida según sensibilidad y condiciones de la boca.",
    checks: ["Color inicial", "Sensibilidad", "Restauraciones existentes"],
    path: ["Valoración", "Técnica indicada", "Cuidados y control"],
    note: "El cambio posible varía entre pacientes y se define en la valoración.",
  },
  "carillas-dentales": {
    outcome:
      "Busca armonizar forma, color y proporción con una planeación individual y conservadora.",
    checks: ["Mordida", "Tejido dental", "Objetivos estéticos"],
    path: ["Diagnóstico estético", "Diseño y material", "Tratamiento y control"],
    note: "Las carillas son una alternativa posible, no una decisión previa al diagnóstico.",
  },
  "resinas-e-incrustaciones": {
    outcome:
      "Recupera estructura, función y apariencia con la restauración apropiada para cada diente.",
    checks: ["Tejido comprometido", "Mordida", "Material indicado"],
    path: ["Diagnóstico", "Restauración", "Ajuste y control"],
    note: "La extensión del daño orienta la elección entre resina, incrustación u otra opción.",
  },
};

function guideFor(service: Service) {
  return (
    serviceGuides[service.slug] ?? {
      outcome: service.summary,
      checks: ["Diagnóstico", "Indicación clínica", "Seguimiento"],
      path: ["Valoración", "Plan de tratamiento", "Control"],
      note: "El equipo define la ruta después de revisar tu caso.",
    }
  );
}

function specialistsFor(service: Service) {
  return service.specialists && service.specialists.length > 0
    ? service.specialists
    : service.specialist
      ? [service.specialist]
      : [];
}

/**
 * Detalle publico de servicios. La ruta /servicios?servicio=slug pinta el
 * contenido en pagina, sin modal, para que cada servicio sea navegable,
 * compartible y claro para pacientes.
 */
export function ServiceDetails({
  services,
  categories = [],
  fallbackImage,
  selectedServiceSlug,
  appointmentsEnabled = true,
  contactEnabled = true,
}: {
  services: Service[];
  categories?: ServiceCategory[];
  fallbackImage?: BrandImage;
  selectedServiceSlug?: string;
  appointmentsEnabled?: boolean;
  contactEnabled?: boolean;
}) {
  if (services.length === 0) {
    return (
      <div className="border-y border-[var(--tuodonto-line)] py-10">
        <p className="text-sm leading-7 text-[var(--tuodonto-taupe)]">
          Todavía no hay servicios públicos disponibles.
        </p>
      </div>
    );
  }

  const categoryMap = new Map(
    categories.map((category) => [category.slug, category])
  );
  const selectedService =
    services.find((service) => service.slug === selectedServiceSlug) ??
    services[0];
  const selectedIndex = services.findIndex(
    (service) => service.slug === selectedService.slug
  );
  const previousService =
    services[(selectedIndex - 1 + services.length) % services.length];
  const nextService = services[(selectedIndex + 1) % services.length];
  const imageSrc = selectedService.imageUrl ?? fallbackImage?.src;
  const imageAlt = selectedService.imageUrl
    ? selectedService.name
    : fallbackImage?.alt ?? selectedService.name;
  const categoryLabel =
    categoryMap.get(selectedService.categorySlug)?.name ?? "Servicio clínico";
  const guide = guideFor(selectedService);
  const specialists = specialistsFor(selectedService);

  return (
    <div className="space-y-8">
      <nav
        aria-label="Cambiar servicio"
        className="border-y border-[var(--tuodonto-line)] py-3"
      >
        <div className="tuodonto-service-scroll -mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
          {services.map((service) => {
            const isSelected = service.slug === selectedService.slug;

            return (
              <Link
                key={service.id}
                href={`/servicios?servicio=${service.slug}`}
                scroll={false}
                aria-current={isSelected ? "page" : undefined}
                className={cn(
                  "tuodonto-focus inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition active:translate-y-px",
                  isSelected
                    ? "border-[var(--tuodonto-gold)] bg-[rgba(3,80,225,.1)] text-[var(--tuodonto-brown)]"
                    : "border-[var(--tuodonto-line)] bg-white/55 text-[var(--tuodonto-taupe)] hover:-translate-y-0.5 hover:bg-white hover:text-[var(--tuodonto-brown)]"
                )}
              >
                {service.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <article className="overflow-hidden rounded-[2rem] border border-[var(--tuodonto-line)] bg-white/62 shadow-[0_24px_70px_rgba(71,49,34,.09)]">
        <div className="grid xl:grid-cols-[minmax(0,1.04fr)_22rem]">
          <div>
            {imageSrc ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--tuodonto-mist)]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1280px) 48rem, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(70,53,42,.32),transparent_48%)]" />
              </div>
            ) : null}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-[var(--tuodonto-pearl)] px-3 py-1 text-xs font-semibold text-[var(--tuodonto-taupe)]">
                  {categoryLabel}
                </span>
                {selectedService.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(3,210,246,.14)] px-3 py-1 text-xs font-semibold text-[var(--tuodonto-brown)]">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Destacado
                  </span>
                ) : null}
              </div>

              <h2 className="tuodonto-display mt-5 max-w-3xl text-5xl leading-none text-[var(--tuodonto-brown)] md:text-6xl">
                {selectedService.name}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--tuodonto-taupe)]">
                {selectedService.description}
              </p>

              <div className="mt-8 grid gap-6 border-y border-[var(--tuodonto-line)] py-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-[var(--tuodonto-brown)]">
                    <CheckCircle2
                      className="size-5 text-[var(--tuodonto-gold)]"
                      aria-hidden="true"
                    />
                    Qué busca lograr
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--tuodonto-taupe)]">
                    {guide.outcome}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-[var(--tuodonto-brown)]">
                    <ShieldCheck
                      className="size-5 text-[var(--tuodonto-gold)]"
                      aria-hidden="true"
                    />
                    Qué revisamos
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--tuodonto-taupe)]">
                    {guide.checks.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--tuodonto-gold)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {appointmentsEnabled &&
                selectedService.publicBookingEnabled !== false ? (
                  <PublicLinkButton
                    href={`/citas?servicio=${selectedService.slug}`}
                  >
                    Agendar este servicio
                  </PublicLinkButton>
                ) : null}
                {contactEnabled ? (
                  <PublicLinkButton href="/contacto" variant="sky">
                    Resolver una duda
                  </PublicLinkButton>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="border-t border-[var(--tuodonto-line)] bg-[rgba(255,255,255,.42)] p-6 md:p-8 xl:border-l xl:border-t-0">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[rgba(3,80,225,.1)] text-[var(--tuodonto-brown)]">
                <CalendarClock className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--tuodonto-gold-deep)]">
                  Tu ruta de atención
                </p>
                <p className="text-sm leading-6 text-[var(--tuodonto-taupe)]">
                  {guide.note}
                </p>
              </div>
            </div>

            <ol className="mt-7 space-y-4">
              {guide.path.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.25rem_1fr] gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-[var(--tuodonto-line)] bg-white/70 text-xs font-bold text-[var(--tuodonto-brown)]">
                    {index + 1}
                  </span>
                  <span className="pt-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-t border-[var(--tuodonto-line)] pt-7">
              <div className="flex items-center gap-3">
                <UsersRound
                  className="size-5 text-[var(--tuodonto-gold)]"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-[var(--tuodonto-brown)]">
                  Profesionales que pueden atenderte
                </h3>
              </div>

              {specialists.length > 0 ? (
                <div className="mt-5 divide-y divide-[var(--tuodonto-line)]">
                  {specialists.map((member) => (
                    <div key={member.id} className="flex gap-4 py-4 first:pt-0">
                      <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--tuodonto-line)] bg-[var(--tuodonto-mist)]">
                        {member.avatarUrl ? (
                          <Image
                            src={member.avatarUrl}
                            alt={member.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="tuodonto-display text-2xl text-[var(--tuodonto-gold)]">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold leading-6 text-[var(--tuodonto-brown)]">
                          {member.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--tuodonto-taupe)]">
                          {member.specialty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[var(--tuodonto-taupe)]">
                  El equipo asigna el profesional indicado al confirmar la
                  agenda.
                </p>
              )}
            </div>
          </aside>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/servicios?servicio=${previousService.slug}`}
          scroll={false}
          className="tuodonto-focus inline-flex min-h-14 items-center justify-between gap-4 rounded-full border border-[var(--tuodonto-line)] bg-white/55 px-5 text-sm font-semibold text-[var(--tuodonto-brown)] transition hover:-translate-y-0.5 hover:bg-white active:translate-y-px"
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Anterior
          </span>
          <span className="truncate text-[var(--tuodonto-taupe)]">
            {previousService.name}
          </span>
        </Link>
        <Link
          href={`/servicios?servicio=${nextService.slug}`}
          scroll={false}
          className="tuodonto-focus inline-flex min-h-14 items-center justify-between gap-4 rounded-full border border-[var(--tuodonto-line)] bg-white/55 px-5 text-sm font-semibold text-[var(--tuodonto-brown)] transition hover:-translate-y-0.5 hover:bg-white active:translate-y-px"
        >
          <span className="truncate text-[var(--tuodonto-taupe)]">
            {nextService.name}
          </span>
          <span className="inline-flex items-center gap-2">
            Siguiente
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  );
}
