"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { cn } from "@/lib/utils";

type ContactFields = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type ContactState =
  | { status: "idle"; message: string; confirmation?: string }
  | { status: "submitting"; message: string; confirmation?: string }
  | { status: "success"; message: string; confirmation: string }
  | { status: "error"; message: string; confirmation?: string };

const initialFields: ContactFields = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const fieldClass =
  "tuodonto-field min-h-12 w-full px-4 py-3 text-sm text-[var(--tuodonto-ink)] placeholder:text-[var(--tuodonto-muted)] focus:border-[var(--tuodonto-sky-strong)] focus:outline-none focus:ring-4 focus:ring-[rgba(169,220,233,.28)]";

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [state, setState] = useState<ContactState>({
    status: "idle",
    message: "",
  });

  function updateField(field: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting", message: "Enviando mensaje..." });

    const response = await fetch("/api/contact", {
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
          "No pudimos enviar el mensaje. Intenta de nuevo o llama a la clínica.",
      });
      return;
    }

    setState({
      status: "success",
      confirmation: result.confirmation,
      message:
        result.message ??
        "Recibimos tu mensaje. El equipo de COISalud Láser te responderá pronto.",
    });
  }

  if (state.status === "success") {
    return (
      <div className="tuodonto-glass rounded-[2rem] p-6 md:p-8">
        <div className="flex size-14 items-center justify-center rounded-full tuodonto-gold-fill">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <p className="tuodonto-eyebrow mt-6">Mensaje recibido</p>
        <h2 className="tuodonto-display mt-2 text-5xl leading-none text-[var(--tuodonto-brown)]">
          Te contactaremos pronto.
        </h2>
        <p className="mt-5 text-[var(--tuodonto-taupe)]">{state.message}</p>
        <div className="mt-6 rounded-[1.5rem] border border-[var(--tuodonto-line)] bg-white/55 p-5">
          <span className="text-xs font-semibold uppercase text-[var(--tuodonto-gold-deep)]">
            Radicado
          </span>
          <p className="mt-1 text-2xl font-semibold text-[var(--tuodonto-ink)]">
            {state.confirmation}
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
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="tuodonto-glass rounded-[2rem] p-5 md:p-8"
    >
      <p className="tuodonto-eyebrow">Contacto directo</p>
      <h2 className="tuodonto-display mt-2 text-4xl leading-none text-[var(--tuodonto-brown)] md:text-5xl">
        Escríbenos.
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
          Nombre
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
          Teléfono
          <input
            type="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={fieldClass}
            placeholder="321 000 0000"
            required
          />
        </label>
      </div>
      <label className="mt-5 block space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
        Correo
        <input
          type="email"
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={fieldClass}
          placeholder="correo@ejemplo.com"
        />
      </label>
      <label className="mt-5 block space-y-2 text-sm font-semibold text-[var(--tuodonto-brown)]">
        Mensaje
        <textarea
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          className={cn(fieldClass, "min-h-36 resize-none")}
          placeholder="Cuéntanos qué necesitas resolver."
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
        Enviar mensaje
      </button>
    </form>
  );
}
