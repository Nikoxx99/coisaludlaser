"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2, Send } from "lucide-react";

import type { Service, TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Agenda pública conectada a servicios, equipo y disponibilidad de TuOdonto. */
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
  consent: boolean;
};

type AvailabilityDay = {
  date: string;
  dayName: string;
  slots: Array<{ time: string; teamMemberId: string | null; teamMemberName: string | null }>;
};

type AppointmentFieldErrors = Partial<
  Record<keyof AppointmentFields, string[]>
>;

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
const ANY_TEAM_VALUE = "__first_available__";

function professionalsForService(
  service: Service | undefined,
  teamMembers: TeamMember[]
) {
  if (!service) return [];

  const activeTeam = teamMembers.filter((member) => member.active);
  const membersById = new Map(
    [
      ...activeTeam,
      ...(service.specialists ?? []),
      ...(service.specialist ? [service.specialist] : []),
    ]
      .filter((member) => member.active)
      .map((member) => [member.id, member])
  );
  const assignedIds = Array.from(
    new Set([
      ...(service.teamMemberIds ?? []),
      ...(service.teamMemberId ? [service.teamMemberId] : []),
    ])
  );

  if (assignedIds.length > 0) {
    return assignedIds
      .map((id) => membersById.get(id))
      .filter((member): member is TeamMember => Boolean(member));
  }

  // El backend permite a cualquier profesional activo cuando el servicio no
  // tiene una asociación explícita. Reflejamos esa misma regla en el sitio.
  return activeTeam;
}

function firstFieldError(errors: AppointmentFieldErrors, field: keyof AppointmentFields) {
  return errors[field]?.[0];
}

export function AppointmentForm({
  services,
  teamMembers,
  selectedServiceSlug,
  titleId,
}: {
  services: Service[];
  teamMembers: TeamMember[];
  selectedServiceSlug?: string;
  titleId?: string;
}) {
  const initialService = useMemo(
    () =>
      services.find((service) => service.slug === selectedServiceSlug) ??
      services[0],
    [selectedServiceSlug, services]
  );
  const initialProfessionals = useMemo(
    () => professionalsForService(initialService, teamMembers),
    [initialService, teamMembers]
  );
  const initialFields = useMemo<AppointmentFields>(
    () => ({
      service: initialService?.slug ?? "",
      name: "",
      phone: "",
      email: "",
      discoverySource: "",
      notes: "",
      date: "",
      time: "",
      teamMemberId:
        initialProfessionals.length === 1 ? initialProfessionals[0].id : "",
      consent: false,
    }),
    [initialProfessionals, initialService?.slug]
  );
  const [fields, setFields] = useState<AppointmentFields>(initialFields);
  const [state, setState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [availabilityState, setAvailabilityState] = useState<"loading" | "ready" | "empty" | "error">(
    services.length > 0 ? "loading" : "empty"
  );
  const [availabilityError, setAvailabilityError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AppointmentFieldErrors>({});
  const selectedService = services.find(
    (service) => service.slug === fields.service
  );
  const selectedSpecialists = professionalsForService(selectedService, teamMembers);
  const selectedSpecialist = selectedSpecialists.find(
    (member) => member.id === fields.teamMemberId
  );
  const selectedDay = availability.find((day) => day.date === fields.date);

  useEffect(() => {
    if (!fields.service) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      serviceSlug: fields.service,
      days: "30",
    });
    if (fields.teamMemberId) {
      params.set("teamMemberId", fields.teamMemberId);
    }
    fetch(`/api/availability?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as {
          ok?: boolean;
          days?: AvailabilityDay[];
          error?: string;
          message?: string;
        };
        if (!response.ok || !result.ok) {
          throw new Error(
            result.error || result.message || "No pudimos consultar la agenda."
          );
        }
        const days = result.days ?? [];
        setAvailability(days);
        setAvailabilityState(days.length ? "ready" : "empty");
        setFields((current) => ({ ...current, date: "", time: "" }));
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailability([]);
        setAvailabilityState("error");
        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "No pudimos consultar la agenda."
        );
      });
    return () => controller.abort();
  }, [fields.service, fields.teamMemberId]);

  function updateField(field: keyof AppointmentFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (availabilityState === "loading") {
      setState({ status: "error", message: "Espera a que termine de cargar la agenda." });
      return;
    }
    if (availabilityState === "ready" && (!fields.date || !fields.time)) {
      const errors: AppointmentFieldErrors = {};
      if (!fields.date) errors.date = ["Selecciona una fecha disponible."];
      if (!fields.time) errors.time = ["Selecciona una hora disponible."];
      setFieldErrors(errors);
      setState({
        status: "error",
        message: "Selecciona una fecha y una hora disponibles para reservar.",
      });
      return;
    }

    setState({
      status: "submitting",
      message:
        availabilityState === "ready"
          ? "Agendando tu valoración..."
          : "Enviando tu solicitud...",
    });
    setFieldErrors({});

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
        confirmation?: string;
        errors?: AppointmentFieldErrors;
      } | null;

      if (!response.ok || !result?.confirmation) {
        const errors = result?.errors ?? {};
        const details = Array.from(
          new Set(Object.values(errors).flat().filter(Boolean))
        );
        setFieldErrors(errors);
        setState({
          status: "error",
          message:
            details.length > 0
              ? details.join(" ")
              : result?.message ??
                "No pudimos registrar la solicitud. Intenta de nuevo o escribe por WhatsApp.",
        });
        return;
      }

      setState({
        status: "success",
        message:
          result.message ??
          "Tu valoración quedó agendada. Conserva el código de confirmación.",
        confirmation: result.confirmation,
      });
    } catch {
      setState({
        status: "error",
        message:
          "No pudimos conectar con la agenda. Revisa tu conexión e intenta de nuevo; tus datos siguen en el formulario.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="tuodonto-glass rounded-[2rem] p-6 md:p-8">
        <div className="flex size-14 items-center justify-center rounded-full tuodonto-gold-fill">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <p className="tuodonto-eyebrow mt-6">
          {fields.date && fields.time ? "Valoración agendada" : "Solicitud recibida"}
        </p>
        <h2 className="tuodonto-display mt-2 text-5xl leading-none text-[var(--tuodonto-brown)]">
          {fields.date && fields.time
            ? "Tu horario quedó reservado."
            : "El equipo te contactará."}
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
            setFieldErrors({});
            setState({ status: "idle", message: "" });
          }}
          className="tuodonto-focus mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full tuodonto-sky-fill px-5 text-sm font-semibold transition hover:-translate-y-0.5"
        >
          Agendar otra valoración
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
            Agenda tu valoración.
          </h2>
          <p className="mt-2 text-sm leading-5 text-[var(--tuodonto-taupe)]">
            Elige modalidad, fecha y hora disponible. Si la agenda no carga,
            envía tus datos y el equipo te contactará.
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
              const service = services.find((item) => item.slug === value);
              const professionals = professionalsForService(service, teamMembers);
              setAvailabilityState("loading");
              setAvailabilityError("");
              setFields((current) => ({
                ...current,
                service: value ?? "",
                teamMemberId:
                  professionals.length === 1 ? professionals[0].id : "",
                date: "",
                time: "",
              }));
              setFieldErrors((current) => ({
                ...current,
                service: undefined,
                teamMemberId: undefined,
                date: undefined,
                time: undefined,
              }));
            }}
          >
            <SelectTrigger
              aria-invalid={Boolean(firstFieldError(fieldErrors, "service"))}
              aria-describedby={firstFieldError(fieldErrors, "service") ? "appointment-service-error" : undefined}
              className={cn(fieldClass, "h-12 w-full rounded-[1rem] bg-white/72")}
            >
              <SelectValue>{selectedService?.name ?? "Selecciona un servicio"}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[1rem] border border-[var(--tuodonto-line)] bg-white p-1 shadow-2xl">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.slug} className="min-h-11 px-3 text-[var(--tuodonto-brown)]">
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {firstFieldError(fieldErrors, "service") ? (
            <span id="appointment-service-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "service")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Especialista
          <Select
            value={fields.teamMemberId || ANY_TEAM_VALUE}
            disabled={selectedSpecialists.length === 0}
            onValueChange={(value) => {
              const teamMemberId =
                value === ANY_TEAM_VALUE ? "" : value ?? "";
              setAvailabilityState("loading");
              setAvailabilityError("");
              setFields((current) => ({
                ...current,
                teamMemberId,
                date: "",
                time: "",
              }));
              setFieldErrors((current) => ({
                ...current,
                teamMemberId: undefined,
                date: undefined,
                time: undefined,
              }));
            }}
          >
            <SelectTrigger
              aria-invalid={Boolean(firstFieldError(fieldErrors, "teamMemberId"))}
              aria-describedby={
                firstFieldError(fieldErrors, "teamMemberId")
                  ? "appointment-specialist-help appointment-specialist-error"
                  : "appointment-specialist-help"
              }
              className={cn(fieldClass, "h-12 w-full rounded-[1rem] bg-white/72")}
            >
              <SelectValue>
                {selectedSpecialist?.name ??
                  (selectedSpecialists.length > 0
                    ? "Primero disponible"
                    : "Sin profesionales activos")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[1rem] border border-[var(--tuodonto-line)] bg-white p-1 shadow-2xl">
              {selectedSpecialists.length > 1 ? (
                <SelectItem value={ANY_TEAM_VALUE} className="min-h-11 px-3 text-[var(--tuodonto-brown)]">
                  Primero disponible
                </SelectItem>
              ) : null}
              {selectedSpecialists.map((member) => (
                <SelectItem key={member.id} value={member.id} className="min-h-11 px-3 text-[var(--tuodonto-brown)]">
                  {member.name} · {member.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span id="appointment-specialist-help" className="block text-xs font-normal leading-4 text-[var(--tuodonto-taupe)]">
            {selectedSpecialist
              ? selectedSpecialist.specialty
              : selectedSpecialists.length > 0
                ? "La clínica asignará el primer profesional disponible."
                : "No hay profesionales activos para este servicio."}
          </span>
          {firstFieldError(fieldErrors, "teamMemberId") ? (
            <span id="appointment-specialist-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "teamMemberId")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Fecha disponible
          <select
            value={fields.date}
            onChange={(event) => {
              setFields((current) => ({
                ...current,
                date: event.target.value,
                time: "",
              }));
              setFieldErrors((current) => ({
                ...current,
                date: undefined,
                time: undefined,
              }));
            }}
            className={cn(fieldClass, "appearance-none")}
            aria-invalid={Boolean(firstFieldError(fieldErrors, "date"))}
            aria-describedby={
              firstFieldError(fieldErrors, "date")
                ? "appointment-date-error appointment-date-help"
                : "appointment-date-help"
            }
            aria-required={availabilityState === "ready"}
            disabled={availabilityState !== "ready"}
          >
            <option value="">Selecciona una fecha</option>
            {availability.map((day) => (
              <option key={day.date} value={day.date}>
                {day.dayName} · {day.date}
              </option>
            ))}
          </select>
          <span id="appointment-date-help" className="block text-xs font-normal leading-4 text-[var(--tuodonto-taupe)]" aria-live="polite">
            {availabilityState === "loading" && "Consultando agenda real…"}
            {availabilityState === "empty" && "No hay horarios publicados; enviaremos tu solicitud para coordinarla."}
            {availabilityState === "error" && `${availabilityError} Puedes enviar la solicitud y te contactaremos.`}
            {availabilityState === "ready" && !fields.date && "Elige una de las fechas con disponibilidad real."}
          </span>
          {firstFieldError(fieldErrors, "date") ? (
            <span id="appointment-date-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "date")}
            </span>
          ) : null}
        </label>
        <fieldset className="min-w-0 space-y-2" disabled={!selectedDay}>
          <legend className="text-sm font-semibold text-[var(--tuodonto-brown)]">Hora disponible</legend>
          <div className="flex min-h-12 flex-wrap gap-2 rounded-[1rem] border border-[var(--tuodonto-line)] bg-white/45 p-1.5">
            {selectedDay ? selectedDay.slots.map((slot) => {
              const selected = fields.time === slot.time && (!slot.teamMemberId || fields.teamMemberId === slot.teamMemberId);
              return (
                <button key={`${slot.time}-${slot.teamMemberId ?? "any"}`} type="button" onClick={() => {
                  setFields((current) => ({
                    ...current,
                    time: slot.time,
                    teamMemberId: slot.teamMemberId ?? current.teamMemberId,
                  }));
                  setFieldErrors((current) => ({
                    ...current,
                    time: undefined,
                    teamMemberId: undefined,
                  }));
                }} className={cn("tuodonto-focus min-h-9 rounded-full px-3 text-xs font-semibold", selected ? "bg-[var(--tuodonto-gold)] text-white" : "bg-white text-[var(--tuodonto-brown)]")} aria-pressed={selected}>
                  {slot.time}{slot.teamMemberName ? ` · ${slot.teamMemberName}` : ""}
                </button>
              );
            }) : <span className="self-center px-2 text-xs text-[var(--tuodonto-muted)]">Selecciona una fecha</span>}
          </div>
          {availabilityState === "ready" && fields.date && !fields.time ? (
            <span className="block text-xs font-normal text-[var(--tuodonto-taupe)]" aria-live="polite">
              Selecciona una hora para completar la reserva.
            </span>
          ) : null}
          {firstFieldError(fieldErrors, "time") ? (
            <span id="appointment-time-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "time")}
            </span>
          ) : null}
        </fieldset>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Nombre completo
          <input
            type="text"
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldClass}
            placeholder="Tu nombre"
            minLength={3}
            maxLength={120}
            aria-invalid={Boolean(firstFieldError(fieldErrors, "name"))}
            aria-describedby={firstFieldError(fieldErrors, "name") ? "appointment-name-error" : undefined}
            required
          />
          {firstFieldError(fieldErrors, "name") ? (
            <span id="appointment-name-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "name")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Teléfono / WhatsApp
          <input
            type="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClass}
            placeholder="321 000 0000"
            minLength={7}
            maxLength={30}
            aria-invalid={Boolean(firstFieldError(fieldErrors, "phone"))}
            aria-describedby={firstFieldError(fieldErrors, "phone") ? "appointment-phone-error" : undefined}
            required
          />
          {firstFieldError(fieldErrors, "phone") ? (
            <span id="appointment-phone-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "phone")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Correo
          <input
            type="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClass}
            placeholder="correo@ejemplo.com"
            maxLength={254}
            aria-invalid={Boolean(firstFieldError(fieldErrors, "email"))}
            aria-describedby={firstFieldError(fieldErrors, "email") ? "appointment-email-error" : undefined}
          />
          {firstFieldError(fieldErrors, "email") ? (
            <span id="appointment-email-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
              {firstFieldError(fieldErrors, "email")}
            </span>
          ) : null}
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
          placeholder="Indica, si quieres, cómo prefieres que te contactemos."
          maxLength={500}
          aria-invalid={Boolean(firstFieldError(fieldErrors, "notes"))}
          aria-describedby={firstFieldError(fieldErrors, "notes") ? "appointment-notes-error" : undefined}
        />
        {firstFieldError(fieldErrors, "notes") ? (
          <span id="appointment-notes-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
            {firstFieldError(fieldErrors, "notes")}
          </span>
        ) : null}
      </label>

      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-[var(--tuodonto-taupe)]">
        <input
          type="checkbox"
          checked={fields.consent}
          onChange={(event) =>
            setFields((current) => ({ ...current, consent: event.target.checked }))
          }
          className="tuodonto-focus mt-1 size-4 shrink-0 accent-[var(--tuodonto-gold)]"
          required
        />
        <span>
          Autorizo que COISalud Láser use estos datos para gestionar mi solicitud y contactarme.
        </span>
      </label>

      {state.status === "error" && (
        <div role="alert" className="mt-4 rounded-[1rem] border border-[rgba(184,82,71,.25)] bg-[rgba(184,82,71,.1)] px-4 py-3 text-sm text-[var(--tuodonto-danger)]">
          <p className="font-semibold">No pudimos enviar la solicitud.</p>
          <p className="mt-1 leading-5">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting" || availabilityState === "loading"}
        className="tuodonto-focus mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full tuodonto-gold-fill px-6 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60 md:w-auto"
      >
        {state.status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {state.status === "submitting"
          ? availabilityState === "ready" ? "Agendando…" : "Enviando…"
          : availabilityState === "ready" ? "Agendar valoración" : "Enviar solicitud"}
      </button>
    </form>
  );
}
