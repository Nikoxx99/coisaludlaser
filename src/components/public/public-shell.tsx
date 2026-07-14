import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  Camera,
  CalendarCheck,
  MapPinned,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { getNavigationSettings } from "@/lib/repository";
import { NEUTRAL_NAVIGATION_SETTINGS } from "@/lib/neutral-tenant-settings";
import {
  doctoraliaUrl,
  facebookUrl,
  googleBusinessUrl,
  instagramUrl,
  tiktokUrl,
} from "@/lib/social-links";
import type { NavigationSettings, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

type PublicRoute =
  | "inicio"
  | "nosotros"
  | "servicios"
  | "citas"
  | "contacto"
  | "valora";

type NavKey = PublicRoute | "tienda";

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "inicio", label: "Inicio", href: "/" },
  { key: "nosotros", label: "Nosotros", href: "/nosotros" },
  { key: "servicios", label: "Servicios", href: "/servicios" },
  { key: "tienda", label: "Tienda", href: "/tienda" },
  { key: "citas", label: "Citas", href: "/citas" },
  { key: "valora", label: "Valora tu experiencia", href: "/valora" },
  { key: "contacto", label: "Contacto", href: "/contacto" },
];

// Lucide retiró los iconos de marca; SVG propios minimal para TikTok/Facebook.
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

function visibleNavItems(navigation: NavigationSettings) {
  return navItems.filter((item) =>
    item.key === "inicio" ? true : navigation.public[item.key]
  );
}

function LogoLockup({
  compact = false,
  settings,
}: {
  compact?: boolean;
  settings: SiteSettings;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "tuodonto-focus flex items-center gap-3 text-[var(--tuodonto-brown)]",
        compact ? "flex-row" : "flex-col text-center"
      )}
      aria-label={`Ir al inicio de ${settings.brandName}`}
    >
      <Image
        src={settings.logoUrl}
        alt={settings.brandName}
        width={92}
        height={78}
        loading="eager"
        className={cn(
          "object-contain",
          compact ? "h-11 w-12" : "h-20 w-20"
        )}
      />
      <span
        className={cn(
          "tuodonto-display leading-none",
          compact ? "text-xl" : "text-2xl"
        )}
      >
        {settings.brandName}
      </span>
    </Link>
  );
}

function PublicNavLinks({
  active,
  navigation,
  mobile = false,
}: {
  active: PublicRoute;
  navigation: NavigationSettings;
  mobile?: boolean;
}) {
  return (
    <nav
      aria-label="Navegación pública"
      className={cn(
        mobile
          ? "flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "relative flex flex-col gap-3 py-5 pl-5"
      )}
    >
      {!mobile && (
        <span
          aria-hidden="true"
          className="absolute left-1 top-3 h-[calc(100%-1.5rem)] w-px bg-[var(--tuodonto-line)]"
        />
      )}
      {visibleNavItems(navigation).map((item) => {
        const isActive = item.key === active;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "tuodonto-focus relative text-xs font-semibold uppercase text-[var(--tuodonto-brown)] transition-colors",
              mobile
                ? "shrink-0 rounded-full px-3 py-2"
                : "rounded-full px-4 py-2.5",
              isActive
                ? "bg-[rgba(3,210,246,.14)] text-[var(--tuodonto-ink)]"
                : "hover:text-[var(--tuodonto-gold-deep)]"
            )}
          >
            {!mobile && isActive && (
              <span
                aria-hidden="true"
                className="absolute -left-[1.4rem] top-1/2 size-2 -translate-y-1/2 rounded-full bg-[var(--tuodonto-gold)] shadow-[0_0_0_7px_rgba(3,80,225,.12)]"
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SocialButtons({
  settings,
  className,
}: {
  settings: SiteSettings;
  className?: string;
}) {
  const links = [
    {
      key: "googleBusiness",
      label: "Perfil de Google",
      href: googleBusinessUrl(settings.googleBusiness),
      icon: MapPinned,
    },
    {
      key: "instagram",
      label: "Instagram",
      href: instagramUrl(settings.instagram),
      icon: Camera,
    },
    {
      key: "tiktok",
      label: "TikTok",
      href: tiktokUrl(settings.tiktok),
      icon: TikTokIcon,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: facebookUrl(settings.facebook),
      icon: FacebookIcon,
    },
    {
      key: "doctoralia",
      label: "Doctoralia",
      href: doctoraliaUrl(settings.doctoralia),
      icon: CalendarCheck,
    },
  ].filter((item) => Boolean(item.href));

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((item) => (
        <a
          key={item.key}
          href={item.href ?? "#"}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="tuodonto-focus inline-flex size-10 items-center justify-center rounded-full border border-[var(--tuodonto-line)] bg-white/65 text-[var(--tuodonto-brown)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--tuodonto-gold-deep)]"
        >
          <item.icon className="size-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function ContactStack({ settings }: { settings: SiteSettings }) {
  return (
    <div className="space-y-3 text-[0.72rem] text-[var(--tuodonto-brown)]">
      <a
        className="tuodonto-focus flex items-center gap-3 rounded-full py-1"
        href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.address} ${settings.city}`)}`}
        target="_blank"
        rel="noreferrer"
      >
        <MapPin className="size-4 text-[var(--tuodonto-gold)]" aria-hidden="true" />
        <span>
          {settings.city}
        </span>
      </a>
      <a
        className="tuodonto-focus flex items-center gap-3 rounded-full py-1"
        href={`tel:${settings.phone.replaceAll(" ", "")}`}
      >
        <Phone className="size-4 text-[var(--tuodonto-gold)]" aria-hidden="true" />
        <span>{settings.phone}</span>
      </a>
      <a
        className="tuodonto-focus flex items-center gap-3 rounded-full py-1"
        href={instagramUrl(settings.instagram) ?? "#"}
        target="_blank"
        rel="noreferrer"
      >
        <Camera className="size-4 text-[var(--tuodonto-gold)]" aria-hidden="true" />
        <span>{settings.instagram}</span>
      </a>
      <SocialButtons settings={settings} className="pt-1" />
    </div>
  );
}

export async function PublicShell({
  active,
  children,
  settings,
  footerCopy,
}: {
  active: PublicRoute;
  children: React.ReactNode;
  settings: SiteSettings;
  footerCopy?: {
    eyebrow: string;
    title: string;
  };
}) {
  // La visibilidad de items se configura en el panel (Configuracion -> Sidebar).
  const navigation = await getNavigationSettings().catch(
    () => NEUTRAL_NAVIGATION_SETTINGS
  );
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hola ${settings.brandName}, quiero agendar una valoración.`)}`;

  return (
    <div className="tuodonto-page-shell min-h-svh bg-[var(--tuodonto-ivory)] text-[var(--tuodonto-ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-width)] flex-col justify-between gap-7 overflow-y-auto border-r border-[var(--tuodonto-line)] bg-[rgba(247,246,243,.9)] px-7 py-6 backdrop-blur-2xl lg:flex">
        <div className="space-y-6">
          <LogoLockup settings={settings} />
          <PublicNavLinks active={active} navigation={navigation} />
        </div>
        <ContactStack settings={settings} />
      </aside>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/60 bg-[rgba(247,246,243,.9)] px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <LogoLockup compact settings={settings} />
          <a
            className="tuodonto-focus inline-flex size-11 items-center justify-center rounded-full tuodonto-gold-fill"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir por WhatsApp"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-2">
          <PublicNavLinks active={active} navigation={navigation} mobile />
        </div>
      </header>

      <main className="pb-24 pt-[7.75rem] lg:pl-[var(--rail-width)] lg:pt-0">
        {children}
        <footer className="border-t border-[var(--tuodonto-line)] bg-[rgba(255,255,255,.58)] px-[var(--space-page-x)] py-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="tuodonto-eyebrow">
                  {footerCopy?.eyebrow ?? settings.brandName}
                </p>
                <p className="tuodonto-display mt-3 max-w-xl text-4xl text-[var(--tuodonto-brown)]">
                  {footerCopy?.title ??
                    "Salud, estética y bienestar para tu sonrisa."}
                </p>
                <SocialButtons settings={settings} className="mt-5" />
              </div>
            </div>
            {/* Fila de contacto a todo el ancho: el correo respira en su propia
                columna en vez de apretarse junto al titulo. */}
            <div className="mt-9 grid gap-x-10 gap-y-5 border-t border-[var(--tuodonto-line)] pt-7 text-sm text-[var(--tuodonto-taupe)] sm:grid-cols-2 lg:grid-cols-3">
              <span className="flex min-w-0 items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--tuodonto-gold)]" />
                <span className="min-w-0 break-words">{settings.city}</span>
              </span>
              <a
                href={`tel:${settings.phone.replaceAll(" ", "")}`}
                className="tuodonto-focus flex min-w-0 items-start gap-2.5"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-[var(--tuodonto-gold)]" />
                <span className="min-w-0 break-words">{settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="tuodonto-focus flex min-w-0 items-start gap-2.5"
              >
                <AtSign className="mt-0.5 size-4 shrink-0 text-[var(--tuodonto-gold)]" />
                <span className="min-w-0 break-all">{settings.email}</span>
              </a>
            </div>
          </div>
        </footer>
      </main>

      <div className={`fixed inset-x-3 bottom-3 z-50 grid gap-2 rounded-full border border-white/70 bg-[rgba(247,246,243,.9)] p-2 shadow-[0_20px_60px_rgba(4,21,67,.16)] backdrop-blur-2xl lg:hidden ${navigation.public.citas ? "grid-cols-2" : "grid-cols-1"}`}>
        {navigation.public.citas ? (
          <Link
            href="/citas"
            className="tuodonto-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-full tuodonto-gold-fill text-sm font-semibold"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Cita
          </Link>
        ) : null}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="tuodonto-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-full tuodonto-sky-fill text-sm font-semibold"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
