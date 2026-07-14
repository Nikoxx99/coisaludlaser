"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send, Star } from "lucide-react";

import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "tuodonto-field min-h-12 w-full px-4 py-3 text-sm text-[var(--tuodonto-ink)] placeholder:text-[var(--tuodonto-muted)] focus:border-[var(--tuodonto-sky-strong)] focus:outline-none focus:ring-4 focus:ring-[rgba(169,220,233,.28)]";

const ratingLabels: Record<number, string> = {
  1: "Podemos mejorar",
  2: "Regular",
  3: "Buena",
  4: "Muy buena",
  5: "Excelente",
};

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

/**
 * Flujo "Valora tu experiencia": calificacion con estrellas grandes, comentario
 * y servicio opcional. Pensado para abrirse tambien desde el QR impreso en la
 * clinica (?origen=qr) y registrar la fuente.
 */
export function ReviewForm({
  services,
  source = "web",
}: {
  services: Service[];
  source?: "web" | "qr";
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  const activeRating = hovered || rating;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setState({
        status: "error",
        message: "Selecciona cuántas estrellas merece tu experiencia.",
      });
      return;
    }

    setState({ status: "submitting" });

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment, serviceSlug, source }),
    });
    const result = (await response.json()) as { ok?: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setState({
        status: "error",
        message: result.message ?? "No pudimos guardar tu valoración.",
      });
      return;
    }

    setState({
      status: "success",
      message:
        result.message ??
        "Gracias por valorar tu experiencia. Tu comentario será revisado por el equipo.",
    });
  }

  if (state.status === "success") {
    return (
      <div className="tuodonto-glass rounded-[2rem] p-6 text-center md:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full tuodonto-gold-fill">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>
        <div
          className="mt-6 flex items-center justify-center gap-1"
          aria-label={`${rating} de 5 estrellas`}
        >
          {Array.from({ length: rating }, (_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className="size-6 fill-[var(--tuodonto-gold)] text-[var(--tuodonto-gold)]"
            />
          ))}
        </div>
        <h2 className="tuodonto-display mt-4 text-5xl leading-none text-[var(--tuodonto-brown)]">
          Gracias por tu sonrisa.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--tuodonto-taupe)]">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="tuodonto-glass rounded-[2rem] p-6 md:p-10">
      <fieldset>
        <legend className="tuodonto-display text-4xl leading-none text-[var(--tuodonto-brown)] md:text-5xl">
          ¿Cómo fue tu experiencia?
        </legend>
        <div
          className="mt-6 flex items-center gap-2"
          onMouseLeave={() => setHovered(0)}
          role="radiogroup"
          aria-label="Calificación de 1 a 5 estrellas"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} estrellas`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onFocus={() => setHovered(value)}
              onBlur={() => setHovered(0)}
              className="tuodonto-focus rounded-full p-1 transition hover:-translate-y-1"
            >
              <Star
                aria-hidden="true"
                className={cn(
                  "size-11 transition-colors md:size-14",
                  value <= activeRating
                    ? "fill-[var(--tuodonto-gold)] text-[var(--tuodonto-gold)]"
                    : "text-[var(--tuodonto-line)]"
                )}
              />
            </button>
          ))}
        </div>
        <p
          className="mt-3 min-h-6 text-sm font-semibold text-[var(--tuodonto-gold-deep)]"
          aria-live="polite"
        >
          {activeRating ? ratingLabels[activeRating] : ""}
        </p>
      </fieldset>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Tu nombre
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            placeholder="Cómo quieres aparecer"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Servicio (opcional)
          <select
            value={serviceSlug}
            onChange={(event) => setServiceSlug(event.target.value)}
            className={cn(fieldClass, "appearance-none")}
          >
            <option value="">Prefiero no decir</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
        Cuéntanos cómo te fue
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className={cn(fieldClass, "min-h-32 resize-none")}
          placeholder="Lo que más te gustó, cómo te sentiste, qué mejorarías..."
          required
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
        className="tuodonto-focus mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full tuodonto-gold-fill px-6 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60 md:w-auto"
      >
        {state.status === "submitting" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        Enviar valoración
      </button>
    </form>
  );
}
