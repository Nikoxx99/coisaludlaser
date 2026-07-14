import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarCheck,
  Camera,
  Clock,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PublicLinkButton } from "@/components/public/link-button";
import { Reveal } from "@/components/public/motion";
import { PublicShell } from "@/components/public/public-shell";
import { RouteHero } from "@/components/public/route-hero";
import { formatWeeklyHours } from "@/lib/business-hours";
import {
  getAvailabilitySlots,
  getBrandImages,
  getNavigationSettings,
  getSiteSettings,
} from "@/lib/repository";
import {
  doctoraliaUrl,
  facebookUrl,
  googleBusinessUrl,
  instagramUrl,
  tiktokUrl,
} from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Consulta los canales de contacto, ubicación y horarios de la clínica.",
};

export const dynamic = "force-dynamic";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function socialDisplay(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/$/, "");
}

export default async function ContactoPage() {
  const [settings, brandImages, availabilitySlots, navigation] = await Promise.all([
    getSiteSettings(),
    getBrandImages(),
    getAvailabilitySlots(),
    getNavigationSettings(),
  ]);
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hola ${settings.brandName}, quiero información.`)}`;
  const businessHours = formatWeeklyHours(availabilitySlots);
  const socialLinks = [
    {
      key: "googleBusiness",
      label: "Perfil y valoraciones en Google",
      value: settings.googleBusiness,
      href: googleBusinessUrl(settings.googleBusiness),
      icon: MapPinned,
    },
    {
      key: "instagram",
      label: "Instagram",
      value: settings.instagram,
      href: instagramUrl(settings.instagram),
      icon: Camera,
    },
    {
      key: "tiktok",
      label: "TikTok",
      value: settings.tiktok,
      href: tiktokUrl(settings.tiktok),
      icon: TikTokIcon,
    },
    {
      key: "facebook",
      label: "Facebook",
      value: settings.facebook,
      href: facebookUrl(settings.facebook),
      icon: FacebookIcon,
    },
    {
      key: "doctoralia",
      label: "Doctoralia",
      value: settings.doctoralia,
      href: doctoraliaUrl(settings.doctoralia),
      icon: CalendarCheck,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <PublicShell active="contacto" settings={settings}>
      <RouteHero
        eyebrow="Contacto"
        title={settings.city ? `Estamos en ${settings.city}.` : "Estamos cerca para atenderte."}
        copy={`Visítanos${settings.address ? ` en ${settings.address}` : ""}, llámanos o deja un mensaje para que el equipo de ${settings.brandName} te responda.`}
        image={brandImages.contactHero.src}
        imageAlt={brandImages.contactHero.alt}
        imageFit={brandImages.contactHero.fit}
        ctaHref="#mensaje"
        ctaLabel="Enviar mensaje"
        showContact={false}
      />

      <section id="mensaje" className="tuodonto-section px-[var(--space-page-x)]">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem]">
              <Image
                src={brandImages.contactLocation.src}
                alt={brandImages.contactLocation.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                style={{ objectFit: brandImages.contactLocation.fit }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(70,53,42,.55),transparent_65%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="tuodonto-eyebrow text-[var(--tuodonto-gold-light)]">
                  {settings.city}
                </p>
                <h2 className="tuodonto-display mt-3 text-5xl leading-none">
                  {settings.address}
                </h2>
              </div>
            </div>

            <div className="grid gap-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.address} ${settings.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="tuodonto-focus flex items-center justify-between gap-4 rounded-[1.5rem] bg-white/62 p-5 shadow-[0_18px_50px_rgba(70,53,42,.07)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <span className="flex items-center gap-3">
                  <MapPin className="size-5 text-[var(--tuodonto-gold)]" />
                  <span>
                    <strong className="block text-[var(--tuodonto-brown)]">
                      Dirección
                    </strong>
                    <span className="text-sm text-[var(--tuodonto-taupe)]">
                      {settings.address}
                    </span>
                  </span>
                </span>
                <Navigation className="size-5 text-[var(--tuodonto-gold)]" />
              </a>
              <a
                href={`tel:${settings.phone.replaceAll(" ", "")}`}
                className="tuodonto-focus flex items-center gap-3 rounded-[1.5rem] bg-white/62 p-5 shadow-[0_18px_50px_rgba(70,53,42,.07)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Phone className="size-5 text-[var(--tuodonto-gold)]" />
                <span>
                  <strong className="block text-[var(--tuodonto-brown)]">
                    Teléfono
                  </strong>
                  <span className="text-sm text-[var(--tuodonto-taupe)]">
                    {settings.phone}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="tuodonto-focus flex items-center gap-3 rounded-[1.5rem] bg-white/62 p-5 shadow-[0_18px_50px_rgba(70,53,42,.07)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Mail className="size-5 text-[var(--tuodonto-gold)]" />
                <span>
                  <strong className="block text-[var(--tuodonto-brown)]">
                    Email
                  </strong>
                  <span className="text-sm text-[var(--tuodonto-taupe)]">
                    {settings.email}
                  </span>
                </span>
              </a>
              {businessHours.length > 0 ? (
                <div className="flex items-start gap-3 rounded-[1.5rem] bg-white/62 p-5 shadow-[0_18px_50px_rgba(70,53,42,.07)]">
                  <Clock className="mt-0.5 size-5 shrink-0 text-[var(--tuodonto-gold)]" />
                  <span>
                    <strong className="block text-[var(--tuodonto-brown)]">
                      Horario de atención
                    </strong>
                    {businessHours.map((line) => (
                      <span
                        key={line.days}
                        className="block text-sm text-[var(--tuodonto-taupe)]"
                      >
                        {line.days}: {line.hours}
                      </span>
                    ))}
                  </span>
                </div>
              ) : null}
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.href ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="tuodonto-focus flex items-center gap-3 rounded-[1.5rem] bg-white/62 p-5 shadow-[0_18px_50px_rgba(70,53,42,.07)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <item.icon className="size-5 text-[var(--tuodonto-gold)]" />
                  <span>
                    <strong className="block text-[var(--tuodonto-brown)]">
                      {item.label}
                    </strong>
                    <span className="text-sm text-[var(--tuodonto-taupe)]">
                      {socialDisplay(item.value)}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <PublicLinkButton
                href={whatsappHref}
                external
                variant="gold"
                icon="whatsapp"
              >
                WhatsApp
              </PublicLinkButton>
              {navigation.public.citas ? (
                <PublicLinkButton href="/citas" variant="sky">
                  Agendar cita
                </PublicLinkButton>
              ) : null}
            </div>

            <div className="rounded-[2rem] bg-[var(--tuodonto-brown)] p-6 text-white">
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="size-5 text-[var(--tuodonto-gold-light)]" />
                <span>Respondemos solicitudes de citas e información del consultorio.</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  );
}
