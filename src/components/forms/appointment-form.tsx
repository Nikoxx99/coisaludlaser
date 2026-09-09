"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ConsultationPayment } from "./consultation-payment";
import { consultationRate, formatCOP } from "@/lib/consultation-payments";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, RefreshCw, Send } from "lucide-react";

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
const steps = ["Servicio", "Fecha y hora", "Tus datos", "Resumen"];

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
  const [step, setStep] = useState(0);
  const [requestWithoutTime, setRequestWithoutTime] = useState(false);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const [teamFilter, setTeamFilter] = useState(initialFields.teamMemberId);
  const [refresh, setRefresh] = useState(0);
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
  const filteredSpecialist = selectedSpecialists.find((member) => member.id === teamFilter);
  const selectedDay = availability.find((day) => day.date === fields.date);

  useEffect(() => {
    if (!fields.service || state.status === "submitting" || state.status === "success") return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      serviceSlug: fields.service,
      days: "30",
    });
    if (teamFilter) {
      params.set("teamMemberId", teamFilter);
    }
    fetch(`/api/availability?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
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
        if (controller.signal.aborted) return;
        const days = (result.days ?? []).filter((day) => day.slots.length > 0);
        setAvailability(days);
        setAvailabilityState(days.length ? "ready" : "empty");
        setAvailabilityError("");
        setFields((current) => {
          const day = days.find((item) => item.date === current.date);
          const valid = day?.slots.some((slot) => slot.time === current.time &&
            (!slot.teamMemberId || slot.teamMemberId === current.teamMemberId));
          return { ...current, date: day ? current.date : "", time: valid ? current.time : "" };
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setFields((current) => ({ ...current, date: "", time: "" }));
        setAvailability([]);
        setAvailabilityState("error");
        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "No pudimos consultar la agenda."
        );
      });
    return () => controller.abort();
  }, [fields.service, teamFilter, refresh, state.status]);

  useEffect(() => {
    stepTitle.current?.focus();
  }, [step]);

  useEffect(() => {
    if (state.status === "success" || state.status === "submitting") return;
    function refreshAgenda() {
      if (document.visibilityState !== "visible") return;
      setAvailabilityState("loading");
      setRefresh((value) => value + 1);
    }
    window.addEventListener("focus", refreshAgenda);
    document.addEventListener("visibilitychange", refreshAgenda);
    const timer = window.setInterval(refreshAgenda, 60_000);
    return () => {
      window.removeEventListener("focus", refreshAgenda);
      document.removeEventListener("visibilitychange", refreshAgenda);
      window.clearInterval(timer);
    };
  }, [state.status]);

  function goToStep(next: number) {
    setState({ status: "idle", message: "" });
    setStep(next);
  }

  function validateSchedule() {
    if (availabilityState === "loading" || availabilityState === "error") return false;
    if (availabilityState === "empty") return true;
    if (fields.date && fields.time && selectedDay?.slots.some((slot) =>
      slot.time === fields.time && (!slot.teamMemberId || slot.teamMemberId === fields.teamMemberId))) return true;
    setFieldErrors({ date: fields.date ? undefined : ["Selecciona una fecha disponible."], time: ["Selecciona una hora disponible."] });
    goToStep(1);
    return false;
  }

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
    if (state.status === "submitting") return;

    if (step < 3) {
      if (step === 0 && (!selectedService || selectedSpecialists.length === 0)) return;
      if (step === 1 && !validateSchedule()) return;
      if (step === 1) setRequestWithoutTime(availabilityState === "empty");
      goToStep(step + 1);
      return;
    }
    if ((availabilityState === "empty" && !requestWithoutTime) || !validateSchedule()) {
      goToStep(1);
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
      // Revalidate the chosen slot immediately before submitting. The API also
      // checks availability transactionally when creating the appointment.
      if (fields.date && fields.time) {
        const params = new URLSearchParams({ serviceSlug: fields.service, date: fields.date });
        if (fields.teamMemberId) params.set("teamMemberId", fields.teamMemberId);
        const check = await fetch(`/api/availability?${params}`, { cache: "no-store" });
        const latest = await check.json();
        if (!check.ok || !latest.ok) throw new Error("No pudimos verificar el horario. Intenta de nuevo.");
        const valid = (latest.days as AvailabilityDay[]).some((day) => day.date === fields.date &&
          day.slots.some((slot) => slot.time === fields.time && (!slot.teamMemberId || slot.teamMemberId === fields.teamMemberId)));
        if (!valid) {
          setFields((current) => ({ ...current, date: "", time: "" }));
          setAvailabilityState("loading");
          setRefresh((value) => value + 1);
          setStep(1);
          setState({ status: "error", message: "Ese horario ya no está disponible. Elige otro para continuar." });
          return;
        }
      }
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
        if (errors.service || errors.teamMemberId) setStep(0);
        else if (errors.date || errors.time) {
          setStep(1);
          setAvailabilityState("loading");
          setRefresh((value) => value + 1);
        } else if (errors.name || errors.phone || errors.email || errors.notes) setStep(2);
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
          "Recibimos tu solicitud. Conserva el código de referencia.",
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
        <ConsultationPayment slug={fields.service} registered scheduled={Boolean(fields.date && fields.time)} />
        <button
          type="button"
          onClick={() => {
            setFields(initialFields);
            setTeamFilter(initialFields.teamMemberId);
            setStep(0);
            setAvailabilityState("loading");
            setRefresh((value) => value + 1);
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
      <div>
        <p className="tuodonto-eyebrow">Agenda tu cita</p>
        <h2 id={titleId} className="tuodonto-display mt-2 text-4xl leading-none text-[var(--tuodonto-brown)] md:text-5xl">
          Un paso más cerca de tu sonrisa.
        </h2>
        <ol aria-label="Pasos para agendar" className="mt-7 grid grid-cols-4 gap-2 border-b border-[var(--tuodonto-line)] pb-6">
          {steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}>
            <button type="button" disabled={index >= step || state.status === "submitting"} onClick={() => goToStep(index)}
              className={cn("tuodonto-focus flex w-full flex-col items-center gap-2 text-center text-xs sm:text-sm", index > step ? "text-[var(--tuodonto-muted)]" : "text-[var(--tuodonto-brown)]")}>
              <span className={cn("flex size-9 items-center justify-center rounded-full border text-sm font-semibold", index <= step ? "border-[var(--tuodonto-gold)] bg-[var(--tuodonto-gold)] text-white" : "border-[var(--tuodonto-line)] bg-white")}>
                {index < step ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>{label}
            </button>
          </li>)}
        </ol>
        <h3 ref={stepTitle} tabIndex={-1} className="mt-6 scroll-mt-36 text-xl font-semibold text-[var(--tuodonto-brown)] outline-none">
          {step === 0 ? "¿Qué servicio necesitas?" : step === 1 ? "Elige fecha y hora" : step === 2 ? "Cuéntanos cómo contactarte" : "Revisa tu solicitud"}
        </h3>
        <p className="mt-2 text-sm text-[var(--tuodonto-taupe)]">
          {step === 0 ? "Elige el servicio y quién puede atenderte." : step === 1 ? "Estos horarios se consultan directamente en nuestra agenda." : step === 2 ? "Usaremos estos datos para gestionar tu cita." : "Confirma los datos antes de enviar."}
        </p>
      </div>
      <div className="mt-5 grid gap-x-4 gap-y-5 md:grid-cols-2">
        {step === 0 && <>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Servicio
          <Select
            value={fields.service}
            onValueChange={(value) => {
              const service = services.find((item) => item.slug === value);
              const professionals = professionalsForService(service, teamMembers);
              setTeamFilter(professionals.length === 1 ? professionals[0].id : "");
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
            value={teamFilter || ANY_TEAM_VALUE}
            disabled={selectedSpecialists.length === 0}
            onValueChange={(value) => {
              const teamMemberId =
                value === ANY_TEAM_VALUE ? "" : value ?? "";
              setTeamFilter(teamMemberId);
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
                {filteredSpecialist?.name ??
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
            {filteredSpecialist
              ? filteredSpecialist.specialty
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
        </>}
        {step === 1 && (availabilityState === "ready" || availabilityState === "loading") && <>
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
        </>}
        {step === 2 && <>
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
        </>}
      </div>

      {step === 2 && <label className="mt-3.5 block space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
        Comentario
        <textarea
          value={fields.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className={cn(fieldClass, "min-h-20 resize-y")}
          placeholder="Indica cómo prefieres que te contactemos. Evita incluir información clínica sensible."
          maxLength={500}
          aria-invalid={Boolean(firstFieldError(fieldErrors, "notes"))}
          aria-describedby={firstFieldError(fieldErrors, "notes") ? "appointment-notes-error" : undefined}
        />
        {firstFieldError(fieldErrors, "notes") ? (
          <span id="appointment-notes-error" className="block text-xs font-normal text-[var(--tuodonto-danger)]">
            {firstFieldError(fieldErrors, "notes")}
          </span>
        ) : null}
      </label>}

      {step === 3 && <>
      <dl className="mt-5 divide-y divide-[var(--tuodonto-line)] rounded-2xl border border-[var(--tuodonto-line)] bg-white/60 px-5">
        {[
          ["Servicio", selectedService?.name],
          ["Profesional", selectedSpecialist?.name || "Primero disponible"],
          ["Fecha y hora", fields.date && fields.time ? `${selectedDay?.dayName ?? ""} ${fields.date} · ${fields.time}` : "Sin horario reservado · Por coordinar"],
          ["Nombre", fields.name], ["Teléfono", fields.phone], ["Correo", fields.email],
        ].filter(([, value]) => value).map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="text-sm text-[var(--tuodonto-taupe)]">{label}</dt><dd className="break-words text-sm font-semibold text-[var(--tuodonto-brown)]">{value}</dd>
        </div>)}
      </dl>
      {consultationRate(fields.service) ? <ConsultationPayment slug={fields.service} /> : <div className="mt-4 rounded-2xl bg-[var(--tuodonto-pearl)] p-5">
        <p className="text-sm text-[var(--tuodonto-taupe)]">Valor del servicio</p>
        <p className="mt-2 text-2xl font-semibold text-[var(--tuodonto-brown)]">{selectedService?.priceFrom != null ? `Desde ${formatCOP(selectedService.priceFrom)} COP` : "Por confirmar con el equipo"}</p>
      </div>}
      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-[var(--tuodonto-taupe)]">
        <input
          type="checkbox"
          disabled={state.status === "submitting"}
          checked={fields.consent}
          onChange={(event) =>
            setFields((current) => ({ ...current, consent: event.target.checked }))
          }
          className="tuodonto-focus mt-1 size-4 shrink-0 accent-[var(--tuodonto-gold)]"
          required
        />
        <span>
          Autorizo que COISalud Láser use estos datos para gestionar mi solicitud y contactarme, según la <Link href="/politica-de-datos" target="_blank" className="underline underline-offset-4">política de tratamiento de datos personales</Link>.
        </span>
      </label>

      </>}

      {step === 1 && (availabilityState === "empty" || availabilityState === "error") && <div role="status" className="mt-4 rounded-2xl bg-[var(--tuodonto-pearl)] p-5 text-sm leading-6">
        <p>{availabilityState === "empty" ? "No hay horarios publicados para este servicio y profesional en los próximos 30 días. Puedes solicitar que coordinemos tu cita, sin reservar una fecha." : availabilityError}</p>
        <button type="button" onClick={() => { setState({ status: "idle", message: "" }); setAvailabilityState("loading"); setRefresh((value) => value + 1); }} className="tuodonto-focus mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4"><RefreshCw className="size-4" aria-hidden="true" />Volver a consultar</button>
      </div>}

      {state.status === "error" && (
        <div role="alert" className="mt-4 rounded-[1rem] border border-[rgba(184,82,71,.25)] bg-[rgba(184,82,71,.1)] px-4 py-3 text-sm text-[var(--tuodonto-danger)]">
          <p className="font-semibold">Revisa tu solicitud.</p>
          <p className="mt-1 leading-5">{state.message}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--tuodonto-line)] pt-5 sm:flex-row sm:justify-between">
        {step > 0 ? <button type="button" disabled={state.status === "submitting"} onClick={() => goToStep(step - 1)} className="tuodonto-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--tuodonto-line)] px-6 text-sm font-semibold"><ArrowLeft className="size-4" aria-hidden="true" />Atrás</button> : <span />}
        <button type="submit" disabled={state.status === "submitting" || (step === 0 && (!selectedService || selectedSpecialists.length === 0)) || ((step === 1 || step === 3) && (availabilityState === "loading" || availabilityState === "error"))}
          className="tuodonto-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full tuodonto-gold-fill px-6 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60">
          {state.status === "submitting" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : step === 3 ? <Send className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
          {state.status === "submitting" ? "Enviando…" : step === 3 ? fields.date && fields.time ? "Confirmar cita" : "Enviar solicitud sin horario" : step === 1 && availabilityState === "empty" ? "Solicitar contacto sin horario" : step === 2 ? "Revisar solicitud" : "Continuar"}
        </button>
      </div>
    </form>
  );
}
