import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Plus } from "lucide-react";

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
    note: "En tu valoración revisamos qué opción es adecuada para ti.",
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
    checks: ["Placa acumulada", "Técnica de cepillado", "Sensibilidad"],
    path: ["Revisión inicial", "Profilaxis", "Guía de cuidado en casa"],
    note: "El resultado se sostiene con hábitos claros y controles a tiempo.",
  },
  "rehabilitacion-oral": {
    outcome:
      "Recupera función, mordida y estética cuando hay desgaste, fracturas, ausencias o restauraciones antiguas.",
    checks: ["Mordida y estabilidad", "Dientes comprometidos", "Materiales indicados"],
    path: ["Valoración", "Plan de tratamiento", "Ajuste y control"],
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
      note: "En tu cita revisamos qué cuidado necesitas.",
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
    return <p className="border-t border-[var(--tuodonto-line)] py-10 text-sm text-[var(--tuodonto-taupe)]">Por ahora no hay servicios para mostrar.</p>;
  }

  const selected = services.find((service) => service.slug === selectedServiceSlug) ?? services[0];
  const imageSrc = selected.imageUrl || fallbackImage?.src;
  const guide = guideFor(selected);
  const specialists = specialistsFor(selected);
  const category = categories.find((item) => item.slug === selected.categorySlug)?.name;
  const serviceLinks = services.map((service) => (
    <Link
      key={service.id}
      href={`/servicios?servicio=${encodeURIComponent(service.slug)}`}
      scroll={false}
      aria-current={service.slug === selected.slug ? "page" : undefined}
      className={cn(
        "tuodonto-focus flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
        service.slug === selected.slug
          ? "bg-[rgba(3,80,225,.08)] font-semibold text-[var(--tuodonto-gold)]"
          : "text-[var(--tuodonto-taupe)] hover:bg-white/70 hover:text-[var(--tuodonto-brown)]"
      )}
    >
      <span>{service.name}</span>
      {service.slug === selected.slug ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
    </Link>
  ));
  const summaryClass = "tuodonto-focus flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium text-[var(--tuodonto-brown)] [&::-webkit-details-marker]:hidden";
  const plus = <Plus className="size-4 shrink-0 text-[var(--tuodonto-gold)] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />;

  return (
    <div className="grid min-w-0 items-start gap-7 md:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] md:gap-10 xl:grid-cols-[248px_minmax(0,1fr)]">
      <nav aria-label="Elegir servicio" className="hidden md:block">
        <p className="mb-5 px-3 text-[.65rem] font-semibold uppercase tracking-[.18em] text-[var(--tuodonto-taupe)]">Nuestros servicios</p>
        <div className="space-y-1">{serviceLinks}</div>
      </nav>
      <details key={`selector-${selected.slug}`} className="group rounded-xl border border-[var(--tuodonto-line)] bg-white/40 md:hidden">
        <summary className="tuodonto-focus flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span><span className="block text-xs text-[var(--tuodonto-taupe)]">Conoce nuestros servicios</span><span className="mt-1 block text-sm font-semibold text-[var(--tuodonto-gold)]">{selected.name}</span></span>
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <nav aria-label="Elegir servicio en móvil" className="border-t border-[var(--tuodonto-line)] p-2">{serviceLinks}</nav>
      </details>
      <article key={selected.slug} aria-labelledby="service-title" className="min-w-0">
        {imageSrc ? (
          <div className="relative mb-7 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--tuodonto-mist)] xl:aspect-[5/2]">
            <Image src={imageSrc} alt={selected.imageUrl ? selected.name : fallbackImage?.alt ?? selected.name} fill sizes="(min-width: 1280px) 55vw, (min-width: 768px) 60vw, 100vw" className="object-cover" priority />
          </div>
        ) : null}
        <p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-[var(--tuodonto-gold)]">{category ?? "Servicio clínico"}</p>
        <h2 id="service-title" className="mt-3 break-words text-3xl font-semibold tracking-tight text-[var(--tuodonto-brown)] md:text-4xl">{selected.name}</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--tuodonto-taupe)]">{selected.summary}</p>
        <div className="mb-8 mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          {appointmentsEnabled && selected.publicBookingEnabled !== false ? (
            <PublicLinkButton href={`/citas?servicio=${encodeURIComponent(selected.slug)}`}>Agenda tu cita</PublicLinkButton>
          ) : null}
          {contactEnabled ? <Link href="/contacto" className="tuodonto-focus inline-flex min-h-11 items-center gap-2 text-sm text-[var(--tuodonto-taupe)] hover:text-[var(--tuodonto-gold)]">¿Tienes alguna pregunta?<ArrowUpRight className="size-4" aria-hidden="true" /></Link> : null}
        </div>
        <div className="divide-y divide-[var(--tuodonto-line)] border-y border-[var(--tuodonto-line)]">
          <details className="group">
            <summary className={summaryClass}>Sobre este tratamiento{plus}</summary>
            <div className="space-y-5 pb-6 text-sm leading-7 text-[var(--tuodonto-taupe)]">
              <p>{selected.description}</p>
              <div><h3 className="mb-2 font-semibold text-[var(--tuodonto-brown)]">Qué busca lograr</h3><p>{guide.outcome}</p></div>
              <div><h3 className="mb-2 font-semibold text-[var(--tuodonto-brown)]">Qué revisamos</h3><ul className="list-disc space-y-1 pl-5">{guide.checks.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
          </details>
          <details className="group">
            <summary className={summaryClass}>Cómo es tu atención{plus}</summary>
            <div className="pb-6 text-sm leading-7 text-[var(--tuodonto-taupe)]"><p>{guide.note}</p><ol className="mt-4 space-y-3">{guide.path.map((step, index) => <li key={step} className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[rgba(3,80,225,.08)] text-xs font-semibold text-[var(--tuodonto-gold)]">{index + 1}</span>{step}</li>)}</ol></div>
          </details>
          <details className="group">
            <summary className={summaryClass}>Quién puede atenderte{plus}</summary>
            <div className="space-y-4 pb-6">
              {specialists.length > 0 ? (
                specialists.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--tuodonto-mist)]">
                      {member.avatarUrl ? (
                        <Image
                          src={member.avatarUrl}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-lg text-[var(--tuodonto-gold)]">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--tuodonto-brown)]">
                        {member.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--tuodonto-taupe)]">
                        {member.specialty}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-[var(--tuodonto-taupe)]">
                  El equipo asigna el profesional indicado al confirmar la agenda.
                </p>
              )}
            </div>
          </details>
        </div>
      </article>
    </div>
  );
}
