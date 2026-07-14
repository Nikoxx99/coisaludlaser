import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Quote, ShieldCheck, Sparkles, Users } from "lucide-react";

import { PublicLinkButton } from "@/components/public/link-button";
import { Reveal } from "@/components/public/motion";
import { PublicShell } from "@/components/public/public-shell";
import { RouteHero } from "@/components/public/route-hero";
import { SectionHeading } from "@/components/public/section-heading";
import {
  getBrandImages,
  getLandingCopy,
  getNavigationSettings,
  getServices,
  getSiteSettings,
  getTeamMembers,
} from "@/lib/repository";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce al equipo, la experiencia y el enfoque de atención de la clínica.",
};

export const dynamic = "force-dynamic";

export default async function NosotrosPage() {
  const [team, services, settings, landing, brandImages, navigation] = await Promise.all([
    getTeamMembers(),
    getServices(),
    getSiteSettings(),
    getLandingCopy(),
    getBrandImages(),
    getNavigationSettings(),
  ]);
  const lead = team[0];

  return (
    <PublicShell active="nosotros" settings={settings}>
      <RouteHero
        eyebrow="Nosotros"
        title={settings.heroHeadline}
        copy={settings.heroSubcopy}
        image={brandImages.aboutHero.src}
        imageAlt={brandImages.aboutHero.alt}
        imageFit={brandImages.aboutHero.fit}
        ctaLabel="Conocer servicios"
        ctaHref="/servicios"
        showPrimary={navigation.public.servicios}
        showContact={navigation.public.contacto}
      />

      <section className="tuodonto-section px-[var(--space-page-x)]">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={lead?.name ?? "Nuestro equipo"}
              title={lead ? `${lead.name} · ${lead.specialty}` : "Equipo por configurar"}
              copy={
                lead?.bio ||
                `Conoce a los profesionales de ${settings.brandName} y el enfoque con el que acompañan cada tratamiento.`
              }
            />
          </Reveal>
          <Reveal delay={0.1} className="relative min-h-[34rem] overflow-hidden rounded-[2.4rem]">
            <Image
              src={brandImages.aboutStory.src}
              alt={brandImages.aboutStory.alt}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              style={{ objectFit: brandImages.aboutStory.fit }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(70,53,42,.58),transparent_62%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-9">
              <Quote className="size-8 text-[var(--tuodonto-gold-light)]" />
              <p className="tuodonto-display mt-4 max-w-xl text-4xl leading-none">
                {landing.method.title}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[var(--tuodonto-line)] bg-[var(--tuodonto-pearl)] px-[var(--space-page-x)] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <p className="tuodonto-eyebrow">{landing.method.eyebrow}</p>
            <h2 className="tuodonto-display mt-3 text-5xl leading-none text-[var(--tuodonto-brown)] md:text-6xl">
              {landing.method.title}
            </h2>
          </Reveal>
          <div className="divide-y divide-[var(--tuodonto-line)] border-y border-[var(--tuodonto-line)]">
            {landing.method.steps.map((item, index) => (
              <Reveal key={item} delay={index * 0.06}>
                <div className="grid gap-4 py-7 md:grid-cols-[6rem_1fr] md:items-center">
                  <span className="tuodonto-display text-5xl text-[var(--tuodonto-gold)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--tuodonto-taupe)]">
                      {item}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="tuodonto-section px-[var(--space-page-x)]">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Profesional"
              title="Una relación clínica basada en escucha, precisión y confianza."
              copy="La información del equipo es administrable y se refleja aquí desde el panel del consultorio."
            />
          </Reveal>

          <div className="mt-12 border-y border-[var(--tuodonto-line)]">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.05}>
                <div className="grid gap-6 border-b border-[var(--tuodonto-line)] py-8 last:border-b-0 lg:grid-cols-[10rem_1fr_.8fr] lg:items-center">
                  <span className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--tuodonto-line)] bg-[var(--tuodonto-mist)] lg:size-28">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="tuodonto-display text-4xl text-[rgba(3,80,225,.7)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase text-[var(--tuodonto-gold-deep)]">
                      {member.specialty}
                    </p>
                    <h3 className="tuodonto-display mt-2 text-5xl leading-none text-[var(--tuodonto-brown)]">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-[var(--tuodonto-taupe)]">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[var(--space-page-x)] pb-20">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {services.slice(0, 3).map((service, index) => {
            const Icon = [Sparkles, ShieldCheck, BadgeCheck][index] ?? Sparkles;
            return (
              <Reveal key={service.id}>
                <div className="min-h-56 rounded-[2rem] bg-white/58 p-6 shadow-[0_24px_70px_rgba(70,53,42,.07)]">
                  <Icon className="size-8 text-[var(--tuodonto-gold)]" />
                  <h3 className="tuodonto-display mt-8 text-4xl leading-none text-[var(--tuodonto-brown)]">
                    {service.name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--tuodonto-taupe)]">
                    {service.summary}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="px-[var(--space-page-x)] pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2.4rem] bg-[var(--tuodonto-brown)] p-7 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <Users className="size-8 text-[var(--tuodonto-gold-light)]" />
            <h2 className="tuodonto-display mt-4 text-5xl leading-none">
              Conoce tu plan en una valoración.
            </h2>
          </div>
          {navigation.public.citas ? (
            <PublicLinkButton href="/citas">Agendar cita</PublicLinkButton>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
