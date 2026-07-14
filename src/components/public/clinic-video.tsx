"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Tarjeta "Conoce nuestra clínica". Cuando hay un video configurado (admin →
 * Identidad de marca → Landing → Clínica), toda la tarjeta y el botón de play
 * abren un modal con el video. Sin video, queda como tarjeta estática.
 */

type EmbedKind = "iframe" | "video" | "none";

function resolveEmbed(rawUrl: string): { kind: EmbedKind; src: string } {
  const url = rawUrl.trim();
  if (!url) return { kind: "none", src: "" };

  // Archivos de video directos.
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { kind: "video", src: url };
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    // YouTube (watch, youtu.be, shorts, embed)
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.searchParams.get("v") ??
        parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }

    // Vimeo
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }
    if (host === "player.vimeo.com") {
      return { kind: "iframe", src: url };
    }

    // Cualquier otra URL embebible (Drive, etc.): se intenta como iframe.
    return { kind: "iframe", src: url };
  } catch {
    return { kind: "none", src: "" };
  }
}

export function ClinicVideo({
  eyebrow,
  copy,
  videoUrl,
}: {
  eyebrow: string;
  copy: string;
  videoUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const { kind, src } = resolveEmbed(videoUrl ?? "");
  const hasVideo = kind !== "none";

  const inner = (
    <>
      <span
        className={
          "flex size-20 items-center justify-center rounded-full bg-white/70 text-[var(--tuodonto-gold)] shadow-[0_18px_45px_rgba(70,53,42,.08)] transition" +
          (hasVideo ? " group-hover:scale-105 group-hover:bg-white" : "")
        }
      >
        <Play className="ml-1 size-8" aria-hidden="true" />
      </span>
      <span className="block">
        <span className="tuodonto-eyebrow block">{eyebrow}</span>
        <span className="mt-4 block max-w-xs text-sm leading-7 text-[var(--tuodonto-taupe)]">
          {copy}
        </span>
        {hasVideo ? (
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--tuodonto-gold-deep)]">
            Ver video
            <Play className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>
    </>
  );

  if (!hasVideo) {
    return (
      <div className="flex flex-col justify-between bg-[var(--tuodonto-pearl)] p-[var(--space-page-x)]">
        {inner}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Reproducir el video de la clínica"
        className="tuodonto-focus group flex flex-col justify-between gap-10 bg-[var(--tuodonto-pearl)] p-[var(--space-page-x)] text-left transition hover:bg-[var(--tuodonto-mist)]"
      >
        {inner}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl bg-black p-0 ring-1 ring-white/10 sm:max-w-3xl">
          <DialogTitle className="sr-only">Video de la clínica</DialogTitle>
          <div className="relative aspect-video w-full bg-black">
            {kind === "video" ? (
              <video
                src={src}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              />
            ) : (
              <iframe
                src={src}
                title="Video de la clínica"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
