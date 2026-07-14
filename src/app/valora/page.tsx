import type { Metadata } from "next";
import { Star } from "lucide-react";

import { ReviewForm } from "@/components/forms/review-form";
import { Reveal } from "@/components/public/motion";
import { PublicShell } from "@/components/public/public-shell";
import { RouteHero } from "@/components/public/route-hero";
import {
  getApprovedReviews,
  getBrandImages,
  getNavigationSettings,
  getServices,
  getSiteSettings,
} from "@/lib/repository";

export const metadata: Metadata = {
  title: "Valora tu experiencia",
  description: "Cuéntanos cómo fue tu experiencia durante la visita a la clínica.",
};

export const dynamic = "force-dynamic";

export default async function ValoraPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const [{ origen }, services, settings, reviews, brandImages, navigation] = await Promise.all([
    searchParams,
    getServices(),
    getSiteSettings(),
    getApprovedReviews(3),
    getBrandImages(),
    getNavigationSettings(),
  ]);
  const source = origen === "qr" ? "qr" : "web";

  return (
    <PublicShell active="valora" settings={settings}>
      <RouteHero
        eyebrow="Tu experiencia"
        title="Tu opinión nos ayuda a cuidar mejor cada cita."
        copy={`Cuéntanos si te sentiste escuchado, informado y acompañado durante tu visita a ${settings.brandName}.`}
        image={brandImages.reviewsHero.src}
        imageAlt={brandImages.reviewsHero.alt}
        imageFit={brandImages.reviewsHero.fit}
        ctaHref="#valoracion"
        ctaLabel="Dejar mi valoración"
        showContact={navigation.public.contacto}
      />
      <section className="tuodonto-section px-[var(--space-page-x)]">
        <div id="valoracion" className="mx-auto grid max-w-7xl scroll-mt-32 gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <Reveal>
            <p className="tuodonto-eyebrow">Valora tu experiencia</p>
            <h1 className="tuodonto-display mt-4 max-w-2xl text-6xl leading-[.9] text-[var(--tuodonto-brown)] md:text-7xl">
              Tu experiencia también forma parte del cuidado.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--tuodonto-taupe)] md:text-base">
              Un minuto basta: califica tu visita y cuéntanos cómo te sentiste.
            </p>
            <div className="mt-10">
              <ReviewForm services={services} source={source} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4 lg:sticky lg:top-10">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="rounded-[1.7rem] border border-white/70 bg-white/58 p-5 shadow-[0_24px_70px_rgba(70,53,42,.07)]"
              >
                <div
                  className="flex items-center gap-1"
                  aria-label={`${review.rating} de 5 estrellas`}
                >
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star
                      key={star}
                      aria-hidden="true"
                      className={
                        star < review.rating
                          ? "size-4 fill-[var(--tuodonto-gold)] text-[var(--tuodonto-gold)]"
                          : "size-4 text-[var(--tuodonto-line)]"
                      }
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-7 text-[var(--tuodonto-taupe)]">
                  “{review.comment}”
                </blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-[var(--tuodonto-brown)]">
                  {review.name}
                </figcaption>
              </figure>
            ))}
            <div className="rounded-[1.7rem] bg-[var(--tuodonto-brown)] p-6 text-white">
              <p className="text-sm leading-7 text-white/80">
                Tu comentario se publica después de una revisión corta del
                equipo. Gracias por ayudarnos a cuidar más sonrisas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}
