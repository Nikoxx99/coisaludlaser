"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarCheck, CheckCircle2, Loader2, Send } from "lucide-react";

import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Solicitud de cita sin fecha ni hora (cambio solicitado por el cliente):
 * el paciente deja sus datos y el equipo coordina la agenda por WhatsApp.
 */
type AppointmentFields = {
  service: string;
  name: string;
  phone: string;
  email: string;
  discoverySource: string;
  notes: string;
  date: string;
  time: string;
  teamMemberId: string;
};

type AvailabilityDay = {
  date: string;
  dayName: string;
  slots: Array<{ time: string; teamMemberId: string | null; teamMemberName: string | null }>;
};

type SubmissionState =
  | { status: "idle"; message: string; confirmation?: string }
  | { status: "submitting"; message: string; confirmation?: string }
  | { status: "success"; message: string; confirmation: string }
  | { status: "error"; message: string; confirmation?: string };

const fieldClass =
  "tuodonto-field min-h-12 w-full px-4 py-3 text-sm text-[var(--tuodonto-ink)] placeholder:text-[var(--tuodonto-muted)] focus:border-[var(--tuodonto-sky-strong)] focus:outline-none focus:ring-4 focus:ring-[rgba(169,220,233,.28)]";
const discoveryOptions = [
  "Instagram",
  "WhatsApp",
  "Google",
  "Referido",
  "Web",
  "Clinica",
];

export function AppointmentForm({
  services,
  selectedServiceSlug,
  titleId,
}: {
  services: Service[];
  selectedServiceSlug?: string;
  titleId?: string;
}) {
  const initialService =
    services.find((service) => service.slug === selectedServiceSlug)?.slug ??
    services[0]?.slug ??
    "";
  const initialFields = useMemo<AppointmentFields>(
    () => ({
      service: initialService,
      name: "",
      phone: "",
      email: "",
      discoverySource: "",
      notes: "",
      date: "",
      time: "",
      teamMemberId: "",
    }),
    [initialService]
  );
  const [fields, setFields] = useState<AppointmentFields>(initialFields);
  const [state, setState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [availabilityState, setAvailabilityState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const selectedService = services.find(
    (service) => service.slug === fields.service
  );
  const selectedSpecialists =
    selectedService?.specialists && selectedService.specialists.length > 0
      ? selectedService.specialists
      : selectedService?.specialist
        ? [selectedService.specialist]
        : [];
  const selectedDay = availability.find((day) => day.date === fields.date);

  useEffect(() => {
    if (!fields.service) return;
    const controller = new AbortController();
    fetch(`/api/availability?serviceSlug=${encodeURIComponent(fields.service)}&days=30`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as { ok?: boolean; days?: AvailabilityDay[] };
        if (!response.ok || !result.ok) throw new Error("availability");
        const days = result.days ?? [];
        setAvailability(days);
        setAvailabilityState(days.length ? "ready" : "empty");
        setFields((current) => ({ ...current, date: "", time: "", teamMemberId: "" }));
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailability([]);
        setAvailabilityState("error");
      });
    return () => controller.abort();
  }, [fields.service]);

  function updateField(field: keyof AppointmentFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setState({ status: "submitting", message: "Enviando tu solicitud..." });

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const result = (await response.json()) as {
      message?: string;
      confirmation?: string;
    };

    if (!response.ok || !result.confirmation) {
      setState({
        status: "error",
        message:
          result.message ??
          "No pudimos registrar la solicitud. Intenta de nuevo o escribe por WhatsApp.",
      });
      return;
    }

    setState({
      status: "success",
      message:
        result.message ??
        "Recibimos tu solicitud. Te contactaremos para coordinar fecha y hora.",
      confirmation: result.confirmation,
    });
  }

  if (state.status === "success") {
    return (
      <div className="tuodonto-glass rounded-[2rem] p-6 md:p-8">
        <div className="flex size-14 items-center justify-center rounded-full tuodonto-gold-fill">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <p className="tuodonto-eyebrow mt-6">Solicitud recibida</p>
        <h2 className="tuodonto-display mt-2 text-5xl leading-none text-[var(--tuodonto-brown)]">
          Nos pondremos en contacto contigo.
        </h2>
        <p className="mt-5 text-[var(--tuodonto-taupe)]">{state.message}</p>
        <div className="mt-6 rounded-[1.5rem] border border-[var(--tuodonto-line)] bg-white/55 p-5">
          <span className="text-xs font-semibold uppercase text-[var(--tuodonto-gold-deep)]">
            Confirmación
          </span>
          <p className="mt-1 text-2xl font-semibold text-[var(--tuodonto-ink)]">
            {state.confirmation}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--tuodonto-taupe)]">
            {selectedService?.name ?? fields.service}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFields(initialFields);
            setState({ status: "idle", message: "" });
          }}
          className="tuodonto-focus mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full tuodonto-sky-fill px-5 text-sm font-semibold transition hover:-translate-y-0.5"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="tuodonto-glass rounded-[1.75rem] p-4 sm:p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id={titleId} className="tuodonto-display mt-1.5 text-4xl leading-none text-[var(--tuodonto-brown)] md:text-[2.75rem]">
            Pide tu valoración.
          </h2>
          <p className="mt-2 text-sm leading-5 text-[var(--tuodonto-taupe)]">
            Déjanos tus datos y coordinamos contigo la fecha y la hora.
          </p>
        </div>
        <div className="hidden size-12 items-center justify-center rounded-full tuodonto-gold-fill md:flex">
          <CalendarCheck className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-x-4 gap-y-3.5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Servicio
          <Select
            value={fields.service}
            onValueChange={(value) => {
              setAvailabilityState("loading");
              updateField("service", value ?? "");
            }}
          >
            <SelectTrigger className={cn(fieldClass, "h-12 w-full rounded-[1rem] bg-white/72")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[1rem] border border-[var(--tuodonto-line)] bg-white p-1 shadow-2xl">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.slug} className="min-h-11 px-3 text-[var(--tuodonto-brown)]">
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        {selectedSpecialists.length > 0 ? (
          <div className="rounded-[1.25rem] border border-[var(--tuodonto-line)] bg-white/45 p-3">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--tuodonto-gold-deep)]">
              Profesionales posibles
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSpecialists.map((member) => (
                <div
                  key={member.id}
                  className="flex min-w-0 items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-3"
                >
                  <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--tuodonto-line)] bg-[var(--tuodonto-mist)]">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="tuodonto-display text-xl text-[var(--tuodonto-gold)]">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[var(--tuodonto-brown)]">
                      {member.name}
                    </span>
                    <span className="block truncate text-xs font-normal text-[var(--tuodonto-taupe)]">
                      {member.specialty}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs font-normal leading-4 text-[var(--tuodonto-taupe)]">
              Al confirmar la cita asignamos el profesional disponible indicado
              para tu caso.
            </p>
          </div>
        ) : null}
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Fecha disponible
          <input
            type="date"
            value={fields.date}
            min={availability[0]?.date}
            max={availability.at(-1)?.date}
            onChange={(event) => {
              updateField("date", event.target.value);
              setFields((current) => ({ ...current, date: event.target.value, time: "", teamMemberId: "" }));
            }}
            className={fieldClass}
            required={availabilityState === "ready"}
            disabled={availabilityState !== "ready"}
          />
          <span className="block text-xs font-normal leading-4 text-[var(--tuodonto-taupe)]" aria-live="polite">
            {availabilityState === "loading" && "Consultando agenda real…"}
            {availabilityState === "empty" && "No hay horarios publicados; enviaremos tu solicitud para coordinarla."}
            {availabilityState === "error" && "No pudimos consultar la agenda; puedes enviar la solicitud y te contactaremos."}
            {availabilityState === "ready" && !fields.date && "Elige en el calendario una de las fechas con disponibilidad."}
          </span>
        </label>
        <fieldset className="min-w-0 space-y-2" disabled={!selectedDay}>
          <legend className="text-sm font-semibold text-[var(--tuodonto-brown)]">Hora disponible</legend>
          <div className="flex min-h-12 flex-wrap gap-2 rounded-[1rem] border border-[var(--tuodonto-line)] bg-white/45 p-1.5">
            {selectedDay ? selectedDay.slots.map((slot) => {
              const selected = fields.time === slot.time && fields.teamMemberId === (slot.teamMemberId ?? "");
              return (
                <button key={`${slot.time}-${slot.teamMemberId ?? "any"}`} type="button" onClick={() => setFields((current) => ({ ...current, time: slot.time, teamMemberId: slot.teamMemberId ?? "" }))} className={cn("tuodonto-focus min-h-9 rounded-full px-3 text-xs font-semibold", selected ? "bg-[var(--tuodonto-gold)] text-white" : "bg-white text-[var(--tuodonto-brown)]")} aria-pressed={selected}>
                  {slot.time}
                </button>
              );
            }) : <span className="self-center px-2 text-xs text-[var(--tuodonto-muted)]">Selecciona una fecha</span>}
          </div>
          {availabilityState === "ready" ? <input className="sr-only" tabIndex={-1} required value={fields.time} onChange={() => undefined} aria-label="Hora seleccionada" /> : null}
        </fieldset>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Nombre completo
          <input
            type="text"
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldClass}
            placeholder="Tu nombre"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Teléfono / WhatsApp
          <input
            type="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClass}
            placeholder="321 000 0000"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Correo
          <input
            type="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClass}
            placeholder="correo@ejemplo.com"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          De dónde nos conociste
          <select
            value={fields.discoverySource}
            onChange={(event) =>
              updateField("discoverySource", event.target.value)
            }
            className={cn(fieldClass, "appearance-none")}
          >
            <option value="">Selecciona una opción</option>
            {discoveryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3.5 block space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
        Comentario
        <textarea
          value={fields.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className={cn(fieldClass, "min-h-20 resize-y")}
          placeholder="Cuéntanos si tienes dolor, sensibilidad o una fecha ideal."
        />
      </label>

      {state.status === "error" && (
        <p className="mt-4 rounded-full bg-[rgba(184,82,71,.1)] px-4 py-3 text-sm text-[var(--tuodonto-danger)]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="tuodonto-focus mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full tuodonto-gold-fill px-6 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60 md:w-auto"
      >
        {state.status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        Enviar solicitud
      </button>
    </form>
  );
}
